"use client";

import React, { useEffect } from 'react';
import { Message } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { getToolByCommand } from '@/lib/store';
import { MessageWidgets } from '@/components/message-widgets';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  useEffect(() => {
    console.log('ChatMessage rendered with message:', message);
    if (message.widgets) {
      console.log('Message has widgets:', message.widgets);
    }
  }, [message]);

  return (
    <div 
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className={`flex flex-col ${
        message.role === 'user' ? 'items-end' : 'items-start'
      } ${message.widgets ? 'w-full' : 'max-w-[90%]'}`}>
        {/* Tools badges */}
        {message.tools && message.tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {message.tools.map((tool) => {
              const toolInfo = getToolByCommand(tool);
              return (
                <Badge 
                  key={tool} 
                  variant="outline" 
                  className="text-[10px] px-1 py-0 h-4 bg-transparent border-neutral-300"
                >
                  {toolInfo?.name || tool}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Message content */}
        <div className={`px-3 py-2 text-sm rounded-md shadow-sm ${
          message.role === 'user' 
            ? 'bg-black text-white' 
            : 'bg-neutral-100 text-neutral-800'
        } ${message.widgets ? 'mb-2' : ''}`}>
          {message.content}
        </div>

        {/* Message widgets */}
        {message.widgets && message.widgets.length > 0 && (
          <div className="w-full mt-2">
            <MessageWidgets widgets={message.widgets} />
          </div>
        )}
      </div>
    </div>
  );
}
