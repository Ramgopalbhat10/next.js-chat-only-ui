export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tools?: string[];
  widgets?: Widget[];
}

export interface Tool {
  name: string;
  command: string;
  description: string;
  icon: string;
}

export interface Widget {
  type: 'card' | 'list' | 'table' | 'action';
  title?: string;
  data: any;
}

// Static timestamp to prevent hydration issues
const STATIC_TIMESTAMP = '2023-09-10T12:00:00.000Z';

// Tools
export const TOOLS: Tool[] = [
  {
    name: 'Jira',
    command: '/jira',
    description: 'Search for Jira tickets or create a new one',
    icon: 'clipboard',
  },
  {
    name: 'GitHub',
    command: '/github',
    description: 'Access repositories, PRs, and issues',
    icon: 'github',
  },
  {
    name: 'Slack',
    command: '/slack',
    description: 'Send messages and view channels',
    icon: 'messageSquare',
  },
  {
    name: 'Workday',
    command: '/workday',
    description: 'View time off and HR information',
    icon: 'calendar',
  },
  {
    name: 'PTO',
    command: '/pto',
    description: 'Request time off and view PTO balance',
    icon: 'calendar',
  },
];

// Mock data for different services
export const MOCK_JIRA_TICKETS = [
  {
    key: 'PROJ-123',
    summary: 'Fix login page redirect issue',
    priority: 'High',
    assignee: 'You',
    status: 'In Progress',
  },
  {
    key: 'PROJ-145',
    summary: 'Update documentation for new API',
    priority: 'Medium',
    assignee: 'You',
    status: 'To Do',
  },
  {
    key: 'PROJ-167',
    summary: 'Investigate performance issue in dashboard',
    priority: 'High',
    assignee: 'Jane Smith',
    status: 'In Progress',
  },
];

export const MOCK_GITHUB_REPOS = [
  {
    name: 'frontend-app',
    description: 'Main frontend application',
    stars: 25,
    forks: 5,
    lastUpdated: '2 days ago',
  },
  {
    name: 'backend-api',
    description: 'Backend API service',
    stars: 32,
    forks: 8,
    lastUpdated: '1 week ago',
  },
  {
    name: 'shared-components',
    description: 'Shared UI component library',
    stars: 45,
    forks: 12,
    lastUpdated: '3 days ago',
  },
];

export const MOCK_SLACK_CHANNELS = [
  {
    name: 'general',
    description: 'Company-wide announcements',
    members: 125,
    lastActive: '10 minutes ago',
  },
  {
    name: 'engineering',
    description: 'Engineering team discussions',
    members: 45,
    lastActive: '2 hours ago',
  },
  {
    name: 'product',
    description: 'Product team discussions',
    members: 28,
    lastActive: '1 day ago',
  },
];

export const MOCK_WORKDAY_TIMEOFF = [
  {
    type: 'Vacation',
    startDate: 'Oct 15, 2023',
    endDate: 'Oct 20, 2023',
    status: 'Approved',
    days: 5,
  },
  {
    type: 'Sick Leave',
    startDate: 'Sep 5, 2023',
    endDate: 'Sep 5, 2023',
    status: 'Taken',
    days: 1,
  },
  {
    type: 'Personal',
    startDate: 'Nov 24, 2023',
    endDate: 'Nov 24, 2023',
    status: 'Pending',
    days: 1,
  },
];

// Sample initial messages
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I am your enterprise assistant. How can I help you today?',
    timestamp: STATIC_TIMESTAMP,
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I need to find my open Jira tickets',
    timestamp: STATIC_TIMESTAMP,
    tools: ['/jira'],
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Here are your open Jira tickets:',
    timestamp: STATIC_TIMESTAMP,
    widgets: [
      {
        type: 'table',
        title: 'Open Jira Tickets',
        data: [
          {
            key: 'PROJ-123',
            summary: 'Fix login page redirect issue',
            priority: 'High',
            assignee: 'You',
            status: 'In Progress',
          },
          {
            key: 'PROJ-145',
            summary: 'Update documentation for new API',
            priority: 'Medium',
            assignee: 'You',
            status: 'To Do',
          },
          {
            key: 'PROJ-167',
            summary: 'Investigate performance issue in dashboard',
            priority: 'High',
            assignee: 'Jane Smith',
            status: 'In Progress',
          },
        ],
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
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'How many vacation days do I have left?',
    timestamp: STATIC_TIMESTAMP,
    tools: ['/pto'],
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: 'Here is your PTO information:',
    timestamp: STATIC_TIMESTAMP,
    widgets: [
      {
        type: 'card',
        data: {
          name: 'PTO Summary',
          description: 'Your current PTO balance',
          vacationDays: '15 days',
          sickDays: '8 days',
          usedThisYear: '5 days',
          nextAccrual: 'October 1, 2023',
        },
      },
      {
        type: 'list',
        title: 'Upcoming Time Off',
        data: [
          {
            name: 'Summer Vacation',
            startDate: 'Aug 15, 2023',
            endDate: 'Aug 22, 2023',
            status: 'Approved',
            days: '5 days',
          },
        ],
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
  },
];
