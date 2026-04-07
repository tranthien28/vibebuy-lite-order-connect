import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MousePointer2, ShoppingBag, Globe, Share2, ChevronRight, Zap, Lock, MapPin, Clock } from 'lucide-react';

const AnalyticsView = ({ settings }) => {
  const isLite = !settings.is_pro;

  // Coordinate mapping for top countries (Percentage-based x, y on 1000x500 map)
  const countryCoords = {
    'VN': { x: 785, y: 310 }, // Vietnam
    'US': { x: 180, y: 190 }, // USA
    'SG': { x: 775, y: 345 }, // Singapore
    'TH': { x: 765, y: 300 }, // Thailand
    'JP': { x: 865, y: 185 }, // Japan
    'KR': { x: 835, y: 190 }, // Korea
    'GB': { x: 485, y: 130 }, // UK
    'FR': { x: 495, y: 155 }, // France
    'DE': { x: 515, y: 140 }, // Germany
    'AU': { x: 870, y: 410 }, // Australia
    'BR': { x: 320, y: 380 }, // Brazil
    'CA': { x: 180, y: 110 }, // Canada
    'IN': { x: 720, y: 270 }, // India
  };

  // Initialize with mock data for Lite to avoid flash
  const initialMockData = isLite ? {
    total_clicks: 1240,
    total_views: 4500,
    cr: (( (settings.totalConnections || 45) / 1240) * 100).toFixed(1),
    chart_data: [12, 18, 15, 25, 22, 30, 28],
    active_channels_count: settings.activeChannels?.length || 0,
    top_products: [
      { name: "Premium Coffee Mug", url: "/shop/premium-mug", count: 85 },
      { name: "Stainless Steel Bottle", url: "/shop/bottle", count: 62 },
      { name: "Eco-Friendly Tote Bag", url: "/shop/tote", count: 41 },
    ],
    top_locations: [
      { country: "Vietnam", code: "VN", count: 1250, percentage: 65 },
      { country: "United States", code: "US", count: 410, percentage: 15 },
      { country: "Singapore", code: "SG", count: 220, percentage: 10 },
      { country: "Other", code: "UN", count: 180, percentage: 10 },
    ],
    top_referrers: [
      { referrer: "Google Search", count: 530 },
      { referrer: "Facebook Ads", count: 420 },
      { referrer: "Direct Traffic", count: 290 },
    ],
    hourly_data: [
      { label: 'Morning', count: 120, color: '#3b82f6' },
      { label: 'Afternoon', count: 350, color: '#2563eb' },
      { label: 'Evening', count: 580, color: '#1d4ed8' },
      { label: 'Night', count: 190, color: '#1e3a8a' },
    ]
  } : null;

  const [loading, setLoading] = useState(!isLite);
  const [data, setData] = useState(initialMockData);

  useEffect(() => {
    if (isLite) {
      setLoading(false);
      return;
    }
    const payload = window.vibebuyData || {};
    fetch(`${payload.apiUrl}analytics`, {
      headers: { 'X-WP-Nonce': payload.nonce }
    })
      .then(r => r.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [settings.is_pro, settings.totalConnections]);

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[20px] border border-gray-100 shadow-sm">
      <div className="vb-spinner mb-4" />
      <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest leading-none">Analyzing Data...</p>
    </div>
  );

  if (!data) return null;

  // Simple SVG Line Chart Component
  const MiniTrendChart = ({ points }) => {
    if (!points || points.length === 0) return null;
    const max = Math.max(...points, 1);
    const width = 100;
    const height = 40;
    const step = width / (points.length - 1);
    const pathData = points.map((p, i) => `${i * step},${height - (p / max) * height}`).join(' L ');
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12 mt-4 opacity-100 transition-opacity" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${areaData}`} fill="url(#chartGradient)" />
        <path d={`M ${pathData}`} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // Simple SVG Donut Chart
  const DonutChart = ({ points }) => {
    const total = (points || []).reduce((acc, p) => acc + (p.count || 0), 0);

    return (
      <div className="relative w-32 h-32 transition-transform duration-500 hover:scale-110">
        <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
          {total === 0 ? (
            <circle cx="0" cy="0" r="1.0" fill="none" stroke="#f1f5f9" strokeWidth="0.25" />
          ) : (
            <>
              {(() => {
                let cumulativePercent = 0;
                const getCoordinatesForPercent = (percent) => {
                  const x = Math.cos(2 * Math.PI * percent);
                  const y = Math.sin(2 * Math.PI * percent);
                  return [x, y];
                };

                return points.map((p, i) => {
                  const count = p.count || 0;
                  if (count === 0) return null;
                  const startPercent = cumulativePercent;
                  const endPercent = cumulativePercent + (count / total);
                  cumulativePercent = endPercent;

                  const [startX, startY] = getCoordinatesForPercent(startPercent);
                  const [endX, endY] = getCoordinatesForPercent(endPercent);
                  const largeArcFlag = (count / total) > 0.5 ? 1 : 0;
                  const pathData = [
                    `M ${startX} ${startY}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `L 0 0`,
                  ].join(' ');

                  return <path key={i} d={pathData} fill={p.color} className="transition-all duration-300 hover:opacity-80" />;
                });
              })()}
            </>
          )}
          <circle cx="0" cy="0" r="0.75" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-slate-900 leading-none">
            {total > 0 ? (Math.round((points.find(p => p.label === 'Evening')?.count || 0) / total * 100) || 0) : 0}%
          </span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Evening</span>
        </div>
      </div>
    );
  };

  const ProBadge = ({ text = "PRO", className = "" }) => (
    <span className={`text-[9px] font-black bg-amber-400 text-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1 leading-none uppercase ${className}`}>
      <Lock className="w-2.5 h-2.5" /> {text}
    </span>
  );

  const CHECKOUT_URL = window.vibebuyData?.proLink || 'https://vibebuy.lemonsqueezy.com/checkout/buy/873a7dcf-83e1-4893-b5ed-df7009298e2d?logo=0';

  return (
    <div className="relative space-y-6">
      
      {/* 1. Header & Controls */}
      <div className="flex justify-between items-end mb-2 px-2">
         <div>
            <h2 className="vb-section-title">Store Analytics</h2>
            <p className="vb-section-subtitle">Detailed insights into customer interactions and conversion performance.</p>
         </div>
         <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl shadow-inner border border-gray-200">
            <button className="px-6 py-2 bg-white shadow-md rounded-xl text-[10px] font-black text-gray-900 border border-gray-100 transition-all cursor-default uppercase">REALTIME</button>
            <button className="px-6 py-2 text-[10px] font-bold text-gray-400 cursor-default uppercase">30 DAYS</button>
         </div>
      </div>

      {/* 2. Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Channels', value: data.active_channels_count || 0, icon: <Zap className="w-5 h-5" />, color: 'bg-blue-400', trend: data.trends?.channels || '+0%', sub: 'Total messaging endpoints', gated: false },
          { label: 'Total Inquiries', value: settings.totalConnections || 0, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-blue-500', trend: data.trends?.inquiries || '+0%', sub: 'Success leads collected', gated: false },
          { label: 'Total Clicks', value: data.total_clicks || 0, icon: <MousePointer2 className="w-5 h-5" />, color: 'bg-blue-600', trend: data.trends?.clicks || '+0%', sub: 'Total button interactions', gated: true },
          { label: 'Conv. Rate', value: `${data.cr || 0}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-blue-700', trend: data.trends?.cr || '+0%', sub: '(Inquiries / Clicks) × 100', gated: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[20px] border border-[#eef0f5] shadow-sm relative overflow-hidden group">
            {!settings.is_pro && stat.gated && (
              <div className="absolute top-3 right-3 z-10">
                <ProBadge />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
               <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 duration-300 ${!settings.is_pro && stat.gated ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                 {stat.icon}
               </div>
               <div className="text-right">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>{stat.trend}</span>
               </div>
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2 mb-1">
               <p className={`text-3xl font-black text-gray-900 tracking-tight ${!settings.is_pro && stat.gated ? 'blur-[3px] opacity-40' : ''}`}>{stat.value}</p>
            </div>
            <p className="text-[9px] text-gray-400 font-medium italic">{stat.sub}</p>
            {data.chart_data && <MiniTrendChart points={data.chart_data} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* 3. Traffic Origins */}
         <div className="vb-section-card relative overflow-hidden flex flex-col h-full cursor-default">
            {!settings.is_pro && (
              <div className="absolute top-4 right-4 z-20">
                <ProBadge />
              </div>
            )}
            <div className="vb-section-header border-b border-gray-50 flex items-center justify-between">
               <div>
                  <h2 className="vb-section-title">Traffic Origins</h2>
                  <p className="vb-section-subtitle">Realtime analysis of lead acquisition sources.</p>
               </div>
               <Share2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className={`p-4 flex-1 ${!settings.is_pro ? 'opacity-40 grayscale-[0.5]' : ''}`}>
               {(!data.top_referrers || data.top_referrers.length === 0) ? (
                 <div className="p-10 text-center flex flex-col items-center justify-center opacity-40 italic">
                   <Globe className="w-10 h-10 text-gray-200 mb-2" />
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No data available</p>
                 </div>
               ) : (
                 data.top_referrers.map((r, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-transparent">
                       <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">#{i+1}</div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{r.referrer || 'Direct Traffic'}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Source Identity</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-blue-600 leading-none mb-1">{r.count}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Leads</p>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* 4. Peak Engagement Hours */}
         <div className="vb-section-card h-full relative overflow-hidden flex flex-col cursor-default">
            {!settings.is_pro && (
              <div className="absolute top-4 right-4 z-20">
                <ProBadge />
              </div>
            )}
            <div className="vb-section-header border-b border-gray-50 flex items-center justify-between">
               <div>
                  <h2 className="vb-section-title">Peak Engagement</h2>
                  <p className="vb-section-subtitle">Hourly distribution of store interactions.</p>
               </div>
               <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className={`p-8 flex items-center gap-12 flex-1 justify-center ${!settings.is_pro ? 'opacity-40 grayscale-[0.5]' : ''}`}>
               <DonutChart points={data.hourly_data} />
               <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 max-w-[200px]">
                  {(data.hourly_data || []).length === 0 ? (
                    <div className="col-span-2 py-8 opacity-30 text-[10px] font-black uppercase tracking-[0.2em] text-center">Awaiting insights</div>
                  ) : (
                    (data.hourly_data || []).map((h, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: h.color }} />
                          <div className="min-w-0">
                             <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 truncate">{h.label}</p>
                             <p className="text-sm font-bold text-slate-900 leading-none">{h.count}</p>
                          </div>
                       </div>
                    ))
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5. Most Popular Products */}
        <div className={`${settings.is_pro ? 'lg:col-span-3' : 'lg:col-span-2'} vb-section-card relative overflow-hidden cursor-default transition-all duration-700`}>
          {!settings.is_pro && (
            <div className="absolute top-4 right-4 z-20">
              <ProBadge />
            </div>
          )}
          <div className="vb-section-header border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="vb-section-title">Product Interaction Rankings</h2>
              <p className="vb-section-subtitle">Catalog items generating the highest inquiry volume.</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`p-4 space-y-1 ${!settings.is_pro ? 'opacity-40 grayscale-[0.5]' : ''} ${settings.is_pro ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12' : ''}`}>
            {(!data.top_products || data.top_products.length === 0) ? (
              <div className="col-span-full p-16 text-center flex flex-col items-center justify-center opacity-40 italic">
                 <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No data available</p>
              </div>
            ) : (
              data.top_products.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-transparent truncate">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">#{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight">{p.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-slate-900 leading-none mb-0.5">{p.count}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Interactions</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Smart Recommendation */}
        {!settings.is_pro && (
          <div className="lg:col-span-1 p-6 rounded-[20px] border flex flex-col gap-6 relative overflow-hidden shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <div className="absolute top-4 right-4">
                  <ProBadge />
              </div>
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white shrink-0 shadow-lg bg-blue-500 shadow-blue-200/50">
                 <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                 <div className="flex items-center gap-2 mb-3">
                   <div className="w-2 h-2 rounded-full animate-pulse bg-blue-500" />
                   <h4 className="text-lg font-black leading-none text-blue-900">Smart Insight</h4>
                 </div>
                 <p className="text-sm font-bold leading-relaxed mb-4 text-blue-800">
                    Engagement peaks between <strong className="px-1 rounded bg-white text-blue-900">8 PM - 11 PM</strong>. 
                    <br/><br/>
                    Enable <strong className="underline decoration-blue-400">Business Hours</strong> to route evening inquiries and boost satisfaction.
                 </p>
              </div>
              <button 
                onClick={() => window.open(CHECKOUT_URL, '_blank')}
                className="mt-auto h-12 text-[11px] font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2 tracking-widest shadow-lg bg-blue-900 text-white hover:bg-black"
              >
                 ACTIVATE PRO <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        )}
      </div>

      {/* 7. Global Reach */}
      <div className="vb-section-card relative overflow-hidden cursor-default">
        {!settings.is_pro && (
          <div className="absolute top-4 right-4 z-20">
             <ProBadge className="shadow-lg animate-pulse" />
          </div>
        )}
        <div className="vb-section-header border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="vb-section-title">Customer Distribution Map</h2>
            <p className="vb-section-subtitle">Detailed geographical breakdown of current lead acquisition.</p>
          </div>
          <Globe className={`w-6 h-6 animate-spin-slow ${settings.is_pro ? 'text-blue-600' : 'text-blue-500'}`} />
        </div>
        <div className={`p-8 ${!settings.is_pro ? 'opacity-30 grayscale-[0.8]' : ''}`}>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-1 space-y-5">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Top Performing Regions</h5>
                 {(!data.top_locations || data.top_locations.length === 0) ? (
                    <p className="text-xs font-bold text-gray-300 italic uppercase">No data available</p>
                 ) : (
                    data.top_locations.map((loc, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-black text-slate-800">
                            <div className="flex items-center gap-2">
                               <span className="w-7 h-5 bg-slate-100 rounded flex items-center justify-center overflow-hidden border border-slate-200">
                                  <span className="text-[9px] font-black">{loc.code}</span>
                               </span>
                               <span className="text-sm">{loc.country}</span>
                            </div>
                            <span className="text-blue-600">{loc.percentage}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${i === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-slate-300'} rounded-full transition-all duration-[1500ms] ease-out`} 
                              style={{ width: `${loc.percentage}%` }} 
                            />
                         </div>
                      </div>
                    ))
                 )}
              </div>
              <div className="lg:col-span-2 relative">
                 <div className={`w-full h-96 rounded-[24px] border flex items-center justify-center relative overflow-hidden transition-all duration-700 ${
                   settings.is_pro ? 'bg-slate-900 border-blue-900/20 shadow-inner' : 'bg-slate-50 border-slate-100 shadow-inner'
                 }`}>
                    {/* Realistic World Map SVG Placeholder */}
                    <svg className={`absolute inset-0 w-full h-full p-4 transition-all duration-500 ${settings.is_pro ? 'text-blue-400/20' : 'text-blue-200'}`} viewBox="0 0 1000 500" fill="currentColor">
                       <path d="M150,150 Q200,100 300,150 T450,150 T600,200 T750,150 T900,250 L900,450 Q750,500 600,450 T450,400 T300,450 T150,350 Z" />
                       <path d="M220,180 Q250,160 280,200 T310,180 T350,220 T400,180 T450,230" strokeWidth="1" fill="none" stroke="currentColor"/>
                       {/* Simplified World Shape */}
                       <path d="M250,110 c-30,0 -50,20 -50,50 s20,50 50,50 s50,-20 50,-50 s-20,-50 -50,-50z M440,140 c-20,0 -40,10 -40,40 s20,40 40,40 s40,-10 40,-40 s-20,-40 -40,-40z M600,200 c-25,0 -45,20 -45,45 s20,45 45,45 s45,-20 45,-45 s-20,-45 -45,-45z M800,220 c-30,0 -55,25 -55,55 s25,55 55,55 s55,-25 55,-55 s-25,-55 -55,-55z M180,280 c-20,0 -35,15 -35,35 s15,35 35,35 s35,-15 35,-35 s-15,-35 -35,-35z M350,380 c-22,0 -40,18 -40,40 s18,40 40,40 s40,-18 40,-40 s-18,-40 -40,-40z" opacity="0.3" />
                    </svg>

                    {/* Active Customer Indicators (Pings) */}
                    {(data.top_locations || []).map((loc, i) => {
                      const coord = countryCoords[loc.code];
                      if (!coord) return null;
                      return (
                        <div key={i} className="absolute z-20 group" style={{ left: `${(coord.x / 1000) * 100}%`, top: `${(coord.y / 500) * 100}%` }}>
                           <div className="relative">
                              <div className={`w-3 h-3 rounded-full shadow-lg ${settings.is_pro ? 'bg-blue-500' : 'bg-blue-500'} relative z-10 animate-pulse`} />
                              <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${settings.is_pro ? 'bg-blue-400' : 'bg-blue-400'}`} style={{ animationDuration: `${2 + i * 0.5}s` }} />
                              
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                 <div className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap border border-slate-700">
                                    {loc.country}: {loc.percentage}%
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                    })}

                    {/* Placeholder Dots for Empty State to keep it looking "Global" */}
                    {(!data.top_locations || data.top_locations.length === 0) && (
                      <>
                        <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-slate-200 rounded-full opacity-40" />
                        <div className="absolute top-[40%] left-[60%] w-1.5 h-1.5 bg-slate-200 rounded-full opacity-40" />
                        <div className="absolute top-[60%] left-[40%] w-1.5 h-1.5 bg-slate-200 rounded-full opacity-40" />
                        <div className="absolute top-[20%] left-[80%] w-1.5 h-1.5 bg-slate-200 rounded-full opacity-40" />
                      </>
                    )}
                    
                    <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border z-20 transition-all ${
                      settings.is_pro ? 'bg-blue-900/80 border-blue-700' : 'bg-white/90 border-white/50'
                    }`}>
                       <p className={`text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-2 ${
                         settings.is_pro ? 'text-white' : 'text-slate-900'
                       }`}>
                          <Globe className={`w-3 h-3 ${settings.is_pro ? 'text-blue-400' : 'text-blue-500'}`} /> 
                          {settings.is_pro ? 'Interactive Insight Matrix' : 'Live Heatmap'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
