import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Navigation, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VolunteerDashboard({ volunteerId = 7 }) {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/pickups')
      .then((res) => res.json())
      .then((data) => {
        setPickups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateStatus = (pickupId, newStatus) => {
    fetch(`http://127.0.0.1:8000/api/pickups/${pickupId}?status=${encodeURIComponent(newStatus)}&volunteer_id=${volunteerId}&volunteer_name=Rohan%20Verma`, {
      method: 'PUT'
    })
      .then((res) => res.json())
      .then(() => fetchPickups())
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Volunteer Logistics Hub</h2>
            <p className="text-xs text-slate-400">Accept pickup tasks and deliver surplus food from restaurants to recipient shelters</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-sky-400 font-semibold">
          <Navigation className="w-4 h-4 text-sky-400" />
          Active Driver: Rohan Verma
        </div>
      </div>

      {/* Pickups List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Available Pickup & Delivery Tasks ({pickups.length})
          </h3>
          <span className="text-xs text-slate-400">Live Logistics Routing</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading logistics tasks...</div>
        ) : pickups.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs font-medium">
            No active pickup tasks available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pickups.map((item) => (
              <div key={item.id} className="glass-card p-5 space-y-4 flex flex-col justify-between">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                      Task #{item.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Status: <strong className="text-amber-400">{item.status}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.volunteer_name || 'Unassigned'}</span>
                </div>

                {/* Route detail */}
                <div className="space-y-3 text-xs">
                  {/* Pickup */}
                  <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup Origin</span>
                      <p className="font-semibold text-slate-200">{item.pickup_address}</p>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex justify-center text-slate-600">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>

                  {/* Delivery */}
                  <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery Destination</span>
                      <p className="font-semibold text-slate-200">{item.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  {item.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'IN_TRANSIT')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" /> Accept & Start Pickup
                    </button>
                  )}

                  {item.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, 'COMPLETED')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Delivery Completed
                    </button>
                  )}

                  {item.status === 'COMPLETED' && (
                    <div className="w-full py-2 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-xl text-center border border-emerald-500/20 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Task Completed ✓
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
