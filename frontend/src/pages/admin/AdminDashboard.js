import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Mail, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { withCredentials: true }),
          axios.get(`${API}/leads`, { withCredentials: true })
        ]);
        setStats(statsRes.data);
        setRecentLeads(leadsRes.data.leads.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchData();
  }, []);

  const statCards = stats ? [
    { label: 'Total Leads', value: stats.total_leads, icon: Users, accent: true },
    { label: 'New Leads', value: stats.new_leads, icon: TrendingUp },
    { label: 'Blog Posts', value: stats.total_posts, icon: FileText },
    { label: 'Published', value: stats.published_posts, icon: FileText },
    { label: 'Subscribers', value: stats.total_subscribers, icon: Mail },
  ] : [];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="text-2xl sm:text-3xl tracking-tight font-bold font-cabinet mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`border border-border p-5 ${card.accent ? 'bg-primary/5' : ''}`}
            data-testid={`stat-card-${i}`}
          >
            <card.icon className="w-4 h-4 text-muted-foreground mb-3" />
            <p className="text-3xl font-black font-cabinet text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground font-satoshi mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold font-cabinet mb-4">Recent Leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground font-satoshi">No leads yet.</p>
        ) : (
          <div className="border border-border">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-satoshi text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
            </div>
            {recentLeads.map((lead, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border text-sm font-satoshi" data-testid={`recent-lead-${i}`}>
                <div className="col-span-3 truncate">{lead.name}</div>
                <div className="col-span-3 truncate text-muted-foreground">{lead.email}</div>
                <div className="col-span-2">
                  <span className="text-xs px-2 py-0.5 border border-border">{lead.lead_type}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-0.5 ${lead.status === 'new' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="col-span-2 text-muted-foreground text-xs">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
