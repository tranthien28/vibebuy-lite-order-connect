import React from 'react';
import { Check } from 'lucide-react';

const Toast = ({ message, desc }) => (
  <div className="vb-toast-wrap">
    <div className="vb-toast">
      <div className="vb-toast-icon">
        <Check className="w-4 h-4 text-green-500" strokeWidth={3} />
      </div>
      <div>
        <p className="vb-toast-title">{message}</p>
        <p className="vb-toast-desc">{desc}</p>
      </div>
    </div>
  </div>
);

export default Toast;
