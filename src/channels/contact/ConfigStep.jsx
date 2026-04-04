import React from 'react';
import { Lock, Check } from 'lucide-react';

const ConfigStep = ({ channel, settings, updateSetting, onNavigate }) => {
  const prefix = `${channel.id}_`;
  const get = (field, fallback = '') => settings[prefix + field] ?? fallback;

  const activeChannels = settings.activeChannels || [];
  const isActive = activeChannels.includes(channel.id);

  const toggleChannel = () => {
    let newActive;
    if (isActive) {
      newActive = activeChannels.filter(id => id !== channel.id);
    } else {
      newActive = settings.is_pro ? [...activeChannels, channel.id] : [channel.id];
    }
    updateSetting('activeChannels', newActive);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${isActive ? 'bg-teal-50/50 border-teal-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
        <div>
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            Inquiry Form Status
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{isActive ? 'Form collection active' : 'Channel offline'}</p>
        </div>
        <button onClick={toggleChannel} className={`vb-toggle ${isActive ? 'vb-toggle--on' : 'vb-toggle--off'}`}>
          <div className={`vb-toggle-thumb ${isActive ? 'vb-toggle-thumb--on' : 'vb-toggle-thumb--off'}`} />
        </button>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest block"> Form Title </label>
        <input
          type="text"
          value={get('title')}
          onChange={e => updateSetting(`${prefix}title`, e.target.value)}
          placeholder="Send us an inquiry"
          className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-teal-500 transition-all"
        />
        
        <div className="pt-2">
           <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest block mb-3">Required Fields</label>
           <div className="grid grid-cols-2 gap-2">
              {['Full Name', 'Email', 'Phone', 'Message'].map(f => (
                 <div key={f} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{f}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {!settings.is_pro && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
          <Lock className="w-4 h-4 text-amber-500" />
          <p className="text-[10px] font-bold text-amber-700">This is a PRO channel. Upgrade to enable form collection.</p>
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 text-center">
         <code className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-black text-blue-600 inline-block shadow-sm">
            {`[vibebuy channel="${channel.id}"]`}
         </code>
      </div>
    </div>
  );
};

export default ConfigStep;
