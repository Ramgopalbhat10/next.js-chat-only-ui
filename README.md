# Enterprise Agentic Chatbot

A Next.js TypeScript application featuring a beautiful and intuitive enterprise chatbot interface that connects to a backend LangGraph.js project. This chatbot uses an agentic approach to connect with various enterprise systems like Jira, Workday, Slack, GitHub, and Confluence.

## Features

- 🤖 Agentic chatbot with tool integration for enterprise systems
- 🌟 Beautiful UI with cards, widgets, and interactive components
- 🧩 Command-based interactions with chip selection (e.g., `/jira`, `/workday`)
- 💬 Modern chat interface with an expandable/collapsible window
- 🎨 Styled using shadcn UI components for a consistent design

## Tools & Commands

The chatbot supports the following enterprise tools:

- `/jira` - Access and manage Jira tickets
- `/workday` - Access Workday information and functions
- `/slack` - Send messages and retrieve Slack information
- `/github` - Manage GitHub repositories and issues
- `/confluence` - Search and retrieve Confluence documents

Commands can be typed in the input box, and suggestions will appear as you type. Selected commands will appear as chips in the input field.

## Implementation

- Built with Next.js and TypeScript
- Uses shadcn UI for components and styling
- Mock data for backend integration until connected to a real LangGraph.js backend
- State management with Zustand
- Chat UI with support for rich content display (cards, tables, lists)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/components/` - React components for the chatbot interface
- `src/lib/` - Utility functions, mock data, and store
- `src/app/` - Next.js app router pages

## Future Enhancements

- Connect to a real LangGraph.js backend
- Add authentication and user profiles
- Implement more interactive UI components
- Add settings for customizing the chatbot behavior
- Connect to real enterprise APIs rather than using mock data
