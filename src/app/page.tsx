import Image from "next/image";
import { ChatProvider } from "@/components/providers";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Enterprise Portal</h1>
      <div className="max-w-2xl w-full text-center">
        <p className="text-xl mb-6">
          Welcome to the Enterprise Portal. This is a demo of an agentic chatbot 
          that can help you interact with various enterprise systems.
        </p>
        <p className="text-muted-foreground mb-2">Try using commands like:</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="px-3 py-1 bg-secondary rounded-full text-sm">/jira</span>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm">/workday</span>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm">/slack</span>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm">/github</span>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm">/confluence</span>
        </div>
        <p className="text-muted-foreground">
          Click the chat icon in the bottom right to get started!
        </p>
      </div>
      
      {/* Chatbot Component using the provider to avoid hydration issues */}
      <ChatProvider />
    </main>
  );
}
