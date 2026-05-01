import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  MapPin,
  Plus,
  Shield
} from "lucide-react";
import { Report } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CitizenDashboardProps {
  reports: Report[];
  userId: string;
  onNavigate: (page: string) => void;
}

export const CitizenDashboard = ({ reports, userId, onNavigate }: CitizenDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);

  const userReports = reports.filter(report => report.userId === userId);

  useEffect(() => {
    let filtered = userReports;
    if (searchTerm.trim()) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, userReports]);

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Assigned": return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return "bg-success/20 text-success border-success/30";
      case "In Progress": return "bg-warning/20 text-warning border-warning/30";
      case "Assigned": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return "text-destructive bg-destructive/10 px-2 py-0.5 rounded-full";
    if (priority >= 3) return "text-warning bg-warning/10 px-2 py-0.5 rounded-full";
    return "text-success bg-success/10 px-2 py-0.5 rounded-full";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4 lg:p-12 space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Activity Feed
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full text-xs text-primary">
              <AlertTriangle className="h-3 w-3" />
              {userReports.length} Total
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-success/5 rounded-full text-xs text-success">
              <CheckCircle className="h-3 w-3" />
              {userReports.filter(r => r.status === "Resolved").length} Resolved
            </span>
          </div>
        </div>
        <Button
          variant="civic"
          size="lg"
          className="rounded-2xl px-10 h-14 shadow-civic hover-lift font-bold"
          onClick={() => onNavigate("report")}
        >
          <Plus className="h-5 w-5 mr-2 stroke-[3]" />
          Submit Report
        </Button>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white/30 dark:bg-black/30 backdrop-blur-xl p-2 rounded-[2rem] border border-white/20">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search your activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 bg-transparent border-none rounded-2xl text-lg focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted/30 rounded-2xl w-full md:w-auto">
          {["all", "In Progress", "Resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                statusFilter === status 
                  ? "bg-white dark:bg-zinc-800 shadow-xl scale-[1.02] text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline Feed */}
      <div className="relative space-y-16 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[4px] before:bg-gradient-to-b before:from-primary before:via-secondary/40 before:to-transparent before:rounded-full">
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-xl font-bold text-muted-foreground/50">No activity found</p>
            </motion.div>
          ) : (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative pl-16 group"
              >
                {/* Timeline Dot - Enhanced Visual Strength */}
                <div className={cn(
                  "absolute left-[-1px] top-0 w-10 h-10 rounded-full border-4 border-background z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]",
                  report.status === "Resolved" ? "bg-success text-white" : 
                  report.status === "In Progress" ? "bg-warning text-white" : 
                  report.status === "Assigned" ? "bg-primary text-white" : "bg-zinc-400 text-white"
                )}>
                  <div className="scale-110">
                    {getStatusIcon(report.status)}
                  </div>
                </div>

                <div className="space-y-6 transition-all duration-500 group-hover:translate-x-2">
                  {/* Date Header - High Contrast */}
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/80 bg-muted/50 px-3 py-1 rounded-md">
                      {formatDate(new Date(report.createdAt))}
                    </span>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-border/40 to-transparent"></div>
                    <Badge className={cn(
                      "rounded-full px-4 py-1 border-none shadow-sm font-black text-[10px] uppercase tracking-widest",
                      getStatusColor(report.status)
                    )}>
                      {report.status}
                    </Badge>
                  </div>

                  {/* Feed Item Body - Added Card Depth */}
                  <div className="grid md:grid-cols-[1fr_240px] gap-10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/20 shadow-sm group-hover:shadow-2xl group-hover:bg-white/60 dark:group-hover:bg-zinc-900/60 transition-all duration-500">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-3xl font-black tracking-tight text-foreground leading-[1.1] group-hover:text-primary transition-colors">
                            {report.title}
                          </h3>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                            report.priority >= 4 ? "bg-destructive text-white" : "bg-primary/10 text-primary"
                          )}>
                            {report.priority >= 4 ? "CRITICAL" : `P${report.priority}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            {report.category}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">REF: {report.id}</span>
                        </div>
                      </div>

                      <p className="text-lg text-foreground/70 font-medium leading-relaxed max-w-2xl">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-background/50 rounded-2xl text-[11px] font-bold text-foreground/80 shadow-inner border border-white/10 group/loc">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover/loc:scale-110">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          {report.location.address.split(',')[0]}
                        </div>
                      </div>

                      {report.staffComment && (
                        <div className="bg-primary/5 rounded-[2rem] p-8 border-l-[6px] border-primary shadow-inner relative overflow-hidden group/comment mt-8">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform duration-700 group-hover/comment:scale-125"></div>
                          <div className="flex items-center gap-3 mb-4 relative">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-lg">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] block">Government Directive</span>
                              <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Case Verified Official</span>
                            </div>
                          </div>
                          <p className="text-base text-foreground/90 leading-relaxed italic font-bold relative pl-4 border-l-2 border-primary/20">
                            "{report.staffComment}"
                          </p>
                          <div className="mt-4 flex justify-end relative">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                              Updated • {formatDate(new Date(report.updatedAt))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Media / Visual Side - Enhanced Visual Strength */}
                    <div className="space-y-6">
                      <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-white/30 shadow-2xl group/media relative">
                        <img 
                          src={report.photoUrl || "https://images.unsplash.com/photo-1518005020251-eba3f7a89ac2?auto=format&fit=crop&q=80"} 
                          className="w-full h-full object-cover transition-all duration-700 group-hover/media:scale-110 group-hover/media:rotate-1"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                      </div>
                      
                      {/* Stylized Location Info Card */}
                      <div className="bg-zinc-800/5 dark:bg-white/5 rounded-[1.5rem] p-5 border border-white/10 group/map cursor-pointer hover:bg-primary/5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center group-hover/map:rotate-12 transition-transform">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                            <p className="text-xs font-bold text-foreground truncate max-w-[120px]">View Details</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};