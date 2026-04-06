import React, { useState } from 'react';
import { 
  Send, Hash, MessageSquare, ChevronRight, 
  ExternalLink, CheckCircle2, 
  AlertCircle, Lock, Layout, Camera, Music, Link2, Mail, MessageCircle
} from 'lucide-react';

const HelpView = ({ onNavigate, initialSection }) => {
  const [activeTab, setActiveTab] = useState(initialSection || 'general');

  const tabs = [
    { id: 'general', name: 'General Guide', icon: <Layout className="w-4 h-4" /> },
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'telegram', name: 'Telegram', icon: <Send className="w-4 h-4" /> },
    { id: 'discord', name: 'Discord', icon: <Hash className="w-4 h-4" /> },
    { id: 'messenger', name: 'Messenger', icon: <MessageCircle className="w-4 h-4" />, pro: true },
    { id: 'zalo', name: 'Zalo', icon: <MessageSquare className="w-4 h-4" />, pro: true },
    { id: 'viber', name: 'Viber', icon: <MessageSquare className="w-4 h-4" />, pro: true },
    { id: 'instagram', name: 'Instagram', icon: <Camera className="w-4 h-4" />, pro: true },
    { id: 'tiktok', name: 'TikTok', icon: <Music className="w-4 h-4" />, pro: true },
    { id: 'line', name: 'LINE', icon: <MessageCircle className="w-4 h-4" />, pro: true },
    { id: 'contact', name: 'Contact Form', icon: <Mail className="w-4 h-4" />, pro: true },
    { id: 'custom', name: 'Custom Link', icon: <Link2 className="w-4 h-4" />, pro: true },
    { id: 'templates', name: 'UI Overrides', icon: <Layout className="w-4 h-4" /> },
  ];

    const renderTutorial = () => {
      const currentTab = tabs.find(t => t.id === activeTab);
      
      const proBadge = currentTab?.pro ? (
        <div className="mb-6 flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100 w-fit">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Pro Feature</span>
          <span className="text-xs">This channel is available in VibeBuy Pro.</span>
        </div>
      ) : null;

      switch (activeTab) {
        case 'general':
          return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-black text-gray-900 mb-6">Mastering VibeBuy Setup</h3>
            <div className="grid grid-cols-1 gap-12">
               <div className="group border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                    <h4 className="font-bold text-gray-800">Connection & API</h4>
                  </div>
                  <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-gray-200">
                    <Layout className="w-8 h-8 text-purple-200" />
                  </div>
                  <p className="text-sm text-gray-500">Choose your channels and enter tokens or webhook URLs to get started.</p>
               </div>
               <div className="group border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                    <h4 className="font-bold text-gray-800">Design Customization</h4>
                  </div>
                  <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-gray-200">
                    <Layout className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-sm text-gray-500">Customize Layout, Palette, Targets, colors, and button positions to match your branding perfectly.</p>
               </div>
               <div className="group border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                    <h4 className="font-bold text-gray-800">Display Logic</h4>
                  </div>
                  <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-gray-200">
                    <Layout className="w-8 h-8 text-green-200" />
                  </div>
                  <p className="text-sm text-gray-500">Define where buttons appear (Product Pages, Cart, or Global) and set visibility rules.</p>
               </div>
            </div>
          </div>
        );
      case 'telegram':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-blue-500" />
              Setting up Telegram Bot
            </h3>
            
            <div className="w-full h-48 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-8 border border-dashed border-blue-100">
              <Send className="w-10 h-10 text-blue-200" />
            </div>

            <div className="space-y-8">
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Create a Bot via @BotFather</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Open Telegram and search for <a href="https://t.me/BotFather" target="_blank" className="text-blue-500 hover:underline font-medium">@BotFather</a>. 
                  Send <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600">/newbot</code> and follow the instructions to get your <b>Bot Token</b>.
                </p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-gray-800 mb-2">Get your Personal Chat ID</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Search for <a href="https://t.me/userinfobot" target="_blank" className="text-blue-500 hover:underline font-medium">@userinfobot</a> and send any message. 
                  It will reply with your <b>Chat ID</b>.
                </p>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-800 italic">
                    <b>Important:</b> Start a chat with your new Bot first so it can message you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'discord':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Hash className="w-6 h-6 text-[#5865F2]" />
              Setting up Discord Webhooks
            </h3>
            
            <div className="w-full h-48 bg-indigo-50/50 rounded-2xl flex items-center justify-center mb-8 border border-dashed border-indigo-100">
              <Hash className="w-10 h-10 text-indigo-200" />
            </div>

            <div className="space-y-8">
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-indigo-100 text-[#5865F2] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Open Server Settings</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  In Discord, click the channel settings (Gear icon) where you want notifications.
                </p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-indigo-100 text-[#5865F2] rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-gray-800 mb-2">Integrations & Webhooks</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Select <b>Integrations</b> &gt; <b>Webhooks</b>. Create a "New Webhook" and click <b>Copy Webhook URL</b>.
                </p>
              </div>
            </div>
          </div>
        );
      case 'whatsapp':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {proBadge}
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-green-500" />
                    WhatsApp Number Format
                </h3>
             </div>

             <div className="w-full h-48 bg-green-50/50 rounded-2xl flex items-center justify-center mb-8 border border-dashed border-green-100">
                <MessageSquare className="w-10 h-10 text-green-200" />
             </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Use International Format
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Always include the country code but <b>DO NOT</b> include +, spaces, or leading zeros. 
                    Correct example: <code className="bg-white px-2 py-1 rounded text-green-600 font-bold border border-green-100">15550123456</code>
                </p>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Layout className="w-6 h-6 text-purple-500" />
              Customizing the Order Modal
            </h3>
            
            <div className="prose prose-sm max-w-none text-gray-500 space-y-6">
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-purple-900">
                <h4 className="flex items-center gap-2 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" /> 
                  How to Override
                </h4>
                <p className="text-sm">
                  Copy <code className="bg-white/50 px-1 rounded">plugins/vibebuy-order-connect-lite/templates/order-modal.php</code> <br/> 
                  to <code className="bg-white/50 px-1 rounded">themes/your-theme/vibebuy/order-modal.php</code>
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Required Slot IDs</h4>
                <p className="mb-4">React injects the interface into these specific IDs. Ensure your custom template includes them:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-image</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-product-name</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-product-price</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-quantity</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-field-name</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-field-email</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-field-phone</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-field-message</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-submit</div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">#vibe-slot-success</div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-800 italic">
                  <b>Pro Tip:</b> You can rearrange the Layout, Palette, Target, but do not remove these IDs or the modal logic will break. 
                  The modal uses <b>Tailwind CSS</b> for styling.
                </p>
              </div>
            </div>
          </div>
        );
      case 'messenger':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#0084FF]" />
              Setting up Facebook Messenger
            </h3>
            <div className="space-y-8">
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 text-[#0084FF] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Find Your Facebook Page ID</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Go to your Facebook Page, click on <b>About</b>, then <b>Page Transparency</b> to view your <b>Page ID</b>. You can also directly enter your Facebook Page URL (e.g. facebook.com/pagename).
                </p>
              </div>
            </div>
          </div>
        );
      case 'viber':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#7360F2]" />
              Setting up Viber Chat
            </h3>
            <div className="space-y-8">
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-[#7360F2]/10 text-[#7360F2] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Create a Viber Bot / Enter Number</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  You can enter your personal phone number registered with Viber, or create a Viber Bot account via the <b>Viber Partner Network</b> and retrieve the Bot ID / Token.
                </p>
              </div>
            </div>
          </div>
        );
      case 'zalo':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#0068FF]" />
              Setting up Zalo Connect
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 text-[#0068FF] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Get your Zalo Phone or OA ID</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  You can use either your <b>Personal Phone Number</b> registered with Zalo (e.g. 0912345678) or your <b>Official Account ID</b>. 
                </p>
              </div>
            </div>
          </div>
        );
      case 'instagram':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-[#E1306C]" />
              Setting up Instagram
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-pink-100 text-[#E1306C] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Get your Instagram Username</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Simply enter your Instagram App username (without the @ symbol). This will redirect customers to ig.me/m/yourusername to start a direct message.
                </p>
              </div>
            </div>
          </div>
        );
      case 'tiktok':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Music className="w-6 h-6 text-black" />
              Setting up TikTok
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-gray-200 text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Get your TikTok Username</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Enter your TikTok profile username. Clicking the button will open your TikTok profile directly in the app.
                </p>
              </div>
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[#00C300]" />
              Setting up LINE
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-green-100 text-[#00C300] rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Get your LINE ID</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  Enter your LINE Official Account ID or personal LINE ID. The plugin uses line.me/ti/p/ to initiate a chat with your account.
                </p>
              </div>
            </div>
          </div>
        );
      case 'custom':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-purple-600" />
              Setting up Custom Link
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Add Any Destination URL</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  You can use the Custom channel to redirect users to <b>any URL</b> (e.g. your support portal, a Google Form, or another platform). Simply paste the full URL including https://.
                </p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {proBadge}
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-gray-700" />
              Setting up Contact Form Email
            </h3>
            <div className="space-y-8">
               <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="font-bold text-gray-800 mb-2">Email Notifications</h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                  The Contact channel will send an email to the admin with the customer's inquiry details. Ensure that your WordPress mail settings are configured correctly (e.g., via an SMTP plugin).
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-60 space-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
              `}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-blue-50' : 'bg-gray-100/50'}`}>
                {tab.icon}
              </div>
              <span className="text-sm">{tab.name}</span>
              {tab.pro && <Lock className="w-3 h-3 ml-auto text-gray-300" />}
              {!tab.pro && activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
          
          <div className="pt-6">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Documentation</p>
                <p className="text-[11px] font-medium mb-3">Learn everything about VibeBuy Connect.</p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1">
                    Read Docs <ExternalLink className="w-3 h-3" />
                </button>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[420px] bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          {renderTutorial()}
        </div>
      </div>
    </div>
  );
};

export default HelpView;
