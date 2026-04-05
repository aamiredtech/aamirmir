import { useState, useEffect } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/newsletter`, { withCredentials: true });
        setSubscribers(res.data.subscribers);
      } catch (err) {
        console.error('Error fetching subscribers:', err);
      }
    };
    fetch();
  }, []);

  return (
    <div data-testid="admin-subscribers-page">
      <h1 className="text-2xl sm:text-3xl tracking-tight font-bold font-cabinet mb-8">Newsletter Subscribers</h1>

      <div className="border border-border">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-satoshi text-muted-foreground uppercase tracking-wider">
          <div className="col-span-6">Email</div>
          <div className="col-span-3">Subscribed At</div>
          <div className="col-span-3">Status</div>
        </div>
        {subscribers.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground font-satoshi" data-testid="no-subscribers-msg">
            No subscribers yet.
          </div>
        ) : (
          subscribers.map((sub, i) => (
            <div key={sub.sub_id} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center" data-testid={`subscriber-row-${i}`}>
              <div className="col-span-6 text-sm font-satoshi">{sub.email}</div>
              <div className="col-span-3 text-xs text-muted-foreground font-satoshi">
                {new Date(sub.subscribed_at).toLocaleDateString()}
              </div>
              <div className="col-span-3">
                <span className={`text-xs px-2 py-0.5 ${sub.active ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground'}`}>
                  {sub.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
