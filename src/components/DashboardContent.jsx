import React from 'react';
import { 
  Zap, MessageSquare, MousePointer2, TrendingUp, 
  Share2, Save 
} from 'lucide-react';
import { CHANNELS } from '../channels/registry.jsx';
import MessageTemplateEditor from './MessageTemplateEditor.jsx';
import ConversationsView from './ConversationsView.jsx';
import AnalyticsView from './AnalyticsView.jsx';
import ConversationDetailView from './ConversationDetailView.jsx';
import HelpView from './HelpView.jsx';
import LicenseView from './LicenseView.jsx';
import GlobalSettingsView from './GlobalSettingsView.jsx';

const DashboardContent = ({ 
  activeTab, settings, updateSetting, setSettings, startConfig, 
  handleSave, saving, onUpgrade, onNavigate, onViewDetail, 
  detailId, helpContext, setToast, calcProgress 
}) => {

  const toggleChannel = (channelId) => {
    const activeChannels = settings.activeChannels || [];
    const isNowActive = !activeChannels.includes(channelId);

    let newActive;
    if (settings.is_pro) {
      newActive = isNowActive
        ? [...activeChannels, channelId]
        : activeChannels.filter(id => id !== channelId);
    } else {
      newActive = isNowActive ? [channelId] : [];
    }

    const updatedSettings = { ...settings, activeChannels: newActive };
    updateSetting('activeChannels', newActive);
    handleSave(updatedSettings);
  };

  return (
    <>
      <div className="vb-page-header">
        <h1 className="vb-page-title">
          {activeTab === 'dashboard' && 'Dashboard'}
          {activeTab === 'templates' && 'Message Templates'}
          {(activeTab === 'conversations' || activeTab === 'inquiries') && 'Leads & Inquiries'}
          {activeTab === 'analytics' && 'Analytics'}
          {activeTab === 'settings' && 'Global Settings'}
          {activeTab === 'help' && 'Help & Tutorials'}
          {activeTab === 'license' && 'License & Activation'}
        </h1>
      </div>

      <div className="vb-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="vb-cards-grid">
              {/* Card 1: Active Channels */}
              <div className="vb-section-card p-5">
                <div className="vb-card-icon-wrap bg-blue-50">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <p className="vb-card-label mt-3">Active Channels</p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{settings.activeChannels?.length || 0}</p>
                  <p className="text-xs font-bold text-slate-300">/ {CHANNELS.length}</p>
                </div>
              </div>

              {/* Card 2: Total Inquiries */}
              <div className="vb-section-card p-5 cursor-pointer border-blue-50 hover:border-blue-100 transition-all group" onClick={() => onNavigate('inquiries')}>
                <div className="vb-card-icon-wrap bg-blue-50">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <p className="vb-card-label mt-3">Total Inquiries</p>
                <p className="text-3xl font-black text-blue-600 tracking-tight">{settings.totalConnections || 0}</p>
              </div>

              {/* Card 3: Total Clicks */}
              <div className="vb-section-card p-5 relative group">
                {!settings.is_pro && <div className="vb-badge-pro absolute top-3 right-3">PRO</div>}
                <div className="vb-card-icon-wrap bg-slate-50">
                  <MousePointer2 className="w-4 h-4 text-gray-600" />
                </div>
                <p className="vb-card-label mt-3">Total Clicks</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-black ${!settings.is_pro ? 'text-slate-300 blur-[2px]' : 'text-slate-800'}`}>
                    {settings.is_pro ? (settings.totalClicks || 0) : '0'}
                  </p>
                  {!settings.is_pro && <span className="vb-badge-pro">Gated</span>}
                </div>
              </div>

              {/* Card 4: Conv. Rate */}
              <div className="vb-section-card p-5 relative group">
                {!settings.is_pro && <div className="vb-badge-pro absolute top-3 right-3">PRO</div>}
                <div className="vb-card-icon-wrap bg-slate-50">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <p className="vb-card-label mt-3">Conv. Rate</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-black ${!settings.is_pro ? 'text-slate-300 blur-[2px]' : 'text-slate-800'}`}>
                    {settings.is_pro ? (settings.cr || '0') + '%' : '0%'}
                  </p>
                  {!settings.is_pro && <span className="vb-badge-pro">Gated</span>}
                </div>
              </div>
            </div>

            <div className="vb-section-card mt-8">
              <div className="vb-section-header">
                <h2 className="vb-section-title">Messaging Engines</h2>
                <p className="vb-section-subtitle">Configure and manage your messaging channels</p>
              </div>
              <div className="vb-channel-list">
                {CHANNELS.map(ch => {
                  const isActive = (settings.activeChannels || []).includes(ch.id);
                  const isLocked = ch.pro && !settings.is_pro;
                  return (
                    <div key={ch.id} className={`vb-channel-row ${isLocked ? 'opacity-70 grayscale' : ''}`}>
                      <div className={`vb-channel-icon ${ch.color}`}>{ch.icon}</div>
                      <div className="vb-channel-info">
                        <div className="flex items-center gap-2">
                          <span className="vb-channel-name">{ch.name}</span>
                          {(!ch.pro || settings.is_pro) && (
                            <button
                              onClick={() => toggleChannel(ch.id)}
                              className={`vb-toggle ${isActive ? 'vb-toggle--on' : 'vb-toggle--off'} scale-75 origin-left`}
                            >
                              <div className={`vb-toggle-thumb ${isActive ? 'vb-toggle-thumb--on' : 'vb-toggle-thumb--off'}`} />
                            </button>
                          )}
                          <span className={`vb-status-badge ${isActive ? 'vb-status-badge--active' : 'vb-status-badge--inactive'}`}>
                            {isActive ? 'ACTIVE' : 'IN-ACTIVE'}
                          </span>
                        </div>
                        <p className="vb-channel-desc">{ch.desc || ch.description}</p>
                        <div className="flex gap-2 mt-1">
                          {settings[`${ch.id}_show_as_shortcut`] ? (
                            <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                              <Share2 className="w-2.5 h-2.5" /> DIRECT SHORTCUT
                            </span>
                          ) : (
                            <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                              <MousePointer2 className="w-2.5 h-2.5" /> LEAD INQUIRY
                            </span>
                          )}
                        </div>
                      </div>
                      {(!ch.pro || settings.is_pro) ? (
                        <div className="flex gap-2">
                          <button className="vb-configure-btn" onClick={() => startConfig(ch.id)}>Configure</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 cursor-pointer" onClick={onUpgrade}>
                          <span className="vb-badge-pro">Pro Feature</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'templates' && (
          <div className="vb-section-card mb-20">
            <div className="vb-section-header">
              <h2 className="vb-section-title">Global Message Template</h2>
              <p className="vb-section-subtitle">Used by all channels by default.</p>
            </div>
            <div className="p-6">
              <MessageTemplateEditor
                value={settings.global_message_template}
                onChange={(val) => updateSetting('global_message_template', val)}
                isPro={settings.is_pro}
              />
              <div className="vb-floating-footer">
                <button onClick={() => handleSave()} disabled={saving} className="vb-footer-save">
                  {saving ? <div className="vb-spinner-sm" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'conversations' || activeTab === 'inquiries') && (
          <ConversationsView settings={settings} onViewDetail={onViewDetail} onUpgrade={onUpgrade} />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView settings={settings} />
        )}

        {activeTab === 'conversation-detail' && (
          <ConversationDetailView id={detailId} onBack={() => onNavigate('conversations')} isPro={settings.is_pro} />
        )}

        {activeTab === 'help' && (
          <HelpView onNavigate={onNavigate} initialSection={helpContext} />
        )}

        {activeTab === 'settings' && (
          <GlobalSettingsView
            settings={settings}
            updateSetting={updateSetting}
            handleSave={handleSave}
            saving={saving}
          />
        )}

        {activeTab === 'license' && (
          <LicenseView
            settings={settings}
            onUpdateSettings={setSettings}
            onToast={(title, desc, type) => setToast({ message: title, desc, type })}
          />
        )}
      </div>
    </>
  );
};

export default DashboardContent;
