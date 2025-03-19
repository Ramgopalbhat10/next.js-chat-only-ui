'use client';

import { Message, MOCK_GITHUB_REPOS, MOCK_JIRA_TICKETS, MOCK_SLACK_CHANNELS, MOCK_WORKDAY_TIMEOFF, Tool, Widget } from './mock-data';

// Simulate a backend response with a delay
const simulateBackendResponse = async (
  content: string,
  activeTools: string[]
): Promise<{ content: string; widgets?: Widget[] }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Processing request with tools:', activeTools, 'and content:', content);
  
  const lowerContent = content.toLowerCase();
  let response: { content: string; widgets?: Widget[] };
  
  // Handle Jira tool
  if (activeTools.includes('/jira')) {
    console.log('Jira tool activated');
    if (lowerContent.includes('ticket') || lowerContent.includes('issue')) {
      console.log('Returning Jira tickets');
      response = {
        content: 'Here are your Jira tickets:',
        widgets: [
          {
            type: 'table',
            title: 'Open Jira Tickets',
            data: MOCK_JIRA_TICKETS
          },
          {
            type: 'action',
            data: {
              actions: [
                { label: 'Create New Ticket', value: 'create_jira' },
                { label: 'Show All Tickets', value: 'all_jira' },
              ],
            },
          },
        ],
      };
      console.log('Jira response with widgets:', response.widgets);
      return response;
    }
  }
  
  // Handle GitHub tool
  if (activeTools.includes('/github')) {
    console.log('GitHub tool activated');
    if (lowerContent.includes('repo') || lowerContent.includes('repository')) {
      console.log('Returning GitHub repos');
      response = {
        content: 'Here are your GitHub repositories:',
        widgets: [
          {
            type: 'table',
            title: 'GitHub Repositories',
            data: MOCK_GITHUB_REPOS
          },
          {
            type: 'action',
            data: {
              actions: [
                { label: 'Create New Repo', value: 'create_repo' },
                { label: 'View All Repos', value: 'all_repos' },
              ],
            },
          },
        ],
      };
      console.log('GitHub response with widgets:', response.widgets);
      return response;
    }
  }
  
  // Handle Slack tool
  if (activeTools.includes('/slack')) {
    console.log('Slack tool activated');
    if (lowerContent.includes('channel') || lowerContent.includes('message')) {
      console.log('Returning Slack channels');
      response = {
        content: 'Here are your Slack channels:',
        widgets: [
          {
            type: 'table',
            title: 'Slack Channels',
            data: MOCK_SLACK_CHANNELS
          },
          {
            type: 'action',
            data: {
              actions: [
                { label: 'Send Message', value: 'send_message' },
                { label: 'Create Channel', value: 'create_channel' },
              ],
            },
          },
        ],
      };
      console.log('Slack response with widgets:', response.widgets);
      return response;
    }
  }
  
  // Handle PTO/Workday tool
  if (activeTools.includes('/pto') || activeTools.includes('/workday')) {
    console.log('PTO/Workday tool activated');
    if (lowerContent.includes('time off') || lowerContent.includes('vacation') || lowerContent.includes('pto')) {
      console.log('Returning PTO info');
      response = {
        content: 'Here is your PTO information:',
        widgets: [
          {
            type: 'card',
            title: 'PTO Summary',
            data: {
              name: 'PTO Summary',
              description: 'Your current PTO balance',
              vacationDays: '15 days',
              sickDays: '8 days',
              usedThisYear: '5 days',
              nextAccrual: 'October 1, 2023',
              carryOverDays: '3 days',
              fiscalYearEnd: 'December 31, 2023',
              approvers: 'Manager, HR',
              policyLink: 'internal.company.com/pto-policy',
              lastTimeOffRequest: 'September 5, 2023',
              timeOffRequestedThisYear: '12 days',
              holidaysRemaining: '4 days',
              holidaysUpcoming: 'Thanksgiving, Christmas',
            },
          },
          {
            type: 'list',
            title: 'Upcoming Time Off',
            data: MOCK_WORKDAY_TIMEOFF
          },
          {
            type: 'action',
            data: {
              actions: [
                { label: 'Request Time Off', value: 'request_pto' },
                { label: 'View Calendar', value: 'view_calendar' },
              ],
            },
          },
        ],
      };
      console.log('PTO response with widgets:', response.widgets);
      return response;
    }
  }
  
  // Default response for tools
  if (activeTools.length > 0) {
    // Default widget for any tool to ensure widgets display
    const toolNames = activeTools.map(tool => {
      if (tool === '/jira') return 'Jira';
      if (tool === '/github') return 'GitHub';
      if (tool === '/slack') return 'Slack';
      if (tool === '/pto') return 'PTO';
      if (tool === '/workday') return 'Workday';
      return tool;
    });
    
    console.log('Generating default tool response');
    response = {
      content: `I'm using the following tools: ${toolNames.join(', ')}. How can I help you with them?`,
      widgets: [
        {
          type: 'card',
          data: {
            name: 'Available Tools',
            description: 'You can ask me about the following:',
            tools: toolNames.join(', '),
            exampleQueries: 'Show my Jira tickets, PTO balance, GitHub repos',
            moreInformation: 'Each tool provides specific functionality to help with your work',
            accessLevel: 'Standard User',
            lastUpdated: 'Today',
          }
        }
      ]
    };
    console.log('Default tool response with widgets:', response.widgets);
    return response;
  }
  
  // Truly generic response with no tools
  response = {
    content: 'How can I help you today? Use / to access available tools.',
  };
  console.log('Generic response:', response);
  return response;
};

export async function sendMessage(
  content: string,
  activeTools: string[]
): Promise<Omit<Message, 'id' | 'timestamp'>> {
  try {
    console.log('Sending message with tools:', activeTools);
    const response = await simulateBackendResponse(content, activeTools);
    console.log('Response received:', response);
    
    // Ensure we're returning the correct structure
    const result: Omit<Message, 'id' | 'timestamp'> = {
      role: 'assistant',
      content: response.content,
      tools: activeTools, // Make sure tools are preserved
    };
    
    // Only add widgets if they exist
    if (response.widgets && response.widgets.length > 0) {
      result.widgets = response.widgets;
      console.log('Added widgets to result:', result.widgets);
    }
    
    return result;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}
