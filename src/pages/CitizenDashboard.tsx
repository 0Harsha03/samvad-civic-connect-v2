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
      <div className="relative space-y-12 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-secondary/20 before:to-transparent">
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
                className="relative pl-12 group"
              >
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-background z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 shadow-xl",
                  report.status === "Resolved" ? "bg-success" : 
                  report.status === "In Progress" ? "bg-warning" : "bg-primary"
                )}>
                  {getStatusIcon(report.status)}
                </div>

                <div className="space-y-6">
                  {/* Date Header */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                      {formatDate(new Date(report.createdAt))}
                    </span>
                    <div className="h-px flex-1 bg-border/20"></div>
                  </div>

                  {/* Feed Item Body */}
                  <div className="grid md:grid-cols-[1fr_200px] gap-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors cursor-pointer leading-none">
                            {report.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                              {report.category}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground/40">#{report.id}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-2xl">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-xl text-xs font-bold text-muted-foreground/80">
                          <MapPin className="h-3.5 w-3.5" />
                          {report.location.address.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-xl text-xs font-bold text-muted-foreground/80">
                          <Shield className="h-3.5 w-3.5" />
                          Priority {report.priority}
                        </div>
                      </div>

                      {report.staffComment && (
                        <div className="bg-primary/5 rounded-[1.5rem] p-6 border-l-4 border-primary shadow-inner relative overflow-hidden group/comment">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover/comment:scale-150"></div>
                          <div className="flex items-center gap-2 mb-3 relative">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Official Response</span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed italic font-semibold relative">
                            "{report.staffComment}"
                          </p>
                          <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-widest mt-3 flex justify-end">
                            Verified Official • {formatDate(new Date(report.updatedAt))}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Media / Visual Side */}
                    <div className="space-y-4">
                      <div className="aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-2xl group/media">
                        <img 
                          src={report.photoUrl || "https://images.unsplash.com/photo-1518005020251-eba3f7a89ac2?auto=format&fit=crop&q=80"} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-110"
                        />
                      </div>
                      {/* Stylized Map Indicator */}
                      <div className="h-20 bg-muted/20 rounded-2xl border border-dashed border-border/50 flex items-center justify-center group/map cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="text-center">
                          <MapPin className="h-5 w-5 text-primary/40 mx-auto mb-1 group-hover/map:scale-110 transition-transform" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">View on Map</span>
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