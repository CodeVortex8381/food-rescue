import React, { useEffect, useState } from 'react';
import { Utensils, HeartHandshake, Leaf, IndianRupee, Store, Users, Truck, Trophy, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return (
      <div className="py-20 flex justify-center text-slate-400 text-xs font-semibold">
        Loading impact stats...
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Food Rescued',
      value: `${stats.total_portions_rescued.toLocaleString()} portions`,
      sub: `${stats.total_listings_completed} listings completed`,
      icon: Utensils,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      badge: '+12% this week'
    },
    {
      title: 'Food Waste Avoided',
      value: `${stats.waste_avoided_kg.toLocaleString()} kg`,
      sub: 'Diverted from landfills',
      icon: HeartHandshake,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      badge: 'Landfill Diverted'
    },
    {
      title: 'CO2 Emission Prevented',
      value: `${stats.co2_reduction_kg.toLocaleString()} kg CO₂`,
      sub: 'Equivalent to planting 120 trees',
      icon: Leaf,
      color: 'from-teal-500 to-cyan-600',
      textColor: 'text-teal-400',
      badge: 'Green Impact'
    },
    {
      title: 'Monetary Value Saved',
      value: `₹${stats.money_saved_inr.toLocaleString()}`,
      sub: 'Nutritional food provided',
      icon: IndianRupee,
      color: 'from-sky-500 to-indigo-600',
      textColor: 'text-sky-400',
      badge: 'Economic Value'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" /> Hackathon Impact Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
            Turn Surplus Food Into <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Hope & Meals</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            BhojanSetu unites food providers, community shelters, and volunteers into a real-time rescue grid that intercepts surplus food before it becomes waste.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('provider')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Report Surplus Food
            </button>
            <button
              onClick={() => onNavigateTab('recipient')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              Explore Recipient Feed
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card p-5 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-slate-950 shadow-md`}>
                  <Icon className="w-5 h-5 font-bold" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {card.badge}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`text-2xl font-black ${card.textColor} tracking-tight mt-0.5`}>
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Stats & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Network Ecosystem */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Active Rescue Network
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <Store className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-slate-100">{stats.active_providers}</div>
              <span className="text-[10px] text-slate-400 font-medium">Food Donors</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <HeartHandshake className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-slate-100">{stats.registered_ngos}</div>
              <span className="text-[10px] text-slate-400 font-medium">Recipient NGOs</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
              <Truck className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-slate-100">{stats.active_volunteers}</div>
              <span className="text-[10px] text-slate-400 font-medium">Volunteers</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Average Pickup Velocity</span>
              <span className="text-emerald-400 font-bold">28 minutes</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-4/5 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-500">80% of surplus food is collected within 45 minutes of reporting.</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" /> Rescue Distribution by Food Type
          </h3>

          <div className="space-y-3">
            {Object.entries(stats.rescue_by_category).map(([cat, pct], idx) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{cat}</span>
                  <span className="text-slate-400 font-bold">{pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-amber-500' : idx === 2 ? 'bg-sky-500' : 'bg-purple-500'
                    }`} 
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Verified Safety Compliance: <strong className="text-emerald-400">100%</strong></span>
            <span className="text-[10px] text-slate-500">Updated Real-Time</span>
          </div>
        </div>

      </div>

    </div>
  );
}
