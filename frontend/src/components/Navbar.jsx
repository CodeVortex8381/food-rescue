import React, { useState } from 'react';
import { 
  Utensils, 
  Map, 
  BrainCircuit, 
  BarChart3, 
  Bell, 
  PlusCircle, 
  UserCheck, 
  HeartHandshake, 
  Truck, 
  Store,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole, 
  onOpenReportModal,
  notifications = []
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles = [
    { id: 'PROVIDER', label: 'Food Provider', icon: Store, color: 'text-amber-400' },
    { id: 'RECIPIENT', label: 'Recipient NGO', icon: HeartHandshake, color: 'text-emerald-400' },
    { id: 'VOLUNTEER', label: 'Volunteer Hero', icon: Truck, color: 'text-sky-400' },
  ];

  const activeRoleObj = roles.find(r => r.id === currentRole) || roles[0];
  const ActiveRoleIcon = activeRoleObj.icon;

  const tabs = [
    { id: 'overview', label: 'Overview & Impact', icon: BarChart3 },
    { id: 'provider', label: 'Provider Hub', icon: Store },
    { id: 'recipient', label: 'Recipient Feed', icon: HeartHandshake },
    { id: 'volunteer', label: 'Volunteer Logistics', icon: Truck },
    { id: 'map', label: 'Live Rescue Map', icon: Map },
    { id: 'prediction', label: 'AI Prediction Lab', icon: BrainCircuit },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Utensils className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                BhojanSetu
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Surplus Food Rescue & Redistribution Network</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:border-slate-600 transition-all"
            >
              <ActiveRoleIcon className={`w-4 h-4 ${activeRoleObj.color}`} />
              <span className="hidden sm:inline">Role: {activeRoleObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        currentRole === r.id
                          ? 'bg-slate-700 text-emerald-400 font-semibold'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${r.color}`} />
                      {r.label}
                      {currentRole === r.id && <UserCheck className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                  <span className="text-xs font-bold text-slate-200">Live Rescue Alerts</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Real-time</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
                      <div className="font-semibold text-slate-200">{n.title}</div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Report Food CTA Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span className="hidden md:inline">Report Surplus Food</span>
            <span className="md:hidden">Report</span>
          </button>

        </div>
      </div>
    </header>
  );
}
