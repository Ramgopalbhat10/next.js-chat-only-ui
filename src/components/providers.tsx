'use client';

import React from 'react';
import { ChatContainer } from './chat-container';

export function ChatProvider() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  // Only render the chat container on the client side after hydration
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null; // Return nothing during SSR
  }
  
  return <ChatContainer />;
}
