import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Login } from "@/pages/Login";
import { ReportIssue } from "@/pages/ReportIssue";
import { CitizenDashboard } from "@/pages/CitizenDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { mockReports } from "@/services/mockData";
import { Report } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  role: "citizen" | "staff";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Index = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("samvad_user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return { ...parsed, createdAt: new Date(parsed.createdAt) };
    } catch (e) {
      return null;
    }
  });

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reports`);
        const data = await response.json();
        const formattedData = data.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt)
        }));
        // If server is empty, use mock reports
        setReports(formattedData.length > 0 ? formattedData : mockReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReports(mockReports);
      }
    };
    fetchReports();
  }, []);

  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (user) {
      return user.role === "citizen" ? "dashboard" : "admin";
    }
    return "home";
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem("samvad_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("samvad_user");
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.role === "citizen") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("admin");
    }
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userData.name}`,
    });
  };

  const handleNavigate = (page: string) => {
    if (page === "home") {
      setUser(null);
      setCurrentPage("home");
    } else if ((page === "report" || page === "dashboard") && !user) {
      setCurrentPage("login");
    } else if (page === "admin" && user?.role !== "staff") {
      setCurrentPage("login");
    } else {
      setCurrentPage(page);
    }
  };

  const handleReportSubmitted = async (newReport: Report) => {
    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
      const savedReport = await response.json();
      setReports(prev => [{ ...savedReport, createdAt: new Date(savedReport.createdAt), updatedAt: new Date(savedReport.updatedAt) }, ...prev]);
      setCurrentPage("dashboard");
      toast({
        title: "Report Submitted Successfully!",
        description: `Your report #${newReport.id} has been saved to our secure database.`,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      // Fallback to local state if backend is down
      setReports(prev => [newReport, ...prev]);
      setCurrentPage("dashboard");
    }
  };

  const handleUpdateReport = async (reportId: string, updates: Partial<Report>) => {
    try {
      await fetch(`${API_URL}/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setReports(prev => prev.map(report =>
        report.id === reportId
          ? { ...report, ...updates, updatedAt: new Date() }
          : report
      ));
      toast({
        title: "Report Updated",
        description: `Report #${reportId} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login key="login" onLogin={handleLogin} />;

      case "report":
        return user ? (
          <ReportIssue
            key="report"
            userId={user.id}
            onReportSubmitted={handleReportSubmitted}
          />
        ) : null;

      case "dashboard":
        return user && user.role === "citizen" ? (
          <CitizenDashboard
            key="dashboard"
            reports={reports}
            userId={user.id}
            onNavigate={handleNavigate}
          />
        ) : null;

      case "admin":
        return user && user.role === "staff" ? (
          <AdminDashboard
            key="admin"
            reports={reports}
            onUpdateReport={handleUpdateReport}
          />
        ) : null;

      default:
        return <Hero key="hero" onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Header
        userRole={user?.role || null}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="pb-12 pt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
