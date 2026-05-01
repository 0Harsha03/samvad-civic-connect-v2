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
      className="max-w-6xl mx-auto p-4 lg:p-8 space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">My Community Reports</h1>
          <p className="text-muted-foreground text-lg">Real-time tracking of your civic contributions</p>
        </div>
        <Button
          variant="civic"
          size="lg"
          className="rounded-full px-8 shadow-civic hover-lift"
          onClick={() => onNavigate("report")}
        >
          <Plus className="h-5 w-5 mr-2" />
          Report New Issue
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: userReports.length, icon: AlertTriangle, color: "primary" },
          { label: "In Progress", value: userReports.filter(r => r.status === "In Progress").length, icon: Clock, color: "warning" },
          { label: "Resolved", value: userReports.filter(r => r.status === "Resolved").length, icon: CheckCircle, color: "success" },
          { label: "Pending", value: userReports.filter(r => r.status === "Submitted").length, icon: AlertTriangle, color: "muted" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-none hover-lift overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${stat.color === 'muted' ? 'muted' : stat.color}/10 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color === 'muted' ? 'muted-foreground' : stat.color}`} />
                </div>
                <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="glass-card border-none rounded-3xl p-2">
        <CardContent className="p-4 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search issues, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-background/30 border-none rounded-2xl text-lg focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {["all", "Submitted", "Assigned", "In Progress", "Resolved"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "civic" : "ghost"}
                size="sm"
                className={`rounded-full px-6 h-10 transition-all ${statusFilter === status ? "shadow-lg scale-105" : "hover:bg-primary/5"}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All Status" : status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Card className="glass-card border-none p-20 text-center rounded-3xl">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No matching reports</h3>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className={cn(
                  "glass-card border-none hover-lift overflow-hidden rounded-3xl",
                  report.status === "Submitted" && "border-status-submitted",
                  report.status === "Assigned" && "border-status-assigned",
                  report.status === "In Progress" && "border-status-inprogress",
                  report.status === "Resolved" && "border-status-resolved"
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left: Image if exists */}
                      <div className="relative w-full lg:w-48 xl:w-64 h-48 lg:h-auto overflow-hidden">
                        <img
                          src={report.photoUrl || "https://images.unsplash.com/photo-1518005020251-eba3f7a89ac2?auto=format&fit=crop&q=80"}
                          alt={report.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="glass backdrop-blur-md border-none px-3 py-1 font-bold text-xs uppercase tracking-wider">
                            {report.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <h3 className="text-2xl font-black tracking-tight text-foreground leading-tight">
                              {report.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full", getPriorityColor(report.priority))}>
                                Priority {report.priority}
                              </span>
                              <Badge variant="outline" className={cn("rounded-full px-4 py-1.5 flex items-center gap-2 border-none shadow-sm", getStatusColor(report.status))}>
                                {getStatusIcon(report.status)}
                                <span className="font-bold text-xs uppercase tracking-wider">{report.status}</span>
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 font-medium">
                            {report.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/30 text-sm">
                          <div className="flex items-center gap-2.5 text-muted-foreground/80 group/loc font-semibold">
                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center transition-colors group-hover/loc:bg-primary/10">
                              <MapPin className="h-4 w-4 transition-colors group-hover/loc:text-primary" />
                            </div>
                            <span className="max-w-[200px] truncate">{report.location.address}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-muted-foreground/80 font-semibold">
                            <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-secondary" />
                            </div>
                            <span>Submitted {formatDate(new Date(report.createdAt))}</span>
                          </div>
                          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            ID: {report.id}
                          </div>
                        </div>

                        {report.staffComment && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-primary/5 rounded-2xl p-5 mt-4 border-l-4 border-primary shadow-inner"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-xs font-black text-primary uppercase tracking-[0.15em]">Government Update</span>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed italic font-medium">{report.staffComment}</p>
                            <div className="mt-3 text-[10px] text-muted-foreground/70 flex justify-end font-bold uppercase tracking-wider">
                              Last updated {formatDate(new Date(report.updatedAt))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};