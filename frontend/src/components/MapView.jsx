import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Utensils, MapPin, Clock, ShieldCheck, Send } from 'lucide-react';

// Fix standard Leaflet default icon URL issues in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon Creator
const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const foodIcon = createCustomMarker('#10b981'); // Emerald
const recipientIcon = createCustomMarker('#0ea5e9'); // Sky Blue
const criticalIcon = createCustomMarker('#f43f5e'); // Rose Pulsing

export default function MapView({ listings = [], recipients = [], onRequestFood }) {
  const centerLat = 28.6448;
  const centerLng = 77.2167;

  return (
    <div className="w-full h-[650px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Food Listings Markers */}
        {listings.map((item) => {
          const isCritical = item.urgency_level === 'CRITICAL' || item.urgency_level === 'HIGH';
          const iconToUse = isCritical ? criticalIcon : foodIcon;

          return (
            <Marker key={`food-${item.id}`} position={[item.latitude, item.longitude]} icon={iconToUse}>
              <Popup className="custom-popup">
                <div className="p-1 max-w-xs text-slate-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCritical ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.urgency_level} URGENCY
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {item.veg_type}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{item.food_name}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{item.provider_name}</p>

                  <div className="my-2 space-y-1 text-xs text-slate-700">
                    <div className="flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.portion_count} portions available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Until {item.available_until}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>{item.address}</span>
                    </div>
                  </div>

                  {onRequestFood && item.status === 'AVAILABLE' && (
                    <button
                      onClick={() => onRequestFood(item)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Food
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Recipient NGO Markers */}
        {recipients.map((rec) => (
          <Marker key={`rec-${rec.id}`} position={[rec.latitude || 28.65, rec.longitude || 77.22]} icon={recipientIcon}>
            <Popup>
              <div className="p-1 max-w-xs text-slate-900">
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                  NGO Recipient
                </span>
                <h4 className="font-bold text-sm mt-1">{rec.name}</h4>
                <p className="text-xs text-slate-600">{rec.address}</p>
                <div className="mt-2 text-xs font-semibold text-sky-700">
                  Capacity: {rec.capacity} portions
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}
