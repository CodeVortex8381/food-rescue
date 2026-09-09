import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Send } from 'lucide-react';

export default function PredictionSimulator({ onPublishFromPrediction }) {
  const [formData, setFormData] = useState({
    provider_id: 1,
    food_item: 'Chicken Biryani & Mirchi Ka Salan',
    expected_customers: 250,
    prepared_quantity: 320,
    event_type: 'Regular Operational Day',
    weather: 'Normal / Clear'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setPrediction(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    handlePredict();
  }, [formData]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
            <BrainCircuit className="w-8 h-8 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100">AI Surplus & What-If Simulator</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Predictive ML Model
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Prevent food waste before it happens. Model expected customer footfall, weather conditions, and event parameters to forecast potential surplus in real time.
            </p>
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Input Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Operational Scenario Inputs
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Food Item</label>
            <input
              type="text"
              value={formData.food_item}
              onChange={(e) => setFormData({ ...formData, food_item: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prepared Quantity (Portions)</label>
              <input
                type="number"
                value={formData.prepared_quantity}
                onChange={(e) => setFormData({ ...formData, prepared_quantity: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-bold text-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Footfall / Customers</label>
              <input
                type="number"
                value={formData.expected_customers}
                onChange={(e) => setFormData({ ...formData, expected_customers: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-bold text-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Weather Forecast</label>
            <select
              value={formData.weather}
              onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Normal / Clear">Normal / Clear Weather ☀️</option>
              <option value="Heavy Rain">Heavy Rain (Footfall -25%) 🌧️</option>
              <option value="Extreme Heat">Extreme Heat (Footfall -15%) 🌡️</option>
              <option value="Cold / Pleasant">Cold / Pleasant (Footfall +10%) 🌤️</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Flag / Context</label>
            <select
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Regular Operational Day">Regular Operational Day</option>
              <option value="College Festival / Concert">College Festival / Concert (+35% Demand)</option>
              <option value="Community Bhandara / Feast">Community Bhandara / Feast (+50% Demand)</option>
              <option value="Weekend Buffet Special">Weekend Buffet Special (+20% Demand)</option>
            </select>
          </div>
        </div>

        {/* AI Output Card & Analytics */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Forecast Dashboard</span>
              {prediction && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  Model Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {prediction ? (
              <div className="mt-6 space-y-6">
                
                {/* Portion Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <span className="text-xs text-slate-400 block mb-1">Prepared</span>
                    <span className="text-2xl font-extrabold text-slate-100">{prediction.prepared_quantity}</span>
                    <span className="text-[10px] text-slate-500 block">portions</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                    <span className="text-xs text-slate-400 block mb-1">Predicted Demand</span>
                    <span className="text-2xl font-extrabold text-sky-400">{prediction.predicted_demand}</span>
                    <span className="text-[10px] text-slate-500 block font-medium">portions consumed</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    prediction.potential_surplus > 30 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    <span className="text-xs block mb-1 font-semibold">Estimated Surplus</span>
                    <span className="text-2xl font-extrabold">{prediction.potential_surplus}</span>
                    <span className="text-[10px] block font-medium">portions excess</span>
                  </div>
                </div>

                {/* Recommendation Alert Box */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  prediction.potential_surplus > 30
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold block">AI Recommendation</span>
                    <p className="leading-relaxed">{prediction.recommendation}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">Calculating prediction...</div>
            )}
          </div>

          {/* Direct Action */}
          {prediction && prediction.potential_surplus > 0 && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Want to rescue this predicted surplus?</span>
              <button
                onClick={() => onPublishFromPrediction({
                  food_name: formData.food_item,
                  portion_count: prediction.potential_surplus,
                  category: 'Prepared Meals',
                  veg_type: 'Vegetarian',
                  prepared_at: 'Now',
                  available_until: '10:30 PM',
                  address: 'Connaught Place, New Delhi',
                  latitude: 28.6315,
                  longitude: 77.2167,
                  description: `AI Predicted Pre-Surplus listing (${prediction.potential_surplus} portions estimated excess).`
                })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                Publish Pre-Surplus Listing ({prediction.potential_surplus} Portions)
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
