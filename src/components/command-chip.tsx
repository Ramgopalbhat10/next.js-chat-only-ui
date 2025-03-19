"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getToolByCommand } from '@/lib/store';

interface CommandChipProps {
  command: string;
  onRemove: (command: string) => void;
}

export function CommandChip({ command, onRemove }: CommandChipProps) {
  // Ensure command has the right format (with slash)
  const normalizedCommand = command.startsWith('/') ? command : `/${command}`;
  const tool = getToolByCommand(normalizedCommand);
  
  console.log('CommandChip rendering with command:', normalizedCommand, 'tool:', tool);
  
  if (!tool) {
    console.warn('No tool found for command:', normalizedCommand);
    return null;
  }
  
  return (
    <Badge 
      variant="outline" 
      className="h-5 gap-1 text-xs px-1.5 py-0 border-neutral-300 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
    >
      <span>{tool.name}</span>
      <button
        type="button"
        onClick={() => onRemove(normalizedCommand)}
        className="inline-flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-800 focus:outline-none"
      >
        <XIcon className="h-3 w-3" />
        <span className="sr-only">Remove {tool.name}</span>
      </button>
    </Badge>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
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
