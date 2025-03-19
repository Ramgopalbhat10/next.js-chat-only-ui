"use client";

import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/chat-input';
import { ChatMessage } from '@/components/chat-message';

export function ChatContainer() {
  const { messages, isOpen, toggleChat, isExpanded, toggleExpand } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('Messages length:', messages.length);
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg bg-black text-white"
        size="icon"
        aria-label="Open chat"
      >
        <MessageIcon className="h-5 w-5" />
      </Button>
    );
  }

  // Dynamic styles based on expanded state
  const containerStyle = {
    width: isExpanded ? '600px' : '384px', // 96px = 6rem (w-96)
    height: isExpanded ? '85vh' : '600px',
    maxHeight: '90vh',
    transition: 'width 0.3s ease, height 0.3s ease',
  };

  return (
    <div 
      className="fixed bottom-4 right-4 rounded-lg shadow-lg bg-white border border-neutral-200 flex flex-col overflow-hidden"
      style={containerStyle}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-black text-white shrink-0">
        <div className="flex items-center">
          <h2 className="font-medium text-sm">Enterprise Assistant</h2>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-neutral-800"
            onClick={toggleExpand}
            aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            {isExpanded ? (
              <CollapseIcon className="h-4 w-4 text-white" />
            ) : (
              <ExpandIcon className="h-4 w-4 text-white" />
            )}
            <span className="sr-only">{isExpanded ? "Collapse chat" : "Expand chat"}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-neutral-800"
            onClick={toggleChat}
          >
            <XIcon className="h-4 w-4 text-white" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 bg-white overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-5">
            <div className="text-center">
              <h2 className="font-bold text-xl mb-2">Welcome!</h2>
              <p className="text-sm text-neutral-600 mb-5">
                Ask me anything or use commands like /jira or /workday
              </p>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm font-normal px-3 py-2 h-auto border border-neutral-200 hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  Jira: Show tickets
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm font-normal px-3 py-2 h-auto border border-neutral-200 hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  Jira: Ticket details
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm font-normal px-3 py-2 h-auto border border-neutral-200 hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  Jira: Create issue
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm font-normal px-3 py-2 h-auto border border-neutral-200 hover:bg-neutral-50"
                  onClick={() => {}}
                >
                  Jira: Search issues
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-3 py-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      {/* Input Container */}
      <div className="p-3 border-t border-neutral-200 bg-white shrink-0">
        <ChatInput />
      </div>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function CollapseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 19v-2a4 4 0 0 0-4-4H8.5" />
      <path d="M17.5 19H20" />
      <path d="M15 5v2a4 4 0 0 0 4 4h2.5" />
      <path d="M17.5 5H20" />
      <path d="M8.5 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.5" />
      <path d="M4 15h3.5" />
      <path d="M4 11h3.5" />
      <path d="M4 7h3.5" />
    </svg>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
