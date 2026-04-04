import React from 'react';
import { MessageSquare } from 'lucide-react';
import ConfigStep from './ConfigStep.jsx';

const line = {
  id: 'line',
  name: 'Line',
  description: 'Popular messaging app in Asia, especially Japan and Thailand.',
  icon: <MessageSquare className="w-5 h-5 flex-shrink-0" />,
  color: 'bg-[#00C300]',
  colorHex: '#00C300',
  pro: true,

  defaults: {
    buttonText: 'Chat via Line',
    bgColor: '#00C300',
    textColor: '#ffffff',
    borderRadius: 50,
  },

  ConfigStep,
};

export default line;
