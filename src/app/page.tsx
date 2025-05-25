import { Header } from "@/components/layout/Header";
import { CodeReviewAgentCard } from "@/components/agents/CodeReviewAgentCard";
import { TestingAgentCard } from "@/components/agents/TestingAgentCard";
import { DeploymentAgentCard } from "@/components/agents/DeploymentAgentCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            CI/CD Pipeline Assistant
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and automate your CI/CD pipeline stages with AI-powered assistance. Each agent below helps with a specific part of the development lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-3xl mx-auto">
          <CodeReviewAgentCard />
          <TestingAgentCard />
          <DeploymentAgentCard />
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} DevOps Autopilot. Powered by Firebase Studio & Google Cloud.
      </footer>
    </div>
  );
}
