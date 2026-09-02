import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

const ChatMessage = ({ message, isOwnMessage }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 relative shadow-sm ${
          isOwnMessage
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
        }`}
      >
        {!isOwnMessage && (
          <p className='text-xs text-slate-500 mb-1 font-semibold'>
            {message.senderName}
          </p>
        )}
        
        <p className='break-words whitespace-pre-wrap text-[15px] leading-relaxed'>{message.content}</p>
        
        <div className={`flex items-center gap-1.5 justify-end mt-1.5 text-[11px] font-medium ${
          isOwnMessage ? 'text-primary-100' : 'text-slate-400'
        }`}>
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && (
            message.read ? (
              <CheckCheck className='w-3.5 h-3.5 text-blue-200' />
            ) : (
              <Check className='w-3.5 h-3.5' />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
