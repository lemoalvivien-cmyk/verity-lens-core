import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-6">
      <Activity className="w-5 h-5 text-primary-foreground" />
    </div>
    <h1 className="font-mono text-4xl font-bold text-foreground mb-2">404</h1>
    <p className="font-mono text-sm text-muted-foreground mb-6">Page not found</p>
    <Link to="/">
      <Button variant="outline" size="sm" className="font-mono text-xs bg-card border-border">
        Back to Dashboard
      </Button>
    </Link>
  </div>
);

export default NotFound;
