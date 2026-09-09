import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { GuidedTourModal } from './components/common/GuidedTourModal';
import { Toast } from './components/common/Toast';

// Buyer views & modals
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { BrowseProduce } from './components/buyer/BrowseProduce';
import { DemandRequestsList } from './components/buyer/DemandRequestsList';
import { MatchingView } from './components/buyer/MatchingView';
import { BuyerOrders } from './components/buyer/BuyerOrders';
import { CreateDemandRequestModal } from './components/buyer/CreateDemandRequestModal';
import { NegotiationModal } from './components/buyer/NegotiationModal';
import { QualityInspectionModal } from './components/buyer/QualityInspectionModal';
import { BuyerTypeOnboardingModal } from './components/buyer/BuyerTypeOnboardingModal';

// Farmer views & modals
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { FarmerListings } from './components/farmer/FarmerListings';
import { FarmerOrders } from './components/farmer/FarmerOrders';
import { FarmerDemandFeed } from './components/farmer/FarmerDemandFeed';
import { CreateListingModal } from './components/farmer/CreateListingModal';

// Transporter views
import { TransporterDashboard } from './components/transporter/TransporterDashboard';
import { AvailableFreightJobs } from './components/transporter/AvailableFreightJobs';
import { ActiveDeliveryView } from './components/transporter/ActiveDeliveryView';
import { LogisticsTrackingHub } from './components/logistics/LogisticsTrackingHub';

// Admin views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VerificationQueue } from './components/admin/VerificationQueue';
import { DisputeResolution } from './components/admin/DisputeResolution';
import { EscrowVault } from './components/admin/EscrowVault';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminUserDirectory } from './components/admin/AdminUserDirectory';

// Common views
import { MessagesView } from './components/common/MessagesView';
import { MarketIntelView } from './components/common/MarketIntelView';
import { WalletView } from './components/common/WalletView';
import { KYCVerificationView } from './components/common/KYCVerificationView';
import { ProfileView } from './components/common/ProfileView';
import { ContractsView } from './components/common/ContractsView';
import { Phase2FeaturesView } from './components/common/Phase2FeaturesView';
import { UnifiedAuthView } from './components/auth/UnifiedAuthView';
import { FarmPotAssistantDrawer } from './components/assistant/FarmPotAssistantDrawer';
import { AssistantLauncherButton } from './components/assistant/AssistantLauncherButton';

