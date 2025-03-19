"use client";

import React from 'react';
import { CommandIcon } from 'lucide-react';
import { Tool } from '@/lib/mock-data';

interface CommandSuggestionProps {
  suggestions: Tool[];
  onSelect: (command: string) => void;
}

export function CommandSuggestions({ suggestions, onSelect }: CommandSuggestionProps) {
  if (suggestions.length === 0) return null;
  
  const handleSelect = (tool: Tool) => {
    console.log('Command suggestion selected:', tool);
    
    // Extract just the command name without the slash
    const commandName = tool.command.startsWith('/') 
      ? tool.command.substring(1) 
      : tool.command;
    
    onSelect(commandName);
  };
  
  return (
    <div className="absolute bottom-full mb-1 left-0 w-full max-h-[180px] overflow-y-auto rounded-md bg-white shadow-md border border-neutral-200 z-10">
      <div className="p-1">
        {suggestions.map((tool) => (
          <button
            key={tool.command}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 rounded-sm"
            onClick={() => handleSelect(tool)}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600">
              <CommandIcon className="h-3 w-3" />
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium">{tool.name}</span>
              <span className="text-xs text-neutral-500">{tool.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
