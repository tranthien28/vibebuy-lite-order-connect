import React from 'react';
import { Smartphone, Image as ImageIcon, MessageCircle, Phone, Send } from 'lucide-react';

const PreviewWidget = ({ settings, previewMode, editChannel }) => {
  const activeChannelId = editChannel || settings.activeChannels?.[0] || 'whatsapp';
  
  const prefix = `${activeChannelId}_`;
  const get = (field, fallback) => {
    // If it's a global branding field, priority is global key (WITHOUT prefix)
    const globalKeyMap = {
      'bgColor': 'backgroundColor',
      'textColor': 'textColor',
      'borderRadius': 'borderRadius',
      'buttonText': 'buttonText',
      'fontSize': 'fontSize',
      'wooAutoInject': 'buttonPosition',
      'layout': 'buttonLayout',
      'iconUrl': 'iconUrl'
    };

    if (globalKeyMap[field] && settings[globalKeyMap[field]] !== undefined) {
      return settings[globalKeyMap[field]];
    }

    // Fallback to channel-specific or default
    return settings[prefix + field] ?? fallback;
  };

  const bgColor = get('bgColor', '#00c851');
  const textColor = get('textColor', '#ffffff');
  const borderRadius = get('borderRadius', 8);
  const buttonText = get('buttonText', 'Chat with us');
  const iconUrl = get('iconUrl', '');
  const position = get('wooAutoInject', 'before_cart');
  const layout = get('layout', 'stacked');
  const fontSize = get('fontSize', 14);

  const ChannelIcon = () => {
    if (iconUrl) return <img src={iconUrl} alt="" className="w-4 h-4 object-cover rounded-full" />;
    if (activeChannelId === 'whatsapp') return <Phone className="w-4 h-4 fill-current" />;
    if (activeChannelId === 'telegram') return <Send className="w-4 h-4" />;
    return <MessageCircle className="w-4 h-4" />;
  };

  const VibeButton = (
    <button
      className={`flex items-center justify-center gap-2 py-3 font-semibold transition-all ${layout === 'inline' ? 'flex-1' : 'w-full'}`}
      style={{ backgroundColor: bgColor, color: textColor, borderRadius: `${borderRadius}px`, fontSize: `${fontSize}px` }}
    >
      <ChannelIcon />
      {buttonText}
    </button>
  );

  const AddToCartButton = (
    <button className={`bg-gray-900 text-white py-3 font-semibold rounded-lg ${layout === 'inline' ? 'flex-1' : 'w-full'}`} style={{ fontSize: `${fontSize}px` }}>
      Add to Cart
    </button>
  );

  const ButtonGroup = (
    <div className={`flex ${layout === 'inline' ? 'flex-row gap-2' : 'flex-col gap-2'}`}>
      {position === 'before_cart' ? (
        <>
          {VibeButton}
          {AddToCartButton}
        </>
      ) : (
        <>
          {AddToCartButton}
          {VibeButton}
        </>
      )}
    </div>
  );

  // ── MOBILE VIEW ──────────────────────────────────────────────
  if (previewMode === 'mobile') {
    return (
      <div className="flex items-center justify-center">
        {/* Phone frame */}
        <div className="relative bg-black rounded-[32px] p-2 shadow-2xl" style={{ width: '190px', minHeight: '370px' }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-b-2xl z-10" />
          <div className="bg-white rounded-[24px] overflow-hidden h-full flex flex-col" style={{ minHeight: '350px' }}>
            {/* Product image */}
            <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-300 rounded" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Product Image</span>
            </div>
            
            {/* Product info lines */}
            <div className="px-3 py-2.5 space-y-1.5">
              <div className="h-2.5 bg-gray-200 rounded-full w-full" />
              <div className="h-2.5 bg-gray-200 rounded-full w-4/5" />
              <div className="h-2.5 bg-gray-100 rounded-full w-3/5" />
            </div>

            {/* Buttons */}
            <div className="px-3 pb-3">
              {ButtonGroup}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP VIEW ─────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Browser chrome */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full">
        {/* Browser bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400">
            yourstore.com/product/
          </div>
        </div>

        {/* Product page content */}
        <div className="flex-1 bg-white p-4 overflow-hidden">
          <div className="flex gap-4 h-full">
            {/* Product image left side */}
            <div className="w-2/5 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-300 rounded" />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Product</span>
            </div>

            {/* Right side: info + buttons */}
            <div className="flex-1 flex flex-col justify-between py-1">
              {/* Title lines */}
              <div className="space-y-2 mb-3">
                <div className="h-2.5 bg-gray-200 rounded-full w-full" />
                <div className="h-2.5 bg-gray-200 rounded-full w-4/5" />
                <div className="h-2 bg-gray-100 rounded-full w-2/5 mt-1" />
              </div>

              {/* Variations (Mock) */}
              <div className="space-y-3 mb-6">
                 <div className="flex gap-2">
                    {['S', 'M', 'L'].map(size => (
                       <div key={size} className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold ${size === 'M' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'}`}>
                          {size}
                       </div>
                    ))}
                 </div>
                 <div className="h-8 w-full bg-gray-50 border border-gray-100 rounded-lg flex items-center px-3 justify-between">
                    <span className="text-[10px] font-bold text-gray-400">Select Color</span>
                    <div className="w-2 h-2 border-r border-b border-gray-400 rotate-45 mb-1" />
                 </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                {ButtonGroup}
                
                {!settings.hideBranding && (
                  <div className="flex items-center justify-center gap-1 opacity-40">
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Powered by</span>
                    <span className="text-[8px] font-black uppercase text-blue-600 tracking-tighter">VibeBuy</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewWidget;