const MainLayout: React.FC = () => {
  const {
    activeView,
    currentRole,
    currentUser,
    isTourOpen,
    setIsTourOpen,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isAuthScreenOpen,
    isBuyerTypeModalOpen,
    setIsBuyerTypeModalOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    listings,
    orders,
    selectedListingId,
    setSelectedListingId,
    selectedOrderId,
    setSelectedOrderId,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateDemandOpen, setIsCreateDemandOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  const targetListing = listings.find(l => l.id === selectedListingId) || listings[0] || null;
  const targetOrder = orders.find(o => o.id === selectedOrderId) || orders[0] || null;

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        if (currentRole === 'BUYER') {
          return <BuyerDashboard onOpenCreateRequest={() => setIsCreateDemandOpen(true)} />;
        }
        if (currentRole === 'FARMER') {
          return <FarmerDashboard onOpenCreateListing={() => setIsCreateListingOpen(true)} />;
        }
        if (currentRole === 'TRANSPORTER') {
          return <TransporterDashboard />;
        }
        if (currentRole === 'ADMIN') {
          return <AdminDashboard />;
        }
        return <BuyerDashboard onOpenCreateRequest={() => setIsCreateDemandOpen(true)} />;

      case 'browse':
      case 'browse-produce':
      case 'marketplace':
        return <BrowseProduce onOpenNegotiation={() => setIsNegotiationOpen(true)} />;

      case 'my-requests':
      case 'requests':
      case 'procurement':
        return <DemandRequestsList onOpenCreateRequest={() => setIsCreateDemandOpen(true)} />;

      case 'matching':
        return <MatchingView onOpenNegotiation={() => setIsNegotiationOpen(true)} />;

      case 'orders':
        if (currentRole === 'FARMER') return <FarmerOrders />;
        if (currentRole === 'TRANSPORTER') return <ActiveDeliveryView />;
        return <BuyerOrders onOpenInspection={() => setIsInspectionOpen(true)} />;

      case 'listings':
      case 'produce':
        return <FarmerListings onOpenCreateListing={() => setIsCreateListingOpen(true)} />;

      case 'requests-feed':
        return <FarmerDemandFeed />;

      case 'available-jobs':
        return <AvailableFreightJobs />;

      case 'active-delivery':
        if (currentRole === 'TRANSPORTER') return <ActiveDeliveryView />;
        return <LogisticsTrackingHub />;

      case 'logistics':
      case 'tracking':
      case 'freight-tracking':
        return <LogisticsTrackingHub />;

      case 'admin-verification':
        return <VerificationQueue />;

      case 'admin-disputes':
        return <DisputeResolution />;

      case 'admin-escrow':
        return <EscrowVault />;

      case 'reports':
      case 'admin-analytics':
      case 'admin-data':
        return <AdminAnalytics />;

      case 'admin-users':
      case 'admin-directory':
        return <AdminUserDirectory />;

      case 'messages':
      case 'chat':
        return <MessagesView />;

      case 'market-intel':
      case 'market-prices':
        return <MarketIntelView />;

      case 'wallet':
      case 'payments':
      case 'payouts':
        return <WalletView />;

      case 'kyc':
      case 'verification':
        return <KYCVerificationView />;

      case 'profile':
      case 'trust-profile':
      case 'trust-score':
      case 'settings':
      case 'account-settings':
        return <ProfileView />;

      case 'contracts':
        return <ContractsView />;

      case 'phase2':
      case 'recurring':
      case 'farmer-bi':
      case 'aggregation':
        return <Phase2FeaturesView />;

      case 'auth':
      case 'client-portals':
      case 'login':
      case 'signup':
      case 'exit':
        return <UnifiedAuthView />;

      default:
        return <BuyerDashboard onOpenCreateRequest={() => setIsCreateDemandOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEAE2] text-[#1F1F1F] flex flex-col font-sans antialiased selection:bg-[#334E1B] selection:text-white">
      <Header
        onToggleMobileSidebar={() => setIsSidebarOpen(prev => !prev)}
        isMobileSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full relative">
        {/* Global Unified Sidebar: 272px sticky desktop, clean drawer on mobile */}
        <Sidebar
          isOpenMobile={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Global Main Content Area: Automatically adapts to remaining width */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 w-full">
          <div className="w-full max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Sleek Interface Footer */}
      <footer className="px-6 sm:px-8 py-3 bg-[#334E1B] text-[#EDFFE0]/80 text-[10px] font-medium flex flex-wrap justify-between items-center uppercase tracking-widest border-t border-[#3F6B24] shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EDFFE0] animate-pulse"></div>
          <span className="text-white font-semibold">© 2026 FarmPot Nigeria · Supply Chain Intelligence v2.1.0</span>
        </div>
        <div className="flex items-center gap-6">
          <span>
            System Status: <span className="text-[#EDFFE0] font-bold">Operational</span>
          </span>
          <span>
            Escrow Pool: <span className="text-white font-bold font-mono">₦ 142.4M</span>
          </span>
        </div>
      </footer>

      {/* Client Authentication & Exit Suite Portal View */}
      {isAuthScreenOpen && <UnifiedAuthView />}

      {/* Global Modals */}
      <CreateDemandRequestModal
        isOpen={isCreateDemandOpen}
        onClose={() => setIsCreateDemandOpen(false)}
      />

      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
      />

      <NegotiationModal
        isOpen={isNegotiationOpen}
        onClose={() => setIsNegotiationOpen(false)}
        listing={targetListing}
      />

      <QualityInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        order={targetOrder}
      />

      {/* FarmPot Assistant Floating Launcher & Conversational Interface */}
      <AssistantLauncherButton
        isOpen={isAssistantOpen}
        onClick={() => setIsAssistantOpen(true)}
      />

      <FarmPotAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpenCreateDemand={() => setIsCreateDemandOpen(true)}
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenNegotiation={(listing) => {
          if (listing) setSelectedListingId(listing.id);
          setIsNegotiationOpen(true);
        }}
        onOpenInspection={(order) => {
          if (order) setSelectedOrderId(order.id);
          setIsInspectionOpen(true);
        }}
      />

      <BuyerTypeOnboardingModal
        isOpen={
          Boolean(
            (currentRole === 'BUYER' || currentUser?.role === 'BUYER') &&
            (currentUser?.buyerClassificationCompleted === false || isBuyerTypeModalOpen)
          )
        }
        onClose={() => setIsBuyerTypeModalOpen(false)}
        mode={currentUser?.buyerClassificationCompleted === false ? 'onboarding' : 'edit'}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
