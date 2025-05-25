import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-6 bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <Bot className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">
          DevOps Autopilot
        </h1>
      </div>
    </header>
  );
}
