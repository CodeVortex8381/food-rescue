import React, { useState } from 'react';
import { HeartHandshake, Filter, Utensils, Clock, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RecipientDashboard({ listings = [], onRequestFood }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVegType, setSelectedVegType] = useState('All');

  const categories = ['All', 'Prepared Meals', 'Bakery & Snacks', 'Fruits & Vegetables'];
  const vegTypes = ['All', 'Vegetarian', 'Non-Vegetarian'];

  const filteredListings = listings.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedVegType !== 'All' && item.veg_type !== selectedVegType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Recipient Discovery Feed</h2>
            <p className="text-xs text-slate-400">Discover and claim nearby surplus prepared food for shelters and community distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Verified NGO Account
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Filter className="w-4 h-4 text-emerald-400" /> Filter Listings:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {vegTypes.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVegType(v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedVegType === v
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Nearby Available Food ({filteredListings.length})
        </h3>

        {filteredListings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs font-medium">
            No food listings found matching selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => {
              const isAvailable = item.status === 'AVAILABLE';
              const isCritical = item.urgency_level === 'CRITICAL' || item.urgency_level === 'HIGH';

              return (
                <div key={item.id} className="glass-card overflow-hidden flex flex-col justify-between group">
                  
                  {/* Card Image */}
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

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-400 border border-slate-700">
                        {item.veg_type} 🥗
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-slate-400 font-medium">{item.provider_name}</span>
                      <h4 className="font-bold text-sm text-slate-100 mt-0.5 line-clamp-1">{item.food_name}</h4>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Available Quantity:</span>
                        <span className="font-bold text-emerald-400">{item.portion_count} portions</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Pickup Deadline:</span>
                        <span className="font-semibold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.available_until}
                        </span>
                      </div>

                      <div className="flex items-start gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-800">
                      {isAvailable ? (
                        <button
                          onClick={() => onRequestFood(item)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Request Food Claim
                        </button>
                      ) : (
                        <div className="w-full py-2 bg-slate-800 text-slate-400 font-semibold text-xs rounded-xl text-center">
                          Status: {item.status}
                        </div>
                      )}
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
