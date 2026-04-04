import React from 'react';
import { MessageCircle } from 'lucide-react';
import ConfigStep from './ConfigStep.jsx';

const zalo = {
  id: 'zalo',
  name: 'Zalo',
  description: 'Most popular messaging app in Vietnam. ~75M users.',
  icon: <MessageCircle className="w-5 h-5 flex-shrink-0" />,
  color: 'bg-[#0068FF]',
  colorHex: '#0068FF',
  pro: true,

  defaults: {
    buttonText: 'Chat via Zalo',
    bgColor: '#0068FF',
    textColor: '#ffffff',
    borderRadius: 50,
  },

  ConfigStep,
};

export default zalo;
