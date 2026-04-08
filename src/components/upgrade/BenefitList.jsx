import { 
  Check, Zap, BarChart3, MousePointer2, Sparkles, 
  Target, Share2, Clock 
} from 'lucide-react';

const BENEFITS = [
  { 
    icon: <Sparkles className="w-4 h-4 text-amber-500" />, 
    title: 'Omnichannel Messaging', 
    desc: 'Unlock 11+ channels including Zalo, Messenger, TikTok, Instagram.' 
  },
  { 
    icon: <BarChart3 className="w-4 h-4 text-blue-500" />, 
    title: 'Advanced Analytics', 
    desc: 'Real-time conversion tracking, heatmaps, and hourly trends.' 
  },
  { 
    icon: <Target className="w-4 h-4 text-purple-500" />, 
    title: 'Smart Targeting Pro', 
    desc: 'Filter by OS (iOS/Android), Browser, and Geo-location.' 
  },
  { 
    icon: <Share2 className="w-4 h-4 text-pink-500" />, 
    title: 'Social Shortcut Bar', 
    desc: 'Floating mini-icons for secondary social links & whitelabel.' 
  },
  { 
    icon: <Clock className="w-4 h-4 text-green-500" />, 
    title: 'Business Hours & Stock', 
    desc: 'Automate visibility based on shop hours or inventory levels.' 
  },
];

const BenefitList = () => {
  return (
    <div className="vb-benefit-list">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pro Features</h3>
      </div>
      
      <div className="space-y-2">
        {BENEFITS.map((b, i) => (
          <div key={i} className="vb-benefit-item group">
            <div className="vb-benefit-icon-wrap">
              {b.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                {b.title}
              </p>
              <p className="text-[10px] text-gray-400">
                {b.desc}
              </p>
            </div>
            <div className="vb-benefit-check">
              <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
        <p className="text-[10px] text-purple-600 font-medium leading-tight">
          Unlock the full potential of your store with VibeBuy Pro.
        </p>
      </div>
    </div>
  );
};

export default BenefitList;
