import React from 'react';
import { Phone } from 'lucide-react';
import ConfigStep from './ConfigStep.jsx';

const viber = {
  id: 'viber',
  name: 'Viber',
  description: 'Messaging and calling app popular in Eastern Europe and Asia.',
  icon: <Phone className="w-5 h-5 flex-shrink-0" />,
  color: 'bg-[#7360F2]',
  colorHex: '#7360F2',
  pro: true,

  defaults: {
    buttonText: 'Chat via Viber',
    bgColor: '#7360F2',
    textColor: '#ffffff',
    borderRadius: 50,
  },

  ConfigStep,
};

export default viber;
