"use client";

import { create } from 'zustand';
import { Message, TOOLS } from './mock-data';
import { nanoid } from 'nanoid';

interface ChatState {
  messages: Message[];
  activeTools: string[];
  isLoading: boolean;
  isOpen: boolean;
  isExpanded: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addTool: (command: string) => void;
  removeTool: (command: string) => void;
  clearTools: () => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  toggleChat: () => void;
  toggleExpand: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeTools: [],
  isLoading: false,
  isOpen: true, // Start with chat open
  isExpanded: false, // Start with chat not expanded
  
  addMessage: (message) => {
    console.log('addMessage called with:', message);
    const id = nanoid(); // Generate a stable ID
    
    // Create a new message object with all properties
    const newMessage: Message = {
      ...message,
      id,
      timestamp: '2023-09-10T12:00:00.000Z', // Use a static timestamp to avoid hydration mismatch
    };
    
    console.log('New message created:', newMessage);
    
    set((state) => {
      console.log('Current messages:', state.messages);
      return {
        messages: [...state.messages, newMessage],
      };
    });
  },
  
  addTool: (command) => {
    console.log('Adding tool:', command);
    // Make sure we format the command correctly (add / if missing)
    const formattedCommand = command.startsWith('/') ? command : `/${command}`;
    
    set((state) => ({
      activeTools: state.activeTools.includes(formattedCommand)
        ? state.activeTools
        : [...state.activeTools, formattedCommand],
    }));
  },
  
  removeTool: (command) => {
    console.log('Removing tool:', command);
    set((state) => ({
      activeTools: state.activeTools.filter((cmd) => cmd !== command),
    }));
  },
  
  clearTools: () => {
    console.log('Clearing all tools');
    set({ activeTools: [] });
  },
  
  clearMessages: () => {
    console.log('Clearing all messages');
    set({ messages: [] });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },
  
  toggleExpand: () => {
    console.log('Toggling expanded state');
    set((state) => ({ isExpanded: !state.isExpanded }));
  },
}));

export function getToolByCommand(command: string) {
  // Normalize command to handle both with and without slash
  const normalizedCommand = command.startsWith('/') ? command : `/${command}`;
  return TOOLS.find((tool) => tool.command === normalizedCommand);
}

export function filterToolsByQuery(query: string) {
  console.log('Filtering tools by query:', query);
  
  // If query doesn't start with /, return no results except for exact matches
  if (!query.startsWith('/')) {
    // Check if this is a known tool command without the slash
    const exactMatchWithoutSlash = TOOLS.find(
      (tool) => tool.command === `/${query}` || tool.command.slice(1) === query
    );
    return exactMatchWithoutSlash ? [exactMatchWithoutSlash] : [];
  }
  
  const normalizedQuery = query.slice(1).toLowerCase();
  console.log('Normalized query:', normalizedQuery);
  
  if (!normalizedQuery) return TOOLS;
  
  // Check for exact match first
  const exactMatch = TOOLS.find(
    (tool) => tool.command.toLowerCase() === query.toLowerCase() || 
              tool.command.slice(1).toLowerCase() === normalizedQuery
  );
  
  if (exactMatch) {
    console.log('Found exact match:', exactMatch);
    return [exactMatch];
  }
  
  // Otherwise do partial matching
  const matches = TOOLS.filter((tool) => {
    return (
      tool.command.toLowerCase().includes(normalizedQuery) ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery)
    );
  });
  
  console.log('Found partial matches:', matches);
  return matches;
}
