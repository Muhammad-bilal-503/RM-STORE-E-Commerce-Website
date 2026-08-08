import React from 'react';
import { FaExclamationCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const Message = ({ variant = 'info', children }) => {
  let colorClasses = '';
  let Icon = FaInfoCircle;
  
  switch (variant) {
    case 'danger':
      colorClasses = 'bg-red-100 text-red-700 border-red-300';
      Icon = FaExclamationCircle;
      break;
    case 'success':
      colorClasses = 'bg-green-100 text-green-700 border-green-300';
      Icon = FaCheckCircle;
      break;
    case 'warning':
      colorClasses = 'bg-yellow-100 text-yellow-700 border-yellow-300';
      Icon = FaExclamationCircle;
      break;
    default:
      colorClasses = 'bg-blue-100 text-blue-700 border-blue-300';
      Icon = FaInfoCircle;
  }
  
  return (
    <div className={`p-4 mb-4 flex items-center border-l-4 rounded ${colorClasses}`}>
      <Icon className="mr-2" size={20} />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Message; 