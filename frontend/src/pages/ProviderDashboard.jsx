import React from 'react';
import { Store, PlusCircle, Sparkles, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ProviderDashboard({ 
  listings = [], 
  onOpenReportModal, 
  onOpenSmartMatch 
}) {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Food Provider Management Hub</h2>
            <p className="text-xs text-slate-400">Report surplus prepared food & trigger smart AI recipient matching</p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          Report Surplus Food
        </button>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Your Active Surplus Listings ({listings.length})
          </h3>
          <span className="text-xs text-slate-400">Live Status Updates</span>
        </div>

        {listings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <Store className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-xs font-medium">No active food listings. Report surplus food to start rescuing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => {
              const isAvailable = item.status === 'AVAILABLE';
              const isCritical = item.urgency_level === 'CRITICAL' || item.urgency_level === 'HIGH';

              return (
                <div 
                  key={item.id} 
                  className="glass-card overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Image / Header */}
                  <div className="relative h-44 overflow-hidden bg-slate-800">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.food_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isCritical ? 'badge-critical' : 'badge-medium'
                      }`}>
                        {item.urgency_level} URGENCY
                      </span>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        isAvailable ? 'status-available' : 'status-requested'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-bold bg-slate-900/80 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                        {item.veg_type} 🥗
                      </span>
                      <h4 className="font-bold text-sm text-slate-100 mt-1 line-clamp-1">{item.food_name}</h4>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quantity:</span>
                        <span className="font-bold text-emerald-400">{item.portion_count} portions</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Available Until:</span>
                        <span className="font-semibold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.available_until}
                        </span>
                      </div>

                      <div className="flex items-start gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => onOpenSmartMatch(item)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        Smart AI Match
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
