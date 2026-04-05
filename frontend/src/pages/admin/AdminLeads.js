import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchLeads = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await axios.get(`${API}/leads`, { withCredentials: true, params });
      setLeads(res.data.leads);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  useEffect(() => { fetchLeads(); }, [filter]);

  const updateStatus = async (leadId, newStatus) => {
    try {
      await axios.put(`${API}/leads/${leadId}/status`, { status: newStatus }, { withCredentials: true });
      fetchLeads();
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  return (
    <div data-testid="admin-leads-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-bold font-cabinet">Leads</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 rounded-none font-satoshi" data-testid="leads-filter-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-satoshi text-muted-foreground uppercase tracking-wider">
          <div className="col-span-2">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Need Help With</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Date</div>
        </div>
        {leads.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground font-satoshi" data-testid="no-leads-msg">
            No leads found.
          </div>
        ) : (
          leads.map((lead, i) => (
            <div key={lead.lead_id} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center" data-testid={`lead-row-${i}`}>
              <div className="col-span-2">
                <p className="text-sm font-satoshi font-medium truncate">{lead.name}</p>
                <p className="text-xs text-muted-foreground font-satoshi truncate">{lead.designation}</p>
              </div>
              <div className="col-span-3 text-sm text-muted-foreground font-satoshi truncate">{lead.email}</div>
              <div className="col-span-2 text-xs text-muted-foreground font-satoshi truncate">{lead.need_help_with}</div>
              <div className="col-span-1">
                <span className="text-xs px-2 py-0.5 border border-border font-satoshi">{lead.lead_type}</span>
              </div>
              <div className="col-span-2">
                <Select
                  value={lead.status}
                  onValueChange={(val) => updateStatus(lead.lead_id, val)}
                >
                  <SelectTrigger className="h-7 text-xs rounded-none font-satoshi" data-testid={`lead-status-select-${i}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground font-satoshi">
                {new Date(lead.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
