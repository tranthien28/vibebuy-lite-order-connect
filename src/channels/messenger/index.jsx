import React from 'react';
import { MessageCircle } from 'lucide-react';
import ConfigStep from './ConfigStep.jsx';

const messenger = {
  id: 'messenger',
  name: 'Messenger',
  description: 'Facebook Messenger for seamless business communication.',
  icon: <MessageCircle className="w-5 h-5 flex-shrink-0" />,
  color: 'bg-gradient-to-r from-[#0084FF] to-[#A033FF]',
  colorHex: '#0084FF',
  pro: true,

  defaults: {
    buttonText: 'Chat via Messenger',
    bgColor: '#0084FF',
    textColor: '#ffffff',
    borderRadius: 50,
  },

  ConfigStep,
};

export default messenger;
