import React from 'react';
import { 
  LayoutDashboard, MessageSquare, BarChart3, Settings, 
  HelpCircle, Zap, ShieldCheck 
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, onUpgrade, settings, version }) => (
  <aside className="vb-sidebar">
    <div className="vb-sidebar-logo flex items-center gap-3">
      <div className="vb-logo-icon overflow-hidden bg-white shadow-sm border border-gray-100 p-1.5 flex items-center justify-center">
        {window.vibebuyData?.logoUrl ? (
          <img
            src={window.vibebuyData.logoUrl}
            alt="VibeBuy"
            className="w-full h-full object-contain"
          />
        ) : (
          <Zap className="w-4 h-4 text-blue-500" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="vb-logo-text leading-tight">VibeBuy</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 opacity-70 uppercase tracking-tight">{version}</span>
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${settings.is_pro ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
            {settings.is_pro ? 'PRO' : 'LITE'}
          </span>
        </div>
      </div>
    </div>
    <nav className="vb-sidebar-nav">
      <button onClick={() => onNavigate('dashboard')} className={`vb-nav-item ${activeTab === 'dashboard' ? 'vb-nav-item--active' : ''}`}>
        <LayoutDashboard className="w-4 h-4 shrink-0" /> Dashboard
      </button>
      <button onClick={() => onNavigate('inquiries')} className={`vb-nav-item ${activeTab === 'inquiries' || activeTab === 'conversations' ? 'vb-nav-item--active' : ''}`}>
        <MessageSquare className="w-4 h-4 shrink-0" /> Inquiries
      </button>
      <button
        onClick={() => onNavigate('analytics')}
        className={`vb-nav-item ${activeTab === 'analytics' ? 'vb-nav-item--active' : ''}`}
      >
        <BarChart3 className="w-4 h-4 shrink-0" /> Analytics
      </button>
      <button onClick={() => onNavigate('templates')} className={`vb-nav-item ${activeTab === 'templates' ? 'vb-nav-item--active' : ''}`}>
        <MessageSquare className="w-4 h-4 shrink-0" /> Message Templates
      </button>
      <button onClick={() => onNavigate('settings')} className={`vb-nav-item ${activeTab === 'settings' ? 'vb-nav-item--active' : ''}`}>
        <Settings className="w-4 h-4 shrink-0" /> Global Settings
      </button>
      {/* License Tab only shows if Pro is installed or active */}
      {(window.vibebuyData?.isProInstalled || settings.is_pro) && (
        <button onClick={() => onNavigate('license')} className={`vb-nav-item ${activeTab === 'license' ? 'vb-nav-item--active' : ''}`}>
          <ShieldCheck className="w-4 h-4 shrink-0" /> License
        </button>
      )}
      <button onClick={() => onNavigate('help')} className={`vb-nav-item ${activeTab === 'help' ? 'vb-nav-item--active' : ''}`}>
        <HelpCircle className="w-4 h-4 shrink-0" /> Help
      </button>
    </nav>
    <div className="vb-sidebar-bottom">
      {!settings.is_pro && (
        <div className="vb-upgrade-box mb-4">
          <div className="vb-upgrade-box-icon">
            <Zap className="w-4 h-4" />
          </div>
          <div className="vb-upgrade-title">Upgrade to VibeBuy Pro</div>
          <p className="vb-upgrade-desc">Unlock Analytics, unlimited messaging channels and advanced sales features.</p>
          <button onClick={onUpgrade} className="vb-upgrade-btn">
            Unlock Pro Now
          </button>
        </div>
      )}
      <div className="vb-version-badge">
        <div className="vb-version-dot" />
        <span>VibeBuy</span>
        <span className="vb-version-num">{version}</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
