import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ReportFoodModal from './components/ReportFoodModal';
import SmartMatchModal from './components/SmartMatchModal';
import MapView from './components/MapView';
import PredictionSimulator from './components/PredictionSimulator';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import ProviderDashboard from './pages/ProviderDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentRole, setCurrentRole] = useState('PROVIDER');

  const [listings, setListings] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [selectedListingForMatch, setSelectedListingForMatch] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch food listings
  const fetchListings = () => {
    fetch('http://127.0.0.1:8000/api/food')
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err));
  };

  // Fetch recipient NGOs
  const fetchRecipients = () => {
    fetch('http://127.0.0.1:8000/api/users?role=RECIPIENT')
      .then((res) => res.json())
      .then((data) => setRecipients(data))
      .catch((err) => console.error(err));
  };

  // Fetch notifications
  const fetchNotifications = () => {
    fetch('http://127.0.0.1:8000/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchListings();
    fetchRecipients();
    fetchNotifications();
  }, []);

  // Handle Publish New Food Listing
  const handlePublishFood = (newListingData) => {
    fetch('http://127.0.0.1:8000/api/food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newListingData)
    })
      .then((res) => res.json())
      .then((createdItem) => {
        fetchListings();
        showToast(`✅ Surplus food "${createdItem.food_name}" published successfully!`);
      })
      .catch((err) => console.error(err));
  };

  // Handle Request / Claim Food
  const handleRequestFood = (listing) => {
    fetch(`http://127.0.0.1:8000/api/food/${listing.id}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listing.id,
        recipient_id: 4,
        recipient_name: 'Aasha Shelter Home',
        requested_quantity: listing.portion_count || 50
      })
    })
      .then((res) => res.json())
      .then(() => {
        fetchListings();
        showToast(`🎉 Request sent for "${listing.food_name}"! Provider notified.`);
      })
      .catch((err) => console.error(err));
  };

  // Handle Direct Smart Match Assignment
  const handleDirectAssignMatch = (listingId, recipientName) => {
    fetch(`http://127.0.0.1:8000/api/food/${listingId}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: listingId,
        recipient_id: 4,
        recipient_name: recipientName,
        requested_quantity: 50
      })
    })
      .then(() => {
        // Accept request automatically
        fetch(`http://127.0.0.1:8000/api/requests/1?action=ACCEPT`, { method: 'PUT' });
        fetchListings();
        showToast(`✨ Smart match assigned & accepted for ${recipientName}! Pickup task routed to volunteers.`);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        notifications={notifications}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {activeTab === 'overview' && (
          <AnalyticsDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'provider' && (
          <ProviderDashboard
            listings={listings}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenSmartMatch={(listing) => {
              setSelectedListingForMatch(listing);
              setIsSmartMatchOpen(true);
            }}
          />
        )}

        {activeTab === 'recipient' && (
          <RecipientDashboard
            listings={listings}
            onRequestFood={handleRequestFood}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerDashboard />
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Live Surplus Rescue Map</h2>
                <p className="text-xs text-slate-400">Interactive OpenStreetMap view of active food listings, NGO recipients, and urgency zones</p>
              </div>
            </div>
            <MapView
              listings={listings}
              recipients={recipients}
              onRequestFood={handleRequestFood}
            />
          </div>
        )}

        {activeTab === 'prediction' && (
          <PredictionSimulator
            onPublishFromPrediction={(data) => handlePublishFood(data)}
          />
        )}

      </main>

      {/* Modals */}
      <ReportFoodModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitFood={handlePublishFood}
      />

      <SmartMatchModal
        isOpen={isSmartMatchOpen}
        onClose={() => setIsSmartMatchOpen(false)}
        listing={selectedListingForMatch}
        onRequestAccepted={handleDirectAssignMatch}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-center text-xs text-slate-500">
        <p className="max-w-7xl mx-auto px-4">
          BhojanSetu — AI-Powered Surplus Food Rescue Platform &copy; 2026. Built with FastAPI & React.
        </p>
      </footer>

    </div>
  );
}
