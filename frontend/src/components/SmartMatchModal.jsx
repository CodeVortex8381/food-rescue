import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, MapPin, Users, Award, Send } from 'lucide-react';

export default function SmartMatchModal({ isOpen, onClose, listing, onRequestAccepted }) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && listing) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id })
      })
        .then((res) => res.json())
        .then((data) => {
          setMatchData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Smart Matching Engine</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  AI Algorithmic Match
                </span>
              </div>
              <p className="text-xs text-slate-400">Finding optimal nearby recipients for: <span className="text-amber-300 font-medium">{listing.food_name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold">Calculating distance, urgency & capacity compatibility scores...</p>
            </div>
          ) : matchData && matchData.recommended_recipients ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Recommended Recipients ({matchData.recommended_recipients.length})</span>
                <span>Sorted by Compatibility Score</span>
              </div>

              {matchData.recommended_recipients.map((rec, idx) => (
                <div 
                  key={rec.recipient_id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    idx === 0 
                      ? 'bg-gradient-to-r from-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/50' 
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                            <Award className="w-3 h-3" /> Best Match
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-slate-100">{rec.recipient_name}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {rec.address} ({rec.distance_km} km)
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-400" /> Capacity: {rec.capacity} portions
                        </span>
                      </div>

                      {/* Reasons tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rec.match_reasons.map((reason, rIdx) => (
                          <span key={rIdx} className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-lg border border-slate-700">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right score & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-emerald-400">{rec.match_score}%</div>
                        <span className="text-[10px] text-slate-400">Match Score</span>
                      </div>

                      <button
                        onClick={() => {
                          onRequestAccepted(listing.id, rec.recipient_name);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" /> Direct Assign
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No matching recipients found in range.</p>
          )}

        </div>
      </div>
    </div>
  );
}
