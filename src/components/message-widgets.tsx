"use client";

import React, { useEffect, useState } from 'react';
import { Widget, CardData, ListData, TableData, ActionData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  ExternalLink,
  GitBranch, 
  MessageSquare, 
  Ticket, 
  Calendar, 
  Edit, 
  Share, 
  FileSearch
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MessageWidgetsProps {
  widgets: Widget[];
}

interface Action {
  label: string;
  value: string;
}

interface CardItem {
  name?: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

interface ListItem extends CardItem {
  type?: string;
  status?: string;
}

export function MessageWidgets({ widgets }: MessageWidgetsProps) {
  useEffect(() => {
    console.log('MessageWidgets received widgets:', widgets);
  }, [widgets]);

  if (!widgets || widgets.length === 0) {
    console.log('No widgets to render');
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {widgets.map((widget, index: number) => {
        console.log(`Rendering widget type: ${widget.type}`, widget);
        return (
          <div key={index} className="w-full">
            {widget.type === 'card' && <CardWidget widget={widget} />}
            {widget.type === 'list' && <ListWidget widget={widget} />}
            {widget.type === 'table' && <TableWidget widget={widget} />}
            {widget.type === 'action' && <ActionWidget widget={widget} />}
          </div>
        );
      })}
    </div>
  );
}

function CardWidget({ widget }: { widget: Widget }) {
  const data = widget.data as CardData;
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
      {widget.title && (
        <h3 className="text-sm font-medium mb-3">{widget.title}</h3>
      )}
      <div className="space-y-2">
        <ExpandableCard key={0} item={data} />
      </div>
    </div>
  );
}

function ExpandableCard({ item }: { item: CardItem }) {
  const [expanded, setExpanded] = useState(false);

  // First few fields to always show
  const importantFields = Object.entries(item)
    .filter(([key]) => !['name', 'title', 'description'].includes(key))
    .slice(0, 3);
  
  // Additional fields to show when expanded
  const additionalFields = Object.entries(item)
    .filter(([key]) => !['name', 'title', 'description'].includes(key))
    .slice(3);

  // Check if there are additional fields to show
  const hasAdditionalFields = additionalFields.length > 0;

  return (
    <div className="border border-neutral-200 rounded-md bg-white shadow-sm mb-2 w-full overflow-hidden">
      {/* Card header with title */}
      <div className="p-3 border-b border-neutral-200">
        <div className="font-medium text-sm">{item.name || item.title}</div>
        {item.description && (
          <div className="text-xs text-neutral-500 mt-1">{item.description}</div>
        )}
      </div>
      
      {/* Always visible fields */}
      <div className="p-3 pt-2">
        {importantFields.map(([key, value]) => (
          <div key={key} className="flex justify-between py-1 text-xs">
            <span className="text-neutral-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
      
      {/* Expandable section */}
      {hasAdditionalFields && (
        <>
          {expanded && (
            <div className="px-3 pb-3 pt-0 border-t border-neutral-100">
              {additionalFields.map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 text-xs">
                  <span className="text-neutral-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Expand/Collapse button */}
          <Button
            variant="ghost"
            className="w-full h-8 text-xs flex items-center justify-center gap-1 text-neutral-500 hover:bg-neutral-50 rounded-none border-t border-neutral-200"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Show less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>Show more <ChevronDown className="h-3 w-3" /></>
            )}
          </Button>
        </>
      )}
    </div>
  );
}

function ListWidget({ widget }: { widget: Widget }) {
  const data = widget.data as ListData;
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
      {widget.title && (
        <h3 className="text-sm font-medium mb-3">{widget.title}</h3>
      )}
      <div className="space-y-2">
        {data.map((item, index: number) => (
          <ExpandableListItem key={index} item={item as ListItem} />
        ))}
      </div>
    </div>
  );
}

function ExpandableListItem({ item }: { item: ListItem }) {
  const [expanded, setExpanded] = useState(false);

  // Helper function to get badge color based on status or type
  const getBadgeColor = (value: string) => {
    const lowercase = value.toLowerCase();
    
    if (lowercase.includes('approved')) return 'bg-green-100 text-green-800';
    if (lowercase.includes('pending')) return 'bg-yellow-100 text-yellow-800';
    if (lowercase.includes('in progress')) return 'bg-blue-100 text-blue-800';
    if (lowercase.includes('to do')) return 'bg-purple-100 text-purple-800';
    if (lowercase.includes('updated')) return 'bg-gray-100 text-gray-800';
    if (lowercase.includes('active')) return 'bg-green-100 text-green-800';
    if (lowercase.includes('vacation')) return 'bg-blue-100 text-blue-800';
    if (lowercase.includes('sick')) return 'bg-purple-100 text-purple-800';
    if (lowercase.includes('personal')) return 'bg-orange-100 text-orange-800';
    if (lowercase.includes('taken')) return 'bg-gray-100 text-gray-800';
    
    return 'bg-neutral-100 text-neutral-800';
  };

  // Get the item type to customize the icon and actions
  const itemType = item.type?.toLowerCase() || '';

  // Icon based on item type
  const getItemIcon = () => {
    if (itemType.includes('jira')) return <Ticket className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    if (itemType.includes('github')) return <GitBranch className="h-4 w-4 text-purple-500 flex-shrink-0" />;
    if (itemType.includes('slack')) return <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0" />;
    if (itemType.includes('vacation') || itemType.includes('pto')) return <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />;
    return null;
  };

  // Get keys to display in summary (just a few important ones)
  const visibleKeys = Object.keys(item).filter(key => 
    key !== 'name' && 
    key !== 'description' &&
    key !== 'type' && 
    key !== 'status'
  );

  // Generate actions based on item type
  const getItemActions = () => {
    const commonActions = [
      { label: 'View Details', icon: <FileSearch className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('View details for:', item) },
    ];
    
    if (itemType.includes('jira')) {
      return [
        ...commonActions,
        { label: 'Edit Ticket', icon: <Edit className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Edit ticket:', item) },
        { label: 'Share Ticket', icon: <Share className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Share ticket:', item) },
      ];
    }
    
    if (itemType.includes('github')) {
      return [
        ...commonActions,
        { label: 'View Repository', icon: <GitBranch className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('View repo:', item) },
        { label: 'Fork Repository', icon: <Share className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Fork repo:', item) },
      ];
    }
    
    if (itemType.includes('slack')) {
      return [
        ...commonActions,
        { label: 'Join Channel', icon: <MessageSquare className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Join channel:', item) },
        { label: 'View Messages', icon: <FileSearch className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('View messages:', item) },
      ];
    }
    
    return [
      ...commonActions,
      { label: 'Edit', icon: <Edit className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Edit:', item) },
      { label: 'Share', icon: <Share className="h-3.5 w-3.5 mr-1.5" />, action: () => console.log('Share:', item) },
    ];
  };

  const itemActions = getItemActions();

  return (
    <li className="relative">
      {/* Collapsed view - just shows basic info */}
      <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2 flex-grow min-w-0 mr-2">
          {getItemIcon() || <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status ? getBadgeColor(item.status).replace('bg-', 'bg-').replace('text-', '') : 'bg-neutral-300'}`}></div>}
          <div className="font-medium text-sm truncate min-w-0">{item.name || item.type || 'Item'}</div>
          {item.status && (
            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${getBadgeColor(item.status)}`}>
              {item.status}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          )}
          
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6 p-0.5 hover:bg-neutral-100 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                side="bottom"
                sideOffset={5}
                className="w-44 p-1 shadow-md border border-neutral-200 rounded-md bg-white z-50"
              >
                {itemActions.map((action, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.action();
                    }}
                    className="text-sm py-1.5 px-2 cursor-pointer rounded hover:bg-neutral-100 focus:bg-neutral-100 focus:text-neutral-900 outline-none"
                  >
                    <span className="flex items-center text-neutral-700">
                      {action.icon}
                      {action.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Expanded view - shows all details */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 bg-neutral-50">
          <div className="border-t border-neutral-200 pt-2">
            {visibleKeys.map((key) => (
              <div key={key} className="flex justify-between py-1 text-xs">
                <span className="text-neutral-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">{String(item[key])}</span>
              </div>
            ))}
            
            <div className="mt-2 pt-2 border-t border-neutral-200 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('View full details for:', item);
                }}
              >
                View full details
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

function TableWidget({ widget }: { widget: Widget }) {
  const data = widget.data as TableData;
  const headers = data.headers || Object.keys(data.rows[0] || {});
  
  if (data.rows.length === 0) return null;
  
  // Detect service type from title for specialized rendering
  const isJira = widget.title?.toLowerCase().includes('jira');
  const isGitHub = widget.title?.toLowerCase().includes('github');
  const isSlack = widget.title?.toLowerCase().includes('slack');

  // If this is Jira, GitHub, or Slack data, render as list items instead of table
  if (isJira || isGitHub || isSlack) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
        {widget.title && (
          <h3 className="text-sm font-medium mb-3">{widget.title}</h3>
        )}
        <div className="space-y-2">
          {data.rows.map((item, index: number) => {
            // Create a customized item based on the service type
            let enhancedItem: ListItem = { ...item } as ListItem;
            
            if (isJira) {
              enhancedItem = {
                ...item,
                name: (item.summary as string) || (item.key as string),
                status: item.status as string,
                type: 'Jira Ticket',
              };
            } else if (isGitHub) {
              enhancedItem = {
                ...item,
                name: item.name as string,
                status: item.lastUpdated ? `Updated ${item.lastUpdated as string}` : undefined,
                type: 'GitHub Repository',
              };
            } else if (isSlack) {
              enhancedItem = {
                ...item,
                name: item.name as string,
                status: item.lastActive ? `Active ${item.lastActive as string}` : undefined,
                type: 'Slack Channel',
              };
            }
            
            return <ExpandableListItem key={index} item={enhancedItem} />;
          })}
        </div>
      </div>
    );
  }
  
  // Default table rendering for other types of data
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
      {widget.title && (
        <h3 className="text-sm font-medium mb-3">{widget.title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 text-left font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex: number) => (
              <tr key={rowIndex} className="border-b border-neutral-100 last:border-b-0">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-3 py-2">
                    {String(row[header] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionWidget({ widget }: { widget: Widget }) {
  const data = widget.data as ActionData;
  const { actions } = data;
  
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {actions.map((action: Action, index: number) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="h-8 px-3 py-1 text-xs border-neutral-200 hover:bg-neutral-50"
          onClick={() => console.log('Action clicked:', action.value)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
