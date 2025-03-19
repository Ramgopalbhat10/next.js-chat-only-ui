"use client";

import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandChip } from '@/components/command-chip';
import { CommandSuggestions } from '@/components/command-suggestions';
import { filterToolsByQuery, useChatStore } from '@/lib/store';
import { sendMessage } from '@/lib/chat-service';

export function ChatInput() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<ReturnType<typeof filterToolsByQuery>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    addMessage, 
    activeTools, 
    addTool, 
    removeTool, 
    clearTools,
    isLoading,
    setLoading 
  } = useChatStore();

  useEffect(() => {
    console.log('Active tools updated:', activeTools);
  }, [activeTools]);

  useEffect(() => {
    if (inputValue.includes('/')) {
      const lastSlashIndex = inputValue.lastIndexOf('/');
      const query = inputValue.substring(lastSlashIndex);
      const filteredSuggestions = filterToolsByQuery(query);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      console.log('Command suggestions:', filteredSuggestions);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && activeTools.length === 0) return;
    
    // Check if there's a command in input that should be converted to a chip
    const commandMatch = inputValue.match(/\/([a-zA-Z0-9_]+)/);
    if (commandMatch) {
      const commandText = commandMatch[0];
      const commandName = commandMatch[1];
      
      console.log('Submit with command detected:', commandName);
      
      // Add the command to active tools if it's valid
      const validSuggestions = filterToolsByQuery(commandText);
      if (validSuggestions.length > 0) {
        console.log('Adding valid command on submit:', commandName);
        addTool(commandName);
        
        // Remove the command from input
        const newInputValue = inputValue.replace(commandText, '').trim();
        setInputValue(newInputValue);
        
        // If there's no other text besides the command, process the message
        if (!newInputValue) {
          processMessage(newInputValue);
          return;
        }
      }
    }
    
    // Process message normally
    processMessage(inputValue);
  };
  
  const processMessage = async (text: string) => {
    console.log('Submitting message with input:', text, 'and tools:', activeTools);
    
    // Add user message
    addMessage({
      content: text,
      role: 'user',
      tools: activeTools,
    });
    
    // Clear input but keep tools active
    setInputValue('');
    
    // Set loading
    setLoading(true);
    
    try {
      // Get response from backend
      console.log('Sending message to backend with tools:', activeTools);
      const response = await sendMessage(text, activeTools);
      console.log('Received response from backend:', response);
      
      // Add assistant message
      addMessage(response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle selection of suggestion with keyboard
    if (showSuggestions && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      e.preventDefault();
    }
    
    // Add slash command if / is typed
    if (e.key === '/') {
      console.log('Slash key pressed, showing suggestions');
      setShowSuggestions(true);
    }
    
    // Handle command conversion on space
    if (e.key === ' ') {
      console.log('Space key pressed with input:', inputValue);
      // Match any command pattern like "/jira" at the end of the input
      const commandMatch = inputValue.match(/\/([a-zA-Z0-9_]+)$/);
      if (commandMatch) {
        const commandName = commandMatch[1];
        console.log('Found command:', commandName);
        
        // Check if this is a valid command
        const validSuggestions = filterToolsByQuery(`/${commandName}`);
        console.log('Valid suggestions for space key:', validSuggestions);
        
        if (validSuggestions.length > 0) {
          e.preventDefault();
          console.log('Adding tool on space key:', commandName);
          addTool(commandName);
          setInputValue(inputValue.replace(/\/[a-zA-Z0-9_]+$/, ''));
          setShowSuggestions(false);
        }
      }
    }
  };
  
  // Handle direct input changes to catch paste events and manual typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Check if a command followed by space was just pasted or typed
    const commandSpaceMatch = newValue.match(/\/([a-zA-Z0-9_]+)\s/);
    if (commandSpaceMatch) {
      const commandName = commandSpaceMatch[1];
      console.log('Input change detected command with space:', commandName);
      
      const validSuggestions = filterToolsByQuery(`/${commandName}`);
      console.log('Valid suggestions on input change:', validSuggestions);
      
      if (validSuggestions.length > 0) {
        // Add the command as a chip
        console.log('Adding tool on input change:', commandName);
        addTool(commandName);
        
        // Remove the command and the space from the input
        const cleanedInput = newValue.replace(/\/[a-zA-Z0-9_]+\s/, '');
        console.log('Setting cleaned input:', cleanedInput);
        setInputValue(cleanedInput);
        return;
      }
    }
    
    // If no command was processed, update the input value normally
    setInputValue(newValue);
  };

  const handleCommandSelect = (command: string) => {
    console.log('Command selected from dropdown:', command);
    // Add the tool to active tools
    addTool(command);
    
    // Remove the command text from input
    const lastSlashIndex = inputValue.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      setInputValue(inputValue.substring(0, lastSlashIndex));
    }
    
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {showSuggestions && (
        <CommandSuggestions
          suggestions={suggestions}
          onSelect={handleCommandSelect}
        />
      )}
      
      <div className="flex flex-col w-full">
        <div className="relative rounded-md border border-neutral-200">
          {/* Command chips inside input */}
          <div className="flex flex-wrap items-center pl-2 pr-10 py-1 gap-1 min-h-[40px]">
            {activeTools.length > 0 && (
              <>
                {activeTools.map((command) => (
                  <CommandChip
                    key={command}
                    command={command}
                    onRemove={removeTool}
                  />
                ))}
              </>
            )}

            <input
              ref={inputRef}
              placeholder={activeTools.length > 0 ? "" : "Type a message or use /commands..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none shadow-none focus-visible:ring-0 focus:outline-none text-sm min-w-[50px] p-0 h-6 bg-transparent"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || (!inputValue.trim() && activeTools.length === 0)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-black hover:bg-neutral-100 rounded-sm border-0"
            variant="ghost"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>

        {activeTools.length > 0 && (
          <div className="flex justify-end mt-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => clearTools()}
              className="h-5 text-xs rounded-full px-2 text-neutral-500 hover:text-neutral-800"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
