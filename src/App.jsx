import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, Smartphone, Monitor, Eye } from 'lucide-react';

import { getChannel } from './channels/registry.jsx';
import Sidebar from './components/Sidebar.jsx';
import Toast from './components/Toast.jsx';
import DashboardContent from './components/DashboardContent.jsx';
import PreviewWidget from './components/PreviewWidget.jsx';
import ProUpgradeModal from './components/upgrade/ProUpgradeModal.jsx';

// --- Constants ---
const VERSION = 'v1.0.3';

// --- Helpers ---
const getUrlParam = (name, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
};

const calcProgress = (channelId, settings) => {
  let done = 0;
  if (!settings) return 0;
  if (settings[`${channelId}_number`] || settings[`${channelId}_botToken`] || settings[`${channelId}_botUsername`]) done++;
  if (settings[`${channelId}_buttonText`] || settings[`${channelId}_bgColor`] || settings[`${channelId}_iconUrl`]) done++;
  if (settings[`${channelId}_wooAutoInject`] !== undefined) done++;
  return done;
};

const App = () => {
  const [activeTab, setActiveTab] = useState(() => getUrlParam('tab', 'dashboard'));
  const [currentStep, setCurrentStep] = useState(() => parseInt(getUrlParam('step', '0'), 10) || 0);
  const [editChannel, setEditChannel] = useState(() => getUrlParam('channel', 'whatsapp'));
  const [previewMode, setPreviewMode] = useState('mobile');
  const [detailId, setDetailId] = useState(() => getUrlParam('id', null));
  const [settings, setSettings] = useState({
    activeChannels: [],
    global_message_template: '',
    is_pro: window.vibebuyData?.is_pro || false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [helpContext, setHelpContext] = useState(null);

  const navigateToHelp = (section = null) => {
    setHelpContext(section);
    setActiveTab('help');
    setCurrentStep(0);
  };

  useEffect(() => {
    if (!window.vibebuyData) { setLoading(false); return; }
    fetch(`${window.vibebuyData.apiUrl}settings`, { headers: { 'X-WP-Nonce': window.vibebuyData.nonce } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings(prev => ({ ...prev, ...data })); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location);
    url.searchParams.set('page', 'vibebuy');
    url.searchParams.set('tab', activeTab);

    if (activeTab === 'dashboard' && currentStep > 0) {
      url.searchParams.set('channel', editChannel);
      url.searchParams.set('step', currentStep);
    } else {
      url.searchParams.delete('channel');
      url.searchParams.delete('step');
    }

    if (activeTab === 'conversation-detail' && detailId) {
      url.searchParams.set('id', detailId);
    } else {
      url.searchParams.delete('id');
    }

    window.history.pushState({}, '', url);
  }, [activeTab, currentStep, editChannel, detailId]);

  useEffect(() => {
    const root = document.getElementById('vibebuy-admin-root');
    if (root) {
      const parent = root.closest('#wpbody-content');
      if (parent) { parent.style.padding = '0'; parent.style.backgroundColor = '#f5f6fa'; }
      const wrap = root.closest('.wrap');
      if (wrap) wrap.style.margin = '0';
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setCurrentStep(0);
  };

  const startConfig = (id) => {
    setEditChannel(id);
    setCurrentStep(1);
    setActiveTab('dashboard');
  };

  const handleSave = async (manualSettings = null) => {
    const settingsToSave = manualSettings || settings;
    setSaving(true);
    try {
      const res = await fetch(`${window.vibebuyData.apiUrl}settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': window.vibebuyData.nonce },
        body: JSON.stringify(settingsToSave),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(prev => ({ ...prev, ...json.data }));
        }
        setToast({ message: 'Settings Saved', desc: 'Success!' });
        setTimeout(() => {
          setToast(null);
          if (currentStep === 3) setCurrentStep(0);
        }, 2000);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="vb-loading">
      <div className="vb-spinner" />
      <p>Loading Dashboard...</p>
    </div>
  );

  const channel = getChannel(editChannel);
  const StepComponent = { 1: channel.ConfigStep }[currentStep];

  return (
    <div className="vb-shell">
      <Sidebar 
        activeTab={activeTab} 
        onNavigate={handleNavigate} 
        onUpgrade={() => setShowUpgradeModal(true)} 
        settings={settings} 
        version={VERSION}
      />
      
      <div className="vb-main">
        {currentStep === 0 ? (
          <DashboardContent
            activeTab={activeTab}
            settings={settings}
            updateSetting={updateSetting}
            setSettings={setSettings}
            startConfig={startConfig}
            handleSave={handleSave}
            saving={saving}
            onUpgrade={() => setShowUpgradeModal(true)}
            onNavigate={handleNavigate}
            onViewDetail={(id) => {
              setDetailId(id);
              setActiveTab('conversation-detail');
            }}
            detailId={detailId}
            helpContext={helpContext}
            setToast={setToast}
            calcProgress={calcProgress}
          />
        ) : (
          <div className="vb-wizard-inner">
            <header className="vb-wizard-header">
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentStep(0)} className="vb-back-btn">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="w-px h-5 bg-gray-200" />
                <div className="vb-wizard-title-group">
                  <div className={`vb-channel-icon-sm ${channel.color} mr-2`}>{channel.icon}</div>
                  <h1 className="vb-wizard-title">{channel.name} Connection</h1>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={settings.is_pro ? 'vb-header-version-green' : 'vb-header-version-gray'}>
                  {settings.is_pro ? 'VibeBuy Pro' : 'VibeBuy Lite'}
                </span>
                <span className="vb-header-version-gray">{VERSION}</span>
              </div>
            </header>

            <main className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Configuration Form */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="vb-section-card p-0 overflow-visible">
                    <div className="p-8">
                      {StepComponent ? (
                        <StepComponent
                          channel={channel}
                          settings={settings}
                          updateSetting={updateSetting}
                          setCurrentStep={setCurrentStep}
                          onNavigate={handleNavigate}
                          onHelp={navigateToHelp}
                        />
                      ) : (
                        <div className="text-center py-20">
                          <div className="vb-spinner-sm mx-auto mb-4" />
                          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading configuration...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="lg:w-[320px] shrink-0">
                  <div className="sticky top-8 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Live Preview</h3>
                      <div className="bg-gray-100 p-1 rounded-xl shadow-inner flex items-center gap-1">
                        <button
                          onClick={() => setPreviewMode('mobile')}
                          className={`p-1.5 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600 border border-gray-100' : 'text-gray-400 opacity-40'}`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewMode('desktop')}
                          className={`p-1.5 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600 border border-gray-100' : 'text-gray-400 opacity-40'}`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] p-3 border border-slate-100 flex items-center justify-center relative shadow-inner">
                      <PreviewWidget settings={settings} previewMode={previewMode} editChannel={editChannel} />
                    </div>
                    <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <p className="vb-label flex items-center gap-2">
                        <Eye className="w-3 h-3 text-blue-500" /> Visual Context
                      </p>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                        The preview reflects your current <strong>{channel.name}</strong> configuration alongside global branding settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      <ProUpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      {toast && <Toast {...toast} />}
    </div>
  );
};

const root = document.getElementById('vibebuy-admin-root');
if (root) createRoot(root).render(<App />);

export default App;
