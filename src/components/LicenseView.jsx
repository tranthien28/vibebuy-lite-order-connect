import React, { useState } from 'react';
import { Shield, Key, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const LicenseView = ({ settings, onUpdateSettings, onToast }) => {
  const [key, setKey] = useState(settings.license_key || '');
  const [activating, setActivating] = useState(false);
  const isPro = settings.is_pro || false;

  const handleActivate = async () => {
    if (!key) return;
    setActivating(true);

    try {
      const response = await fetch(`${window.vibebuyData.apiUrl}activate-license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.vibebuyData.nonce
        },
        body: JSON.stringify({ license_key: key })
      });

      const data = await response.json();

      if (data.success) {
        onUpdateSettings({ ...settings, is_pro: true, license_key: key });
        onToast('Success!', 'Your VibeBuy PRO license is now active.', 'success');
      } else {
        onToast('Activation Failed', data.message || 'Invalid license key.', 'error');
      }
    } catch (err) {
      onToast('Error', 'Connection failed. Please try again.', 'error');
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your PRO license? All premium targeting rules will be paused.')) return;
    setActivating(true);

    try {
      const response = await fetch(`${window.vibebuyData.apiUrl}deactivate-license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.vibebuyData.nonce
        }
      });

      const data = await response.json();
      if (data.success) {
        onUpdateSettings({ ...settings, is_pro: false, license_key: '' });
        onToast('License Deactivated', 'Your VibeBuy PRO features have been deactivated.', 'success');
      }
    } catch (err) {
      onToast('Error', 'Connection failed. Please try again.', 'error');
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="vb-content-card max-w-2xl">
        {isPro ? (
          <div className="p-10 text-center relative overflow-hidden border-blue-100 bg-gradient-to-b from-white to-blue-50/30 rounded-3xl border">
             <div className="relative z-10">
               <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 animate-bounce-slow">
                  <CheckCircle2 className="w-10 h-10 text-white" />
               </div>
               <h2 className="text-2xl font-black text-gray-900 mb-2">License is Active!</h2>
               <p className="text-sm text-gray-500 mb-8 px-6 font-medium leading-relaxed">
                 You have successfully unlocked all <strong>VibeBuy PRO</strong> features. Enjoy unlimited channels, premium FX, and advanced analytics on your store.
               </p>
               <div className="flex flex-col items-center gap-4">
                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-blue-100 rounded-2xl shadow-sm">
                     <Key className="w-5 h-5 text-blue-500" />
                     <span className="text-base font-mono font-bold text-gray-700 tracking-wider">•••• •••• •••• {key.slice(-4)}</span>
                  </div>
                  
                  <button 
                    disabled={activating}
                    onClick={handleDeactivate}
                    className="text-[11px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors mt-6 pb-1 border-b border-transparent hover:border-red-200"
                  >
                    Disconnect License
                  </button>
               </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100/20 rounded-full blur-3xl" />
          </div>
        ) : (
          <div className="vb-section-card max-w-2xl mx-auto">
              <div className="vb-section-header flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="vb-page-title">Activate VibeBuy PRO</h3>
                    <p className="vb-section-subtitle">Enter your license key from Lemon Squeezy to unlock premium features.</p>
                 </div>
              </div>

              <div className="p-8 space-y-6">
                 <div className="space-y-3">
                    <label className="vb-label">VibeBuy License Key</label>
                    <div className="relative group">
                      <input 
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="vb-input !h-14 !px-6 !text-xl font-mono"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                         <Key className="w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                    </div>
                 </div>

                 <button 
                   disabled={activating || !key}
                   onClick={handleActivate}
                   className="w-full py-5 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-gray-200 hover:shadow-gray-300 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                 >
                   {activating ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <Sparkles className="w-5 h-5 text-amber-400" />
                   )}
                   {activating ? 'Validating Key...' : 'Activate Pro Now'}
                 </button>

                 <div className="pt-2 flex items-center gap-3 justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                      Don't have a key? <a href="https://vibebuy.lemonsqueezy.com/checkout/buy/873a7dcf-83e1-4893-b5ed-df7009298e2d?logo=0" target="_blank" className="text-blue-600 font-black hover:underline underline-offset-4">Get Pro Access</a>
                    </p>
                 </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicenseView;
