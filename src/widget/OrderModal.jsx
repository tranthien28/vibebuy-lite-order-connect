import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, User, Mail, MessageSquare, CheckCircle2, ShoppingCart, Phone } from 'lucide-react';

const OrderModal = ({ isOpen, onClose, onSubmit, channel, product, userData, settings }) => {
  const [formData, setFormData] = useState({
    customer_firstname: '',
    customer_lastname: '',
    customer_email: '',
    customer_phone: '',
    customer_message: ''
  });
  const [quantity, setQuantity] = useState(product?.qty || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Auto-fill Customer Profile logic
  useEffect(() => {
    if (isOpen && settings?.orderModal_autoFill !== false && userData) {
      setFormData(prev => ({
        ...prev,
        customer_firstname: userData.firstName || prev.customer_firstname,
        customer_lastname: userData.lastName || prev.customer_lastname,
        customer_email: userData.billingEmail || userData.email || prev.customer_email,
      }));
    }
  }, [isOpen, userData, settings?.orderModal_autoFill]);

  // Variation State
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [currentVariation, setCurrentVariation] = useState(null);

  // Ensure slots are ready after the template mounts to the body
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow the portal to commit to the DOM
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [isOpen]);

  // 1. Initial Sync from Page Selection
  useEffect(() => {
    if (isOpen) {
      if (product?.qty) setQuantity(parseInt(product.qty));

      if (product?.is_variable && product?.variations?.length > 0) {
        // If we already have a variation_id from the page, find it
        if (product.variation_id) {
          const found = product.variations.find(v => v.id === parseInt(product.variation_id));
          if (found) {
            setCurrentVariation(found);
            setSelectedAttrs(found.attributes || {});
            return;
          }
        }

        // Fallback: Use the first variation's attributes as initial state if nothing selected
        const firstVar = product.variations[0];
        setSelectedAttrs(firstVar.attributes || {});
        setCurrentVariation(firstVar);
      }
    }
  }, [isOpen, product?.id, product?.variation_id, product?.variations, product?.qty]);

  // 2. Match attributes to variation when changed
  useEffect(() => {
    if (product?.is_variable && Object.keys(selectedAttrs).length > 0) {
      const found = product.variations.find(v => {
        // Handle attribute keys robustly (some might have 'attribute_' prefix, some not)
        return Object.entries(selectedAttrs).every(([key, val]) => {
          const vVal = v.attributes[key] || v.attributes[`attribute_${key}`] || v.attributes[key.replace('attribute_', '')];
          return vVal === val;
        });
      });
      if (found) {
        setCurrentVariation(found);
      }
    }
  }, [selectedAttrs, product?.variations]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await onSubmit({
      customer_name: `${formData.customer_firstname} ${formData.customer_lastname}`.trim(),
      customer_firstname: formData.customer_firstname,
      customer_lastname: formData.customer_lastname,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      customer_message: formData.customer_message,
      channel_id: channel.id,
      product_id: product?.id || 0,
      variation_id: currentVariation?.id || product?.variation_id || 0,
      variation_name: currentVariation ? Object.entries(currentVariation.attributes).map(([k, v]) => `${k}: ${v}`).join(', ') : (product?.variation || ''),
      product_qty: quantity,
      product_url: product?.url || window.location.href
    });

    if (success) {
      setIsSuccess(true);

      // Wait a bit for the user to see the success state
      setTimeout(() => {
        setIsSuccess(false);

        // PRO: Redirect Logic
        if (settings.is_pro && settings.after_submission_action === 'redirect' && settings.after_submission_redirect_url) {
          window.location.href = settings.after_submission_redirect_url;
          return;
        }

        // Only WhatsApp in Lite opens a direct link. Other integrations use server-side push notifications.
        const activeChannels = settings.activeChannels || [];
        const isWhatsappActive = activeChannels.includes('whatsapp') || channel?.id === 'whatsapp';
        const shouldRedirectToChat = !settings.is_pro && isWhatsappActive;

        onClose(shouldRedirectToChat);
      }, 2000);
    } else {
      setIsSubmitting(false);
    }
  };

  const widgetData = window.vibebuyWidgetData || {};
  const strings = widgetData.strings || {};
  const templateHtml = widgetData.orderModalTemplate || '';

  // Return Portals into the Template Slots
  const renderSlots = () => {
    const slots = [];

    // Close Button Slot
    const closeEl = document.getElementById('vibe-slot-close');
    if (closeEl) {
      slots.push(createPortal(
        <button
          className="absolute top-3 right-3 z-50 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all text-gray-400 hover:text-gray-900 border border-gray-100"
          onClick={(e) => { e.stopPropagation(); onClose(false); }}
        >
          <X className="w-4 h-4" />
        </button>,
        closeEl
      ));
    }

    const imgEl = document.getElementById('vibe-slot-image');
    if (imgEl) {
      const displayImg = currentVariation?.image || product?.image || '';
      slots.push(createPortal(
        <div className="w-full h-full relative group bg-gray-50 flex items-center justify-center overflow-hidden">
          {displayImg && displayImg !== 'false' ? (
            <img
              src={displayImg}
              alt={product?.name || 'Product'}
              className="w-full h-full object-contain mix-blend-multiply opacity-0 transition-opacity duration-300"
              style={{ objectFit: 'contain' }}
              onLoad={(e) => e.target.style.opacity = 1}
              onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-gray-300">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-20" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">No Photo</span>
            </div>
          )}
        </div>,
        imgEl
      ));
    }

    const bRadius = settings.borderRadius !== undefined ? `${settings.borderRadius}px` : '10px';

    // Product Header Slots
    const nameEl = document.getElementById('vibe-slot-product-name');
    if (nameEl) {
      slots.push(createPortal(
        <h3 className="text-base font-black text-gray-900 leading-tight truncate">{product?.name || 'Inquiry'}</h3>,
        nameEl
      ));
    }

    const priceEl = document.getElementById('vibe-slot-product-price');
    if (priceEl) {
      const displayPrice = currentVariation?.formatted_price || product?.formatted_price || currentVariation?.price || product?.price || '';
      
      // Decode HTML entities (e.g. &nbsp; &#8363;) for correct rendering
      const decodeHtml = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      };

      slots.push(createPortal(
        <span 
          className="text-blue-600 text-[16px] font-black block leading-none mt-1"
          dangerouslySetInnerHTML={{ __html: decodeHtml(displayPrice) }}
        />,
        priceEl
      ));
    }

    const skuEl = document.getElementById('vibe-slot-product-sku');
    if (skuEl) {
      const displaySku = currentVariation?.sku || product?.sku || '';
      slots.push(createPortal(
        <div className="flex flex-col mt-1">
          <div className="flex flex-wrap gap-1.5">
            {displaySku && (
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">SKU: {displaySku}</span>
            )}
          </div>
        </div>,
        skuEl
      ));
    }

    // Variation Selector Slot
    const varSelectorEl = document.getElementById('vibe-slot-variation-selector');
    if (varSelectorEl && product?.is_variable && product?.variations?.length > 0) {
      const attributeOptions = {};
      product.variations.forEach(v => {
        Object.entries(v.attributes || {}).forEach(([key, val]) => {
          if (!attributeOptions[key]) attributeOptions[key] = new Set();
          attributeOptions[key].add(val);
        });
      });

      const normalizeLabel = (key) => {
        return key.replace('attribute_pa_', '').replace('attribute_', '').split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };

      slots.push(createPortal(
        <div className="mt-3 grid grid-cols-1 gap-3">
          {Object.entries(attributeOptions).map(([attrKey, optionsSet]) => (
            <div key={attrKey} className="flex flex-col">
              <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{normalizeLabel(attrKey)}</label>
              <select 
                style={{ borderRadius: bRadius }}
                className="h-9 px-3 bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none appearance-none cursor-pointer"
                value={selectedAttrs[attrKey] || ''}
                onChange={(e) => setSelectedAttrs({ ...selectedAttrs, [attrKey]: e.target.value })}
              >
                {Array.from(optionsSet).map(opt => (
                  <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>,
        varSelectorEl
      ));
    }

    // Quantity Selector Slot
    const qtyEl = document.getElementById('vibe-slot-quantity');
    if (qtyEl) {
      slots.push(createPortal(
        <div className="flex flex-col w-full">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1.5">{strings.quantity || 'Quantity'}</label>
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100 max-w-[130px]">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-100 text-gray-700 font-extrabold text-lg transition-all active:scale-95 shadow-sm"
            >-</button>
            <span className="flex-1 text-center text-[13px] font-black text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-md hover:bg-gray-100 text-gray-700 font-extrabold text-lg transition-all active:scale-95 shadow-sm"
            >+</button>
          </div>
        </div>,
        qtyEl
      ));
    }


    const fNameFieldEl = document.getElementById('vibe-slot-field-firstname');
    if (fNameFieldEl) {
      slots.push(createPortal(
        <div className="vibebuy-form-group">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{strings.firstName || 'First Name'}</label>
          <input
            type="text"
            style={{ borderRadius: bRadius }}
            className="h-9 px-3 w-full bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            required
            placeholder={strings.firstName || 'First Name'}
            value={formData.customer_firstname}
            onChange={e => setFormData({ ...formData, customer_firstname: e.target.value })}
          />
        </div>,
        fNameFieldEl
      ));
    }

    const lNameFieldEl = document.getElementById('vibe-slot-field-lastname');
    if (lNameFieldEl) {
      slots.push(createPortal(
        <div className="vibebuy-form-group">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{strings.lastName || 'Last Name'}</label>
          <input
            type="text"
            style={{ borderRadius: bRadius }}
            className="h-9 px-3 w-full bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            required
            placeholder={strings.lastName || 'Last Name'}
            value={formData.customer_lastname}
            onChange={e => setFormData({ ...formData, customer_lastname: e.target.value })}
          />
        </div>,
        lNameFieldEl
      ));
    }

    const emailFieldEl = document.getElementById('vibe-slot-field-email');
    if (emailFieldEl) {
      slots.push(createPortal(
        <div className="vibebuy-form-group">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{strings.email || 'Email'}</label>
          <input
            type="email"
            style={{ borderRadius: bRadius }}
            className="h-9 px-3 w-full bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            placeholder={strings.yourEmail || 'your@email.com'}
            required
            value={formData.customer_email}
            onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
          />
        </div>,
        emailFieldEl
      ));
    }

    const phoneFieldEl = document.getElementById('vibe-slot-field-phone');
    if (phoneFieldEl) {
      slots.push(createPortal(
        <div className="vibebuy-form-group">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{strings.phone || 'Phone Number'}</label>
          <input
            type="tel"
            style={{ borderRadius: bRadius }}
            className="h-9 px-3 w-full bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            placeholder="090xxxxxxx"
            required
            value={formData.customer_phone}
            onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
          />
        </div>,
        phoneFieldEl
      ));
    }

    const msgFieldEl = document.getElementById('vibe-slot-field-message');
    if (msgFieldEl) {
      slots.push(createPortal(
        <div className="vibebuy-form-group">
          <label className="text-[9px] font-black uppercase text-gray-400 mb-1">{strings.note || 'Note'}</label>
          <textarea
            style={{ borderRadius: bRadius }}
            className="p-3 w-full bg-gray-50 border border-gray-100 text-[13px] text-gray-700 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all outline-none min-h-[50px] resize-none"
            placeholder={strings.hiInterested || "I'm interested..."}
            rows={2}
            value={formData.customer_message}
            onChange={e => setFormData({ ...formData, customer_message: e.target.value })}
          />
        </div>,
        msgFieldEl
      ));
    }

    const submitEl = document.getElementById('vibe-slot-submit');
    if (submitEl) {
      slots.push(createPortal(
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-11 w-full text-white text-[13px] font-black tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 border-none outline-none"
          style={{ backgroundColor: settings.backgroundColor || '#22c55e', borderRadius: bRadius }}
        >
          {isSubmitting ? (
            <div className="vibebuy-spinner-sm" />
          ) : (
            <>{strings.sendRequest || 'Connect & Order'}{' '}<Send className="w-3.5 h-3.5" /></>
          )}
        </button>,
        submitEl
      ));
    }

    const successEl = document.getElementById('vibe-slot-success');
    if (successEl && isSuccess) {
      slots.push(createPortal(
        <div className="absolute inset-0 bg-white z-[60] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-base font-black text-gray-900">{strings.successTitle || 'Success!'}</p>
          <p className="text-[11px] text-gray-400 font-bold mt-1">{strings.successDescription || 'Your request has been sent successfully.'}</p>
        </div>,
        successEl
      ));
    }

    const brandingEl = document.getElementById('vibe-slot-branding');
    if (brandingEl && !settings.hideBranding && !settings.is_pro) {
      slots.push(createPortal(
        <div className="mt-6 flex items-center justify-center border-t border-gray-50 pt-3 opacity-60">
          <span className="text-[7.5px] uppercase tracking-[0.3em] font-black text-gray-300">
            Powered by VibeBuy
          </span>
        </div>,
        brandingEl
      ));
    }

    return slots;
  };

  const modalContainer = (
    <div
      className="vibebuy-modal-system font-sans"
      dangerouslySetInnerHTML={{ __html: templateHtml }}
    />
  );

  return (
    <>
      {createPortal(modalContainer, document.body)}
      {isReady && renderSlots()}
    </>
  );
};

export default OrderModal;

