import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLogin from "@/components/admin/admin-login";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
