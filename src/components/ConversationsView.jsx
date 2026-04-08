import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MessageCircle, User, Mail, Calendar, ExternalLink, ShoppingCart, Download, Lock, Globe } from 'lucide-react';

const ConversationsView = ({ onViewDetail, settings, onUpgrade }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paged, setPaged] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${window.vibebuyData.apiUrl}connections?paged=${paged}&search=${encodeURIComponent(search)}`, {
        headers: { 'X-WP-Nonce': window.vibebuyData.nonce }
      });
      if (resp.ok) {
        const data = await resp.json();
        setConnections(data.items || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConnections();
    }, 300);
    return () => clearTimeout(timer);
  }, [paged, search]);

  const handleExport = () => {
    if (!settings?.is_pro || connections.length === 0) return;
    
    // CSV Construction
    const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Channel', 'Product', 'Qty', 'Date', 'Message', 'IP'];
    const rows = connections.map(item => [
      item.id,
      `"${item.customer_name.replace(/"/g, '""')}"`,
      item.customer_email,
      item.customer_phone || '',
      item.channel_id,
      `"${(item.product_title || 'N/A').replace(/"/g, '""')}"`,
      item.product_qty || 1,
      item.formatted_date,
      `"${(item.customer_message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      item.customer_ip || ''
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vibebuy-leads-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="vb-connections-container animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="vb-section-card">
        <div className="vb-section-header flex justify-between items-center">
          <div>
            <h2 className="vb-page-title">Lead Inquiries</h2>
            <p className="vb-section-subtitle">Realtime archive of messaging connection requests.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Filter leads..." 
                className="vb-input !w-64 pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPaged(1); }}
              />
            </div>

            <button 
              onClick={handleExport}
              className={`h-10 px-5 flex items-center gap-2 bg-white border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm relative group/export overflow-hidden ${
                settings?.is_pro 
                  ? 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95' 
                  : 'border-gray-100 text-gray-300 opacity-60 grayscale cursor-not-allowed'
              }`}
            >
               <Download className="w-3.5 h-3.5" /> 
               <span>Export</span>
                {!settings?.is_pro && (
                  <div className="absolute top-0 right-0 vb-badge-pro !rounded-none !rounded-bl-lg !px-2 !py-1">PRO</div>
                )}
            </button>
          </div>
        </div>

        {/* 2. Pro/Lite Storage Banner */}
        {!settings?.is_pro && (
          <div className="mx-8 mt-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-[20px] flex items-center gap-5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200/50">
                <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight">Lite Version Limit</p>
                  <span className="vb-badge-pro">10 INQUIRIES MAX</span>
                </div>
                <p className="text-[11px] text-amber-800/70 font-bold leading-relaxed italic">Upgrade to Pro for unlimited storage and full history.</p>
            </div>
            <button onClick={onUpgrade} className="px-5 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-all shadow-md">Upgrade Now</button>
          </div>
        )}

        <div className="transition-all duration-300">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="vb-spinner-sm" style={{ borderTopColor: '#3b82f6' }}></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing inquiries...</p>
            </div>
          ) : connections.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-100 mb-2">
                  <MessageCircle className="w-8 h-8 text-gray-200" />
              </div>
              <div>
                <p className="text-base font-black text-gray-900 mb-1">No results found</p>
                <p className="text-xs text-gray-400 font-medium italic">Try searching for a different name, email, or clear filters.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="vb-label border-b border-gray-50 px-8 py-5 text-left bg-gray-50/30 font-black">Target Item</th>
                      <th className="vb-label border-b border-gray-50 px-4 py-5 text-left bg-gray-50/30 font-black">Customer</th>
                      <th className="vb-label border-b border-gray-50 px-4 py-5 text-left bg-gray-50/30 font-black">Channel</th>
                      <th className="vb-label border-b border-gray-50 px-4 py-5 text-left bg-gray-50/30 font-black">Timestamp</th>
                      <th className="vb-label border-b border-gray-50 px-8 py-5 text-right bg-gray-50/30 font-black">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {connections.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-200 group-hover:scale-110 transition-transform">
                              {item.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight mb-1">{item.customer_name}</p>
                              <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-300" /> {item.customer_email}</p>
                              {item.order_id > 0 && (
                                <div className="mt-2">
                                  <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-lg border border-blue-200 uppercase tracking-tighter flex items-center gap-1 w-fit shadow-xs">
                                    <ShoppingCart className="w-3 h-3" /> Order #{item.order_id}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="max-w-[200px]">
                            <p className="text-xs font-black text-slate-700 truncate leading-tight group-hover:text-blue-600 transition-colors">
                              {item.product_title || `ID: #${item.product_id}`}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight opacity-70">
                              {item.product_qty ? `${item.product_qty} unit(s)` : 'Contextual Lead'}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xs ${
                            item.channel_id === 'whatsapp' 
                              ? 'bg-green-50 text-green-600 border-green-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {item.channel_id}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="max-w-[180px]">
                            <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed">
                              {item.customer_message ? `"${item.customer_message}"` : 'No custom message added...'}
                            </p>
                            <p className="text-[9px] font-bold text-slate-300 mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {item.formatted_date}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => onViewDetail(item.id)}
                            className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-2xl hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
                          >
                            Analyze Lead
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer Gated for LITE */}
              <div className={`px-8 py-6 bg-slate-50/80 flex items-center justify-between border-t border-slate-100 relative ${!settings?.is_pro ? 'opacity-60 grayscale' : ''}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Showing {connections.length} <span className="opacity-40">/</span> {totalItems} Inquiries
                    {!settings?.is_pro && (
                      <span className="vb-badge-pro ml-2">
                         LITE LIMIT REACHED
                      </span>
                    )}
                </p>
                
                <div className="flex items-center gap-3 relative group/pagination">
                    {!settings?.is_pro && (
                      <div className="absolute inset-0 z-10 cursor-not-allowed"></div>
                    )}
                    <button 
                      disabled={paged === 1 || !settings?.is_pro}
                      onClick={() => setPaged(prev => prev - 1)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transition-all disabled:opacity-40 shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-800 shadow-sm">
                      {paged} <span className="text-slate-300 mx-1">of</span> {totalPages}
                    </div>
                    <button 
                      disabled={paged === totalPages || !settings?.is_pro}
                      onClick={() => setPaged(prev => prev + 1)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transition-all disabled:opacity-40 shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                    
                    {!settings?.is_pro && (
                      <div className="absolute -top-10 right-0 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-2xl border border-gray-800 whitespace-nowrap opacity-0 group-hover/pagination:opacity-100 pointer-events-none transition-opacity">
                        Upgrade to PRO to unlock pagination
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsView;
