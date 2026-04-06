import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, MessageCircle, User, Mail, Calendar, ExternalLink, ShoppingCart, Download, Lock, Globe } from 'lucide-react';

const ConversationsView = ({ onViewDetail, settings }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paged, setPaged] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewingItem, setViewingItem] = useState(null);

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
    <div className="vb-connections-container">
      <div className="vb-section-header flex justify-between items-center mb-6">
        <div>
          <h2 className="vb-section-title">Inquiries</h2>
          <p className="vb-section-subtitle">Manage inquiries and leads from your chat buttons.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="vb-search-wrap relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="vb-search-input pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 w-64"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPaged(1); }}
            />
          </div>
          <button 
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-xs font-black uppercase transition-all shadow-sm relative group/export overflow-hidden ${
              settings?.is_pro 
                ? 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600' 
                : 'border-gray-100 text-gray-300 opacity-60 grayscale cursor-not-allowed'
            }`}
          >
             <Download className="w-4 h-4" /> Export Leads
             {!settings?.is_pro && (
               <>
                 <div className="absolute top-0 right-0 py-0.5 px-1.5 bg-amber-400 text-white text-[7px] font-black uppercase rounded-bl shadow-sm">PRO</div>
                 <div className="absolute bottom-full mb-3 right-0 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover/export:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-95 group-hover/export:scale-100 shadow-xl border border-gray-800 z-50">
                   <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> CSV/Excel Export (PRO)
                 </div>
               </>
             )}
          </button>
        </div>
      </div>

      {!settings?.is_pro && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-[16px] flex items-center gap-4">
           <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-white shrink-0">
              <Lock className="w-4 h-4" />
           </div>
           <div className="flex-1">
              <p className="text-sm font-black text-amber-900 leading-tight">VibeBuy Lite – 10 Inquiries Max</p>
              <p className="text-xs text-amber-700/80 font-medium">Your current plan only stores the 10 most recent inquiries. Upgrade to Pro for unlimited storage.</p>
           </div>
        </div>
      )}

      <div className="vb-connections-list bg-white rounded-[20px] border border-[#eef0f5] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading inquiries...</div>
        ) : connections.length === 0 ? (
          <div className="p-12 text-center text-gray-400 italic">No inquiries found yet.</div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Context</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Channel</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {connections.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                          {item.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">{item.customer_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><Mail className="w-3 h-3" /> {item.customer_email}</p>
                          {item.order_id > 0 && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-tighter flex items-center gap-1">
                                <ShoppingCart className="w-2.5 h-2.5" /> Order #{item.order_id}
                              </span>
                            </div>
                          )}
                          {item.customer_ip && (
                            <p className="text-[8px] text-gray-300 font-bold mt-1 flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" /> IP: {item.customer_ip}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-700 truncate block max-w-[150px]">
                        {item.product_title || `ID: #${item.product_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.channel_id === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.channel_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-500 truncate max-w-[200px] italic">
                         {item.customer_message ? `"${item.customer_message}"` : 'No message...'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="w-3 h-3" /> {item.formatted_date}
                       </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => onViewDetail(item.id)}
                        className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200"
                       >
                         VIEW DETAIL
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Showing {connections.length} of {totalItems} Inquiries
               </p>
               <div className="flex items-center gap-2">
                  <button 
                    disabled={paged === 1}
                    onClick={() => setPaged(prev => prev - 1)}
                    className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-black text-gray-900 px-2">Page {paged} of {totalPages}</span>
                  <button 
                    disabled={paged === totalPages}
                    onClick={() => setPaged(prev => prev + 1)}
                    className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationsView;
