"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type DeploymentStatus = "idle" | "pending" | "success" | "failure";

export function DeploymentAgentCard() {
  const [status, setStatus] = useState<DeploymentStatus>("idle");
  const [deploymentLogUrl, setDeploymentLogUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeploy = async () => {
    setStatus("pending");
    setDeploymentLogUrl(null);
    toast({ title: "Deployment Started", description: "Automated deployment process initiated." });

    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate random success/failure
    const isSuccess = Math.random() > 0.3; 
    if (isSuccess) {
      setStatus("success");
      setDeploymentLogUrl("https://console.cloud.google.com/run/deployments/mock-deployment-log");
      toast({ title: "Deployment Successful!", description: "Application deployed to Cloud Run.", className: "bg-accent text-accent-foreground" });
    } else {
      setStatus("failure");
      setDeploymentLogUrl("https://console.cloud.google.com/build/logs/mock-failure-log");
      toast({
        title: "Deployment Failed",
        description: "Something went wrong during deployment. Check logs.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Rocket className="h-6 w-6 text-primary" />
          Deployment Agent
        </CardTitle>
        <CardDescription>Automates deployment of approved builds to Cloud Run or Firebase Hosting (simulated).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status !== "idle" && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Deployment Status:</h3>
            <div className="flex items-center gap-2">
              {status === "pending" && <Badge variant="secondary">Pending...</Badge>}
              {status === "success" && <Badge className="bg-accent text-accent-foreground hover:bg-accent/90"><CheckCircle className="h-4 w-4 mr-1" />Successful</Badge>}
              {status === "failure" && <Badge variant="destructive"><XCircle className="h-4 w-4 mr-1" />Failed</Badge>}
            </div>
            {deploymentLogUrl && (
              <div>
                <a 
                  href={deploymentLogUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  View Deployment Log <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
         <p className="text-sm text-muted-foreground">
            This agent simulates the deployment process. In a real scenario, it would use Cloud Build and deploy to Cloud Run or Firebase Hosting.
          </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDeploy} disabled={status === "pending"} className="w-full">
          {status === "pending" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            "Deploy to Production (Simulated)"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
