import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Listing,
  DemandRequest,
  Order,
  OrderStatus,
  Offer,
  Conversation,
  Message,
  NotificationItem,
  MarketCommodityPrice,
  RecurringProcurementSchedule,
  AggregatedOrderBatch,
  MatchScoreResult,
  VerificationDocument,
  DisputeRecord,
  RatingRecord,
  QualityConfirmationCheck,
  TransportJob,
  AuthClientType,
  AuthPageView,
  SessionSummary
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_DEMAND_REQUESTS,
  INITIAL_ORDERS,
  INITIAL_OFFERS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_RECURRING_SCHEDULES,
  INITIAL_AGGREGATION_BATCHES
} from '../data/initialData';

interface AppContextType {
  // Auth & Role
  currentUser: User;
  users: User[];
  setCurrentUserById: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  registerUser: (user: Partial<User>) => User;

  // Dedicated Client Auth Flow (Buyers, Transporters, Admin, Farmers)
  isAuthScreenOpen: boolean;
  setIsAuthScreenOpen: (open: boolean) => void;
  authClient: AuthClientType;
  setAuthClient: (client: AuthClientType) => void;
  authPage: AuthPageView;
  setAuthPage: (page: AuthPageView) => void;
  sessionSummary: SessionSummary | null;
  openAuth: (client?: AuthClientType, page?: AuthPageView) => void;
  closeAuth: () => void;
  logoutToExitPage: (reason?: string) => void;
  loginWithCredentials: (emailOrPhone: string, password?: string, clientType?: AuthClientType) => boolean;
  signupWithRoleData: (roleData: any, clientType: AuthClientType) => User;

  // Verification
  submitVerification: (userId: string, documents: VerificationDocument[]) => void;
  submitVerificationRequest: (data: Partial<User['verification']>) => void;
  adminReviewVerification: (userId: string, status: 'VERIFIED' | 'REJECTED' | 'RESUBMISSION_REQUIRED', reason?: string) => void;
  approveVerification: (userId: string, notes?: string) => void;
  rejectVerification: (userId: string, reason?: string) => void;

  // Listings (Farmer)
  listings: Listing[];
  createListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => void;
  updateListingStatus: (id: string, status: Listing['status']) => void;
  deleteListing: (id: string) => void;
  pauseListing: (id: string) => void;
  resumeListing: (id: string) => void;
  duplicateListing: (id: string) => Listing;

  // Demand Requests (Buyer)
  demandRequests: DemandRequest[];
  createDemandRequest: (request: Omit<DemandRequest, 'id' | 'createdAt' | 'updatedAt' | 'matchedListingIds'>) => DemandRequest;
  updateDemandRequest: (id: string, data: Partial<DemandRequest>) => void;
  cancelDemandRequest: (id: string) => void;

  // Matching Engine
  findMatchesForRequest: (requestId: string) => MatchScoreResult[];
  findDemandForListing: (listingId: string) => DemandRequest[];
  topMatchingSuppliers?: any[];

  // Negotiation & Offers
  offers: Offer[];
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt'>) => Offer;
  createStructuredOffer: (offer: Omit<Offer, 'id' | 'createdAt'>) => Offer;
  respondToOffer: (offerId: string, response: 'ACCEPT' | 'REJECT' | 'COUNTER', counterData?: Partial<Offer>) => void;

  // Orders & State Machine
  orders: Order[];
  createOrderFromOffer: (offerId: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, actorName: string, notes?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Payments & Escrow
  processPayment: (orderId: string, paymentMethod: 'BANK_TRANSFER' | 'CARD' | 'FARMPOT_WALLET' | 'USSD' | string, amount?: number) => Promise<boolean>;
  releaseEscrowToSupplier: (orderId: string) => void;
  releaseEscrowFunds: (orderId: string) => void;
  refundEscrowToBuyer: (orderId: string, amountNGN?: number) => void;
  refundEscrowFunds: (orderId: string, reason?: string) => void;
  addFundsToWallet: (userId: string, amountNGN: number) => void;
  updateWalletBalance: (amountNGN: number) => void;

  // Logistics & Transporter
  transportJobs: TransportJob[];
  assignTransporter: (orderId: string, transporterId: string) => void;
  assignTransporterToOrder: (orderId: string, transporterId: string) => void;
  updateTransportJobStatus: (orderId: string, status: TransportJob['status'], proofPhoto?: string, notes?: string) => void;
  updateLogisticsStatus: (orderId: string, status: TransportJob['status'] | string, details?: any) => void;
  updateLogisticsCheckpoint: (orderId: string, checkpointId: string, status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING', notes?: string, temperatureC?: number) => void;
  updateLogisticsTelemetry: (orderId: string, telemetry: Partial<TransportJob>) => void;

  // Quality Confirmation
  submitQualityInspection: (orderId: string, inspection: QualityConfirmationCheck) => void;

  // Disputes
  disputes: DisputeRecord[];
  raiseDispute: (dispute: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => void;
  resolveDispute: (disputeId: string, resolution: DisputeRecord['resolutionProposal']) => void;

  // Ratings & Reviews
  ratings: RatingRecord[];
  submitRating: (rating: Omit<RatingRecord, 'id' | 'createdAt'>) => void;
  submitReview: (orderId: string, reviewData: any) => void;

  // Messaging & Conversations
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, attachments?: any[]) => void;
  startOrOpenConversation: (params: { orderId?: string; requestId?: string; listingId?: string; targetUserId: string; targetUserName: string; title: string }) => string;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Market & BI Data
  marketPrices: MarketCommodityPrice[];
  recurringSchedules: RecurringProcurementSchedule[];
  toggleRecurringSchedule: (id: string) => void;
  aggregationBatches: AggregatedOrderBatch[];

  // Navigation & UI state
  activeView: string;
  setActiveView: (view: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  currentRole: UserRole;

  // Guided Walkthrough Tour
  tourStep: number | null;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;

  // Feature Gates
  featureFlags: {
    mvp: boolean;
    phase2RecurringAndAggregation: boolean;
    phase3AiForecasting: boolean;
  };
  toggleFeatureFlag: (flag: 'phase2RecurringAndAggregation' | 'phase3AiForecasting') => void;

  // Toast feedback
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('farmpot_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('usr-buyer-1');

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('farmpot_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [demandRequests, setDemandRequests] = useState<DemandRequest[]>(() => {
    const saved = localStorage.getItem('farmpot_demand_requests');
    return saved ? JSON.parse(saved) : INITIAL_DEMAND_REQUESTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('farmpot_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('farmpot_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('farmpot_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('farmpot_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('farmpot_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [marketPrices] = useState<MarketCommodityPrice[]>(INITIAL_MARKET_PRICES);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringProcurementSchedule[]>(INITIAL_RECURRING_SCHEDULES);
  const [aggregationBatches] = useState<AggregatedOrderBatch[]>(INITIAL_AGGREGATION_BATCHES);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [ratings, setRatings] = useState<RatingRecord[]>([]);

  // Navigation State
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('FP-10245');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>('req-201');

  // Dedicated Client Auth Flow State (Buyers, Transporters, Admin, Farmers)
  const [isAuthScreenOpen, setIsAuthScreenOpen] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClientType>('BUYER');
  const [authPage, setAuthPage] = useState<AuthPageView>('login');
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  // Guided Walkthrough
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    mvp: true,
    phase2RecurringAndAggregation: true,
    phase3AiForecasting: false,
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('farmpot_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('farmpot_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('farmpot_demand_requests', JSON.stringify(demandRequests));
  }, [demandRequests]);

  useEffect(() => {
    localStorage.setItem('farmpot_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('farmpot_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('farmpot_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('farmpot_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('farmpot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const setCurrentUserById = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      showToast(`Switched account to ${user.name} (${user.role})`, 'info');
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setActiveView('dashboard');
      showToast(`Switched to ${role} view (${targetUser.name})`, 'info');
    } else {
      // If no demo user has this role, create or update
      const updated = { ...currentUser, role };
      updateUserProfile(currentUser.id, { role });
      showToast(`Role updated to ${role}`, 'info');
    }
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New FarmPot User',
      email: userData.email || 'user@farmpot.ng',
      phone: userData.phone || '+234 800 000 0000',
      role: userData.role || 'FARMER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      state: userData.state || 'Kaduna',
      lga: userData.lga || 'Zaria',
      address: userData.address || 'Agricultural Corridor',
      businessName: userData.businessName || 'Agri Enterprises',
      verification: {
        status: 'NOT_VERIFIED',
        documents: [],
      },
      trustScore: {
        score: 70,
        identityVerified: false,
        farmOrBusinessVerified: false,
        orderCompletionRate: 100,
        deliveryReliabilityRate: 100,
        qualityConsistencyRate: 100,
        averageRating: 5.0,
        totalReviews: 0,
        disputeHistory: 'None',
        responseRate: 100,
      },
      walletBalance: 0,
      escrowBalance: 0,
      joinedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    showToast(`Welcome to FarmPot, ${newUser.name}!`, 'success');
    return newUser;
  };

  const roleToAuthClient = (role: UserRole): AuthClientType => {
    if (role === 'BUYER') return 'BUYER';
    if (role === 'FARMER') return 'FARMER';
    if (role === 'TRANSPORTER') return 'TRANSPORTER';
    return 'ADMIN';
  };

  const openAuth = (client?: AuthClientType, page?: AuthPageView) => {
    if (client) setAuthClient(client);
    if (page) setAuthPage(page);
    setIsAuthScreenOpen(true);
  };

  const closeAuth = () => {
    setIsAuthScreenOpen(false);
  };

  const logoutToExitPage = (reason?: string) => {
    const role = currentUser?.role || 'BUYER';
    const clientType = roleToAuthClient(role);
    const activeOrders = orders.filter(o =>
      (o.buyerId === currentUser.id || o.supplierId === currentUser.id || o.logistics?.transporterId === currentUser.id) &&
      !['SETTLED', 'CANCELLED', 'REFUNDED'].includes(o.status)
    );
    const totalEscrow = activeOrders.reduce((sum, o) => sum + (o.escrowAmountNGN || o.totalAmountNGN || 0), 0);

    const summary: SessionSummary = {
      userId: currentUser.id,
      userName: currentUser.name,
      businessName: currentUser.businessName,
      role: currentUser.role,
      clientType,
      loginTime: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
      logoutTime: new Date().toISOString(),
      durationMinutes: 36,
      activeOrdersCount: activeOrders.length,
      escrowProtectedAmountNGN: totalEscrow || currentUser.escrowBalance || 0,
      walletBalanceNGN: currentUser.walletBalance || 0,
      exitReason: reason || 'Secure Session Sign-Off',
    };

    setSessionSummary(summary);
    setAuthClient(clientType);
    setAuthPage('exit');
    setIsAuthScreenOpen(true);
    showToast(`Signed out safely from ${clientType.toLowerCase()} workspace`, 'info');
  };

  const loginWithCredentials = (emailOrPhone: string, _password?: string, clientType?: AuthClientType): boolean => {
    const targetType = clientType || authClient;
    const cleaned = (emailOrPhone || '').trim().toLowerCase();

    // 1. Try finding by email or phone
    let found = users.find(u =>
      (u.email.toLowerCase() === cleaned || u.phone.replace(/\s+/g, '') === cleaned.replace(/\s+/g, '')) &&
      (!targetType || roleToAuthClient(u.role) === targetType)
    );

    // 2. Try finding by name or business name within client type
    if (!found && targetType && cleaned) {
      found = users.find(u =>
        roleToAuthClient(u.role) === targetType &&
        (u.name.toLowerCase().includes(cleaned) || u.businessName?.toLowerCase().includes(cleaned))
      );
    }

    // 3. Fallback to matching first user of clientType
    if (!found && targetType) {
      found = users.find(u => roleToAuthClient(u.role) === targetType);
    }

    if (!found) {
      found = users[0];
    }

    if (found) {
      setCurrentUserId(found.id);
      setIsAuthScreenOpen(false);
      setActiveView('dashboard');
      showToast(`Welcome back, ${found.name}! Signed in to ${found.role} portal.`, 'success');
      return true;
    }

    showToast('Invalid credentials provided.', 'error');
    return false;
  };

  const signupWithRoleData = (roleData: any, clientType: AuthClientType): User => {
    let role: UserRole = 'BUYER';
    if (clientType === 'FARMER') role = 'FARMER';
    if (clientType === 'TRANSPORTER') role = 'TRANSPORTER';
    if (clientType === 'ADMIN') role = 'ADMIN';

    const newUser = registerUser({
      ...roleData,
      role,
    });

    setIsAuthScreenOpen(false);
    setActiveView('dashboard');
    return newUser;
  };

  // Verification methods
  const submitVerification = (userId: string, documents: VerificationDocument[]) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verification: {
            ...u.verification,
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString(),
            documents: [...u.verification.documents, ...documents],
          }
        };
      }
      return u;
    }));

    // Add admin notification
    addNotification({
      userId: 'usr-admin-1',
      title: 'New Verification Submitted',
      message: `User ${currentUser.name} submitted ${documents.length} document(s) for identity & business verification.`,
      type: 'VERIFICATION',
      targetType: 'VERIFICATION',
      targetId: userId,
      channel: 'IN_APP',
    });

    showToast('Verification documents submitted for review!', 'success');
  };

  const adminReviewVerification = (userId: string, status: 'VERIFIED' | 'REJECTED' | 'RESUBMISSION_REQUIRED', reason?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isVerified = status === 'VERIFIED';
        return {
          ...u,
          verification: {
            ...u.verification,
            status,
            verifiedAt: isVerified ? new Date().toISOString() : undefined,
            reviewedBy: currentUser.name,
            rejectionReason: reason,
            documents: u.verification.documents.map(d => ({
              ...d,
              status: isVerified ? 'APPROVED' : (status === 'REJECTED' ? 'REJECTED' : 'PENDING'),
              rejectionReason: !isVerified ? reason : undefined,
            }))
          },
          trustScore: {
            ...u.trustScore,
            score: isVerified ? Math.min(100, u.trustScore.score + 15) : u.trustScore.score,
            identityVerified: isVerified,
            farmOrBusinessVerified: isVerified,
          }
        };
      }
      return u;
    }));

    addNotification({
      userId,
      title: status === 'VERIFIED' ? 'Verification Approved! ✓' : 'Verification Update',
      message: status === 'VERIFIED'
        ? 'Congratulations! Your FarmPot identity and agricultural credentials have been verified.'
        : `Your verification requires attention: ${reason || 'Please check submitted documents.'}`,
      type: 'VERIFICATION',
      targetType: 'VERIFICATION',
      targetId: userId,
      channel: 'IN_APP',
    });

    showToast(`User verification updated to ${status}`, 'info');
  };

  // Helper notification adder
  const addNotification = (item: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Listings CRUD
  const createListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Listing => {
    const newListing: Listing = {
      ...listingData,
      id: `lst-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setListings(prev => [newListing, ...prev]);
    showToast(`Published listing for ${newListing.product}`, 'success');
    return newListing;
  };

  const updateListing = (id: string, data: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l));
    showToast('Listing updated successfully', 'success');
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Listing deleted', 'info');
  };

  const pauseListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'PAUSED', updatedAt: new Date().toISOString() } : l));
    showToast('Listing paused', 'info');
  };

  const resumeListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'PUBLISHED', updatedAt: new Date().toISOString() } : l));
    showToast('Listing resumed to marketplace', 'success');
  };

  const duplicateListing = (id: string): Listing => {
    const source = listings.find(l => l.id === id);
    if (!source) throw new Error('Listing not found');
    const copy: Listing = {
      ...source,
      id: `lst-${Date.now()}`,
      product: `${source.product} (Copy)`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setListings(prev => [copy, ...prev]);
    showToast('Listing duplicated as draft', 'info');
    return copy;
  };

  // Demand Requests CRUD
  const createDemandRequest = (reqData: Omit<DemandRequest, 'id' | 'createdAt' | 'updatedAt' | 'matchedListingIds'>): DemandRequest => {
    const newReq: DemandRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'PUBLISHED',
      matchedListingIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDemandRequests(prev => [newReq, ...prev]);

    // Notify matching farmers
    const matches = findMatchesForRequest(newReq.id);
    if (matches.length > 0) {
      newReq.matchedListingIds = matches.map(m => m.listingId);
      newReq.status = 'MATCHED';
    }

    showToast(`Demand request published for ${newReq.quantity} ${newReq.unit} of ${newReq.product}`, 'success');
    return newReq;
  };

  const updateDemandRequest = (id: string, data: Partial<DemandRequest>) => {
    setDemandRequests(prev => prev.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r));
    showToast('Demand request updated', 'success');
  };

  const cancelDemandRequest = (id: string) => {
    setDemandRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED', updatedAt: new Date().toISOString() } : r));
    showToast('Demand request cancelled', 'info');
  };

  // Matching Engine (Explainable Weighted Scoring)
  const findMatchesForRequest = (requestId: string): MatchScoreResult[] => {
    const request = demandRequests.find(r => r.id === requestId);
    if (!request) return [];

    const results: MatchScoreResult[] = [];

    listings.filter(l => l.status === 'PUBLISHED').forEach(listing => {
      const farmer = users.find(u => u.id === listing.farmerId) || users[1];

      // Matching factors
      const reasons: string[] = [];
      const warnings: string[] = [];

      // 1. Commodity / Category match
      const reqProd = request.product.toLowerCase();
      const listProd = listing.product.toLowerCase();
      const isProductMatch = reqProd.includes(listProd) || listProd.includes(reqProd) ||
        (request.category && listing.category && request.category.toLowerCase() === listing.category.toLowerCase());

      if (!isProductMatch) return; // Must match category/product

      let score = 50;

      // 2. Quantity Fit
      const quantityRatio = Math.min((listing.quantity || 0) / (request.quantity || 1), 1.0);
      const quantityFitPercent = Math.round(quantityRatio * 100);
      if ((listing.quantity || 0) >= (request.quantity || 0)) {
        score += 15;
        reasons.push(`Full volume available (${(listing.quantity || 0).toLocaleString()} ${listing.unit} in stock)`);
      } else {
        score += Math.round(15 * quantityRatio);
        warnings.push(`Partial supply: Supplier has ${listing.quantity} of required ${request.quantity} ${request.unit}`);
      }

      // 3. Price Fit
      let priceFitPercent = 100;
      if ((listing.pricePerUnit || 0) <= (request.maxBudgetPerUnit || 0)) {
        score += 15;
        const savings = (request.maxBudgetPerUnit || 0) - (listing.pricePerUnit || 0);
        reasons.push(`Within budget: ₦${(listing.pricePerUnit || 0).toLocaleString()}/${listing.unit} (₦${(savings || 0).toLocaleString()} under max budget)`);
      } else {
        const diff = (listing.pricePerUnit || 0) - (request.maxBudgetPerUnit || 0);
        const overPercent = (diff / (request.maxBudgetPerUnit || 1)) * 100;
        priceFitPercent = Math.max(0, 100 - Math.round(overPercent));
        score -= 10;
        warnings.push(`Price ₦${(listing.pricePerUnit || 0).toLocaleString()}/${listing.unit} exceeds budget of ₦${(request.maxBudgetPerUnit || 0).toLocaleString()}`);
      }

      // 4. Quality Grade
      let qualityFit = false;
      if (listing.qualityGrade === request.targetQualityGrade || listing.qualityGrade === 'EXPORT_PREMIUM') {
        score += 10;
        qualityFit = true;
        reasons.push(`Quality grade matched (${listing.qualityGrade.replace('_', ' ')})`);
      } else {
        warnings.push(`Offered grade is ${listing.qualityGrade.replace('_', ' ')} vs requested ${request.targetQualityGrade.replace('_', ' ')}`);
      }

      // 5. Trust Score Factor
      const farmerTrust = farmer.trustScore.score;
      if (farmerTrust >= 90) {
        score += 10;
        reasons.push(`High Trust Score: ${farmerTrust}/100 with ${farmer.trustScore.totalReviews} verified trades`);
      } else if (farmerTrust >= 75) {
        score += 5;
        reasons.push(`Verified Supplier Trust Score: ${farmerTrust}/100`);
      }

      // 6. Delivery / Logistics Capability
      if (listing.deliveryCapability === 'FARMPOT_LOGISTICS' || listing.deliveryCapability === 'FARMER_DELIVERS') {
        score += 5;
        reasons.push('Direct haulage and logistics dispatch supported');
      }

      // Distance estimation (e.g. Kaduna to Lagos ~ 780km, Oyo to Lagos ~ 140km)
      let distanceKm = 450;
      if (listing.state === 'Kaduna' && request.destinationState === 'Lagos') distanceKm = 780;
      else if (listing.state === 'Oyo' && request.destinationState === 'Lagos') distanceKm = 135;
      else if (listing.state === 'Kano' && request.destinationState === 'Lagos') distanceKm = 990;
      else if (listing.state === request.destinationState) distanceKm = 35;

      const estimatedLogisticsNGN = Math.round(distanceKm * 280 * (request.quantity / (listing.unit === 'TONNE' ? 1 : 50)));

      const finalScore = Math.min(99, Math.max(40, score));

      results.push({
        listingId: listing.id,
        requestId: request.id,
        listing,
        farmer,
        matchScore: finalScore,
        matchReasons: reasons,
        warnings,
        quantityFitPercent,
        priceFitPercent,
        qualityFit,
        distanceKm,
        estimatedLogisticsNGN: Math.max(80000, estimatedLogisticsNGN),
      });
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  };

  const findDemandForListing = (listingId: string): DemandRequest[] => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return [];
    return demandRequests.filter(r => {
      const p1 = r.product.toLowerCase();
      const p2 = listing.product.toLowerCase();
      return p1.includes(p2) || p2.includes(p1);
    });
  };

  // Negotiation & Offers
  const createOffer = (offerData: Omit<Offer, 'id' | 'createdAt'>): Offer => {
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOffers(prev => [newOffer, ...prev]);

    // Send notification to recipient
    addNotification({
      userId: newOffer.toUserId,
      title: 'New Trade Offer Received',
      message: `${newOffer.fromUserName} made an offer for ${newOffer.quantity} ${newOffer.unit} of ${newOffer.product} at ₦${(newOffer.pricePerUnit || 0).toLocaleString()}/${newOffer.unit}.`,
      type: 'OFFER',
      targetType: 'ORDER',
      targetId: newOffer.orderId,
      channel: 'IN_APP',
    });

    // Start/append message in conversation
    const convId = startOrOpenConversation({
      orderId: newOffer.orderId,
      requestId: newOffer.requestId,
      listingId: newOffer.listingId,
      targetUserId: newOffer.toUserId,
      targetUserName: newOffer.toUserName,
      title: `Negotiation: ${newOffer.product}`,
    });

    sendMessage(
      convId,
      `Structured Offer Submitted: ${newOffer.quantity} ${newOffer.unit} @ ₦${(newOffer.pricePerUnit || 0).toLocaleString()}/${newOffer.unit} (Total: ₦${(newOffer.totalProduceAmount || 0).toLocaleString()}) with ${newOffer.deliveryTerms}.`,
      []
    );

    showToast('Structured offer sent to supplier!', 'success');
    return newOffer;
  };

  const respondToOffer = (offerId: string, response: 'ACCEPT' | 'REJECT' | 'COUNTER', counterData?: Partial<Offer>) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    if (response === 'ACCEPT') {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'ACCEPTED' } : o));
      // Generate Order!
      const newOrder = createOrderFromOffer(offerId);
      showToast(`Offer accepted! Order #${newOrder.id} generated.`, 'success');
    } else if (response === 'REJECT') {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'REJECTED' } : o));
      showToast('Offer declined', 'info');
    } else if (response === 'COUNTER' && counterData) {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'COUNTERED' } : o));
      createOffer({
        ...offer,
        ...counterData,
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromRole: currentUser.role,
        toUserId: offer.fromUserId,
        toUserName: offer.fromUserName,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      });
      showToast('Counteroffer submitted!', 'info');
    }
  };

  // Orders State Machine
  const createOrderFromOffer = (offerId: string): Order => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

    const buyer = users.find(u => u.id === (offer.fromRole === 'BUYER' ? offer.fromUserId : offer.toUserId)) || users[0];
    const farmer = users.find(u => u.id === (offer.fromRole === 'FARMER' ? offer.fromUserId : offer.toUserId)) || users[1];

    const produceTotal = offer.totalProduceAmount;
    const logisticsFee = offer.logisticsEstimateNGN || 200000;
    const platformFee = Math.round(produceTotal * 0.02); // 2% platform fee
    const grandTotal = produceTotal + logisticsFee + platformFee;

    const orderNumber = `FP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderNumber,
      requestId: offer.requestId,
      listingId: offer.listingId,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerState: buyer.state,
      supplierId: farmer.id,
      supplierName: farmer.name,
      supplierState: farmer.state,
      product: offer.product,
      quantity: offer.quantity,
      unit: offer.unit,
      qualityGrade: offer.qualityGrade,
      pricePerUnit: offer.pricePerUnit,
      produceTotalNGN: produceTotal,
      logisticsFeeNGN: logisticsFee,
      platformFeeNGN: platformFee,
      grandTotalNGN: grandTotal,
      pickupLocation: offer.pickupLocation || 'Farm Gate Loading Depot',
      deliveryLocation: offer.deliveryDestination || 'Buyer Processing Facility',
      agreedDeliveryDate: offer.agreedDeliveryDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'ORDER_CREATED',
      paymentStatus: 'UNPAID',
      escrow: {
        escrowId: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: orderNumber,
        totalHeldNGN: grandTotal,
        produceAmountNGN: produceTotal,
        logisticsAmountNGN: logisticsFee,
        platformFeeNGN: platformFee,
        status: 'PENDING_DEPOSIT',
        releaseCondition: 'Released within 24 hours of buyer Quality & Quantity acceptance or dispute settlement.',
        expectedReleaseDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        settlementDetails: {
          farmerPayoutNGN: produceTotal,
          transporterPayoutNGN: logisticsFee,
          platformFeeNGN: platformFee,
          buyerRefundNGN: 0,
        }
      },
      logistics: {
        id: `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: orderNumber,
        pickupLocation: offer.pickupLocation || 'Farm Gate Depot',
        pickupState: farmer.state,
        pickupContact: `${farmer.name} (${farmer.phone})`,
        deliveryLocation: offer.deliveryDestination || 'Buyer Facility',
        deliveryState: buyer.state,
        deliveryContact: `${buyer.name} (${buyer.phone})`,
        productDescription: `${offer.quantity} ${offer.unit} of ${offer.product}`,
        totalWeightKg: offer.unit === 'TONNE' ? offer.quantity * 1000 : offer.quantity * 25,
        agreedFreightFeeNGN: logisticsFee,
        status: 'AVAILABLE_JOB',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      historyTimeline: [
        {
          state: 'ORDER_CREATED',
          timestamp: new Date().toISOString(),
          description: `Contract and order generated from accepted offer between ${buyer.name} and ${farmer.name}.`,
          actor: currentUser.name,
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);

    // Notify buyer to fund escrow
    addNotification({
      userId: buyer.id,
      title: `Order ${newOrder.id} Created`,
      message: `Please deposit ₦${(grandTotal || 0).toLocaleString()} into FarmPot Escrow Vault to initiate fulfillment.`,
      type: 'AGREEMENT',
      targetType: 'ORDER',
      targetId: newOrder.id,
      channel: 'IN_APP',
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, actorName: string, notes?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedHistory = [
        ...order.historyTimeline,
        {
          state: newStatus,
          timestamp: new Date().toISOString(),
          description: notes || `Order transitioned to ${newStatus.replace(/_/g, ' ')}`,
          actor: actorName,
        }
      ];

      return {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        historyTimeline: updatedHistory,
      };
    }));

    showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  // Payments & Escrow Engine
  const processPayment = async (orderId: string, paymentMethod: 'BANK_TRANSFER' | 'CARD' | 'FARMPOT_WALLET' | 'USSD'): Promise<boolean> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // Transition to PAYMENT_PENDING -> PROCESSING
    updateOrderStatus(orderId, 'PAYMENT_PENDING', currentUser.name, `Payment initiated via ${paymentMethod}`);

    // Simulate realistic gateway authorization delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Update to PAID & ESCROW_HELD
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'ESCROW_HELD',
          paymentStatus: 'SUCCESSFUL',
          paymentMethod,
          escrow: {
            ...o.escrow,
            status: 'FUNDS_HELD',
            fundedAt: new Date().toISOString(),
          },
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: 'PAID',
              timestamp: new Date().toISOString(),
              description: `Payment of ₦${(o.grandTotalNGN || o.produceTotalNGN || 0).toLocaleString()} confirmed via ${paymentMethod}.`,
              actor: currentUser.name,
            },
            {
              state: 'ESCROW_HELD',
              timestamp: new Date().toISOString(),
              description: `₦${(o.grandTotalNGN || o.produceTotalNGN || 0).toLocaleString()} safely locked in FarmPot Escrow Vault. Ready for pickup preparation.`,
              actor: 'FarmPot Escrow Vault',
            }
          ]
        };
      }
      return o;
    }));

    // Notify Farmer & Transporters
    if (order.supplierId) {
      addNotification({
        userId: order.supplierId,
        title: `Escrow Funded for Order ${order.id}`,
        message: `Buyer has safely deposited ₦${(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()} in Escrow. Please prepare ${order.quantity} ${order.unit} of ${order.product}.`,
        type: 'PAYMENT',
        targetType: 'ORDER',
        targetId: order.id,
        channel: 'IN_APP',
      });
    }

    showToast(`Payment successful! ₦${(order.grandTotalNGN || order.produceTotalNGN || 0).toLocaleString()} held safely in Escrow.`, 'success');
    return true;
  };

  const releaseEscrowToSupplier = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const farmerPayout = order.escrow?.settlementDetails?.farmerPayoutNGN || order.produceTotalNGN || 0;
    const transporterPayout = order.escrow?.settlementDetails?.transporterPayoutNGN || order.logisticsFeeNGN || 0;

    // Credit Farmer wallet
    setUsers(prev => prev.map(u => {
      if (u.id === order.supplierId) {
        return {
          ...u,
          walletBalance: (u.walletBalance || 0) + farmerPayout,
          trustScore: {
            ...u.trustScore,
            score: Math.min(100, (u.trustScore?.score || 90) + 1),
            orderCompletionRate: 99,
          }
        };
      }
      if (order.logistics?.transporterId && u.id === order.logistics.transporterId) {
        return {
          ...u,
          walletBalance: (u.walletBalance || 0) + transporterPayout,
          trustScore: {
            ...u.trustScore,
            score: Math.min(100, (u.trustScore?.score || 90) + 1),
            deliveryReliabilityRate: 99,
          }
        };
      }
      return u;
    }));

    // Update order status
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'COMPLETED',
          escrow: {
            ...o.escrow,
            status: 'RELEASED_TO_FARMER',
            releasedAt: new Date().toISOString(),
          },
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: 'ESCROW_RELEASED',
              timestamp: new Date().toISOString(),
              description: `Escrow released: ₦${(farmerPayout || 0).toLocaleString()} disbursed to Farmer (${order.supplierName}) and ₦${(transporterPayout || 0).toLocaleString()} to Transporter.`,
              actor: 'FarmPot Settlement Engine',
            },
            {
              state: 'COMPLETED',
              timestamp: new Date().toISOString(),
              description: 'Agricultural commerce transaction successfully completed and settled.',
              actor: 'SYSTEM',
            }
          ]
        };
      }
      return o;
    }));

    addNotification({
      userId: order.supplierId,
      title: 'Payout Disbursed! ₦',
      message: `₦${(farmerPayout || 0).toLocaleString()} has been credited to your FarmPot wallet for Order ${order.id}.`,
      type: 'SETTLEMENT',
      targetType: 'WALLET',
      targetId: order.id,
      channel: 'IN_APP',
    });

    showToast(`Escrow released: ₦${(farmerPayout || 0).toLocaleString()} settled to Farmer & ₦${(transporterPayout || 0).toLocaleString()} to Transporter!`, 'success');
  };

  const refundEscrowToBuyer = (orderId: string, amountNGN?: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const refundAmount = amountNGN || order.grandTotalNGN || order.produceTotalNGN || 0;

    setUsers(prev => prev.map(u => {
      if (u.id === order.buyerId) {
        return { ...u, walletBalance: (u.walletBalance || 0) + refundAmount };
      }
      return u;
    }));

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'REFUNDED',
          escrow: {
            ...o.escrow,
            status: 'REFUNDED_TO_BUYER',
            releasedAt: new Date().toISOString(),
          },
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: 'REFUNDED',
              timestamp: new Date().toISOString(),
              description: `Refund of ₦${(refundAmount || 0).toLocaleString()} credited back to Buyer (${order.buyerName}).`,
              actor: 'FarmPot Dispute Resolution Bureau',
            }
          ]
        };
      }
      return o;
    }));

    addNotification({
      userId: order.buyerId,
      title: 'Refund Processed',
      message: `₦${(refundAmount || 0).toLocaleString()} has been refunded to your wallet for Order ${order.id}.`,
      type: 'SETTLEMENT',
      targetType: 'WALLET',
      targetId: order.id,
      channel: 'IN_APP',
    });

    showToast(`Refund of ₦${(refundAmount || 0).toLocaleString()} issued to Buyer.`, 'info');
  };

  const addFundsToWallet = (userId: string, amountNGN: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, walletBalance: (u.walletBalance || 0) + amountNGN } : u));
    showToast(`₦${(amountNGN || 0).toLocaleString()} added to your wallet balance.`, 'success');
  };

  // Logistics & Transporter
  const transportJobs: TransportJob[] = orders
    .filter(o => o.logistics)
    .map(o => o.logistics!);

  const assignTransporterToOrder = (orderId: string, transporterId: string) => {
    const transporter = users.find(u => u.id === transporterId);
    if (!transporter) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedLogistics: TransportJob = {
          ...o.logistics!,
          transporterId: transporter.id,
          transporterName: `${transporter.name} (${transporter.businessName || 'Logistics'})`,
          transporterPhone: transporter.phone,
          transporterVehicle: '15T Cold-Chain Refrigerated Truck',
          status: 'ACCEPTED',
          pickupScheduledTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        };

        return {
          ...o,
          status: 'TRANSPORTER_ASSIGNED',
          logistics: updatedLogistics,
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: 'TRANSPORTER_ASSIGNED',
              timestamp: new Date().toISOString(),
              description: `Transporter ${transporter.name} accepted haulage dispatch job. Freight fee: ₦${(o.logisticsFeeNGN || o.escrow?.logisticsAmountNGN || 0).toLocaleString()}.`,
              actor: transporter.name,
            }
          ]
        };
      }
      return o;
    }));

    showToast(`Transporter ${transporter.name} assigned to Order ${orderId}!`, 'success');
  };

  const updateLogisticsStatus = (
    orderId: string,
    status: TransportJob['status'] | string,
    details?: Partial<TransportJob> & { proofPhoto?: string; notes?: string; currentLocation?: string; temperatureCelsius?: number }
  ) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const typedStatus = status as TransportJob['status'];
    let nextOrderStatus: OrderStatus = order.status;
    if (typedStatus === 'PICKED_UP') nextOrderStatus = 'PICKED_UP';
    if (typedStatus === 'IN_TRANSIT') nextOrderStatus = 'IN_TRANSIT';
    if (typedStatus === 'DELIVERED') nextOrderStatus = 'DELIVERED';

    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.logistics) {
        const updatedTempHistory = details?.temperatureCelsius
          ? [
              ...(o.logistics.temperatureHistory || []),
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                tempC: details.temperatureCelsius,
                location: details.currentLocation || o.logistics.currentLocation || 'Transit Waypoint',
              }
            ]
          : o.logistics.temperatureHistory;

        const updatedCheckpoints = o.logistics.checkpoints?.map(chk => {
          if (typedStatus === 'PICKED_UP' && chk.id === 'chk-1') {
            return { ...chk, status: 'COMPLETED' as const, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          if (typedStatus === 'DELIVERED' && chk.status !== 'COMPLETED') {
            return { ...chk, status: 'COMPLETED' as const, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          return chk;
        }) || o.logistics.checkpoints;

        const updatedLogistics: TransportJob = {
          ...o.logistics,
          status: typedStatus,
          currentLocation: details?.currentLocation || o.logistics.currentLocation,
          temperatureCelsius: details?.temperatureCelsius !== undefined ? details.temperatureCelsius : o.logistics.temperatureCelsius,
          actualPickupTime: typedStatus === 'PICKED_UP' ? new Date().toISOString() : o.logistics.actualPickupTime,
          actualDeliveryTime: typedStatus === 'DELIVERED' ? new Date().toISOString() : o.logistics.actualDeliveryTime,
          pickupProofPhoto: details?.proofPhoto || details?.pickupProofPhoto || o.logistics.pickupProofPhoto,
          deliveryProofPhoto: details?.proofPhoto || details?.deliveryProofPhoto || o.logistics.deliveryProofPhoto,
          driverNotes: details?.notes || details?.driverNotes || o.logistics.driverNotes,
          temperatureHistory: updatedTempHistory,
          checkpoints: updatedCheckpoints,
          speedKmH: typedStatus === 'DELIVERED' ? 0 : (details?.speedKmH !== undefined ? details.speedKmH : o.logistics.speedKmH),
          distanceCoveredKm: typedStatus === 'DELIVERED' ? o.logistics.distanceTotalKm : (details?.distanceCoveredKm !== undefined ? details.distanceCoveredKm : o.logistics.distanceCoveredKm),
          ...(details || {}),
        };

        return {
          ...o,
          status: nextOrderStatus,
          logistics: updatedLogistics,
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: nextOrderStatus,
              timestamp: new Date().toISOString(),
              description: details?.notes || `Logistics status updated to ${status.replace(/_/g, ' ')}. Location: ${updatedLogistics.currentLocation || 'In Transit'}.`,
              actor: currentUser.name,
            }
          ]
        };
      }
      return o;
    }));

    if (typedStatus === 'DELIVERED') {
      addNotification({
        userId: order.buyerId,
        title: 'Agricultural Freight Delivered!',
        message: `Transporter delivered ${order.quantity} ${order.unit} of ${order.product}. Please conduct destination Quality Inspection to release Escrow.`,
        type: 'DELIVERY',
        targetType: 'ORDER',
        targetId: order.id,
        channel: 'IN_APP',
      });
    }

    showToast(`Logistics status updated to ${status.replace(/_/g, ' ')}`, 'success');
  };

  const updateLogisticsCheckpoint = (
    orderId: string,
    checkpointId: string,
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING',
    notes?: string,
    temperatureC?: number
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.logistics && o.logistics.checkpoints) {
        let checkpointName = '';
        const updatedCheckpoints = o.logistics.checkpoints.map(chk => {
          if (chk.id === checkpointId) {
            checkpointName = chk.name;
            return {
              ...chk,
              status,
              timestamp: status === 'COMPLETED' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : chk.timestamp,
              notes: notes || chk.notes,
              temperatureC: temperatureC !== undefined ? temperatureC : chk.temperatureC,
            };
          }
          return chk;
        });

        return {
          ...o,
          logistics: {
            ...o.logistics,
            checkpoints: updatedCheckpoints,
            currentLocation: checkpointName ? `${checkpointName}` : o.logistics.currentLocation,
            temperatureCelsius: temperatureC !== undefined ? temperatureC : o.logistics.temperatureCelsius,
          },
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: o.status,
              timestamp: new Date().toISOString(),
              description: `Checkpoint "${checkpointName}" marked as ${status.replace(/_/g, ' ')}. ${notes ? `Notes: ${notes}` : ''}`,
              actor: currentUser.name,
            }
          ]
        };
      }
      return o;
    }));

    showToast('Logistics checkpoint updated successfully', 'success');
  };

  const updateLogisticsTelemetry = (orderId: string, telemetry: Partial<TransportJob>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.logistics) {
        const updatedTempHistory = telemetry.temperatureCelsius !== undefined
          ? [
              ...(o.logistics.temperatureHistory || []),
              {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                tempC: telemetry.temperatureCelsius,
                location: telemetry.currentLocation || o.logistics.currentLocation || 'Corridor Telemetry Ping',
              }
            ]
          : o.logistics.temperatureHistory;

        return {
          ...o,
          logistics: {
            ...o.logistics,
            ...telemetry,
            temperatureHistory: updatedTempHistory,
          }
        };
      }
      return o;
    }));

    showToast('Live telemetry sensors synced', 'info');
  };

  const updateTransportJobStatus = (orderId: string, status: TransportJob['status'], proofPhoto?: string, notes?: string) => {
    updateLogisticsStatus(orderId, status, { proofPhoto, notes });
  };

  // Quality Inspection
  const submitQualityInspection = (orderId: string, inspection: QualityConfirmationCheck) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isAccepted = inspection.verdict === 'ACCEPTED';
        return {
          ...o,
          status: isAccepted ? 'ACCEPTED' : 'DISPUTED',
          qualityConfirmation: {
            ...inspection,
            inspectedAt: new Date().toISOString(),
            inspectorId: currentUser.id,
          },
          historyTimeline: [
            ...o.historyTimeline,
            {
              state: isAccepted ? 'ACCEPTED' : 'DISPUTED',
              timestamp: new Date().toISOString(),
              description: isAccepted
                ? `Quality inspection passed: Grade ${inspection.confirmedGrade}, Quantity verified (${inspection.confirmedQuantity} ${order.unit}).`
                : `Quality inspection reported issue: ${inspection.inspectorNotes || 'Defects or quantity shortfall reported.'}`,
              actor: `${currentUser.name} (Buyer)`,
            }
          ]
        };
      }
      return o;
    }));

    if (inspection.verdict === 'ACCEPTED') {
      showToast('Produce accepted! Escrow settlement initiating...', 'success');
      setTimeout(() => {
        releaseEscrowToSupplier(orderId);
      }, 1000);
    } else {
      // Auto-raise dispute
      raiseDispute({
        orderId,
        raisedByUserId: currentUser.id,
        raisedByName: currentUser.name,
        raisedByRole: currentUser.role,
        defendantUserId: order.supplierId,
        category: 'QUALITY',
        description: inspection.inspectorNotes || 'Produce quality or quantity failed destination inspection.',
        evidencePhotos: inspection.evidencePhotos || [],
      });
      showToast('Inspection issue reported. Dispute opened for admin investigation.', 'warning');
    }
  };

  // Disputes
  const raiseDispute = (disputeData: Omit<DisputeRecord, 'id' | 'createdAt' | 'status'>) => {
    const newDispute: DisputeRecord = {
      ...disputeData,
      id: `dsp-${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    setDisputes(prev => [newDispute, ...prev]);

    // Update order status to DISPUTED
    updateOrderStatus(disputeData.orderId, 'DISPUTED', currentUser.name, `Dispute opened: ${disputeData.category} - ${disputeData.description}`);

    // Lock Escrow
    setOrders(prev => prev.map(o => {
      if (o.id === disputeData.orderId) {
        return {
          ...o,
          escrow: {
            ...o.escrow,
            status: 'DISPUTED_LOCK',
          }
        };
      }
      return o;
    }));

    addNotification({
      userId: 'usr-admin-1',
      title: 'New Dispute Escalated',
      message: `Dispute filed on Order ${disputeData.orderId} regarding ${disputeData.category}. Investigation required.`,
      type: 'DISPUTE',
      targetType: 'DISPUTE',
      targetId: newDispute.id,
      channel: 'IN_APP',
    });

    showToast('Dispute filed. Escrow locked pending resolution.', 'warning');
  };

  const resolveDispute = (disputeId: string, resolution: DisputeRecord['resolutionProposal']) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute || !resolution) return;

    setDisputes(prev => prev.map(d => d.id === disputeId ? {
      ...d,
      status: 'RESOLVED',
      resolutionProposal: resolution,
      resolvedAt: new Date().toISOString(),
    } : d));

    if (resolution.type === 'FULL_REFUND') {
      refundEscrowToBuyer(dispute.orderId, resolution.refundAmountNGN);
    } else if (resolution.type === 'RELEASE_ESCROW') {
      releaseEscrowToSupplier(dispute.orderId);
    } else if (resolution.type === 'PARTIAL_REFUND') {
      // Split settlement
      const order = orders.find(o => o.id === dispute.orderId);
      if (order) {
        // refund buyer
        if (resolution.refundAmountNGN > 0) {
          refundEscrowToBuyer(dispute.orderId, resolution.refundAmountNGN);
        }
        // pay farmer
        if (resolution.farmerPayoutNGN > 0) {
          setUsers(prev => prev.map(u => u.id === order.supplierId ? { ...u, walletBalance: u.walletBalance + resolution.farmerPayoutNGN } : u));
        }
      }
    }

    showToast(`Dispute resolved via ${resolution.type.replace(/_/g, ' ')}`, 'success');
  };

  // Ratings
  const submitRating = (ratingData: Omit<RatingRecord, 'id' | 'createdAt'>) => {
    const newRating: RatingRecord = {
      ...ratingData,
      id: `rat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRatings(prev => [newRating, ...prev]);

    // Recalculate target user Trust Score & Average Rating
    setUsers(prev => prev.map(u => {
      if (u.id === ratingData.toUserId) {
        const prevReviews = u.trustScore.totalReviews;
        const newTotal = prevReviews + 1;
        const newAvg = Number(((u.trustScore.averageRating * prevReviews + ratingData.overallScore) / newTotal).toFixed(1));
        const newScore = Math.min(100, Math.max(50, Math.round(u.trustScore.score + (ratingData.overallScore >= 4 ? 1 : -2))));

        return {
          ...u,
          trustScore: {
            ...u.trustScore,
            averageRating: newAvg,
            totalReviews: newTotal,
            score: newScore,
          }
        };
      }
      return u;
    }));

    showToast(`Rating submitted! Thank you for strengthening market trust.`, 'success');
  };

  // Messaging
  const sendMessage = (conversationId: string, text: string, attachments?: any[]) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 4)}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      attachments,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: new Date().toISOString(),
        };
      }
      return c;
    }));
  };

  const startOrOpenConversation = (params: { orderId?: string; requestId?: string; listingId?: string; targetUserId: string; targetUserName: string; title: string }): string => {
    const existing = conversations.find(c =>
      (params.orderId && c.orderId === params.orderId) ||
      (c.participants.some(p => p.userId === params.targetUserId) && c.title === params.title)
    );

    if (existing) {
      setActiveConversationId(existing.id);
      setActiveView('messages');
      return existing.id;
    }

    const targetUser = users.find(u => u.id === params.targetUserId) || users[1];
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      orderId: params.orderId,
      requestId: params.requestId,
      listingId: params.listingId,
      title: params.title,
      participants: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          avatar: currentUser.avatar,
        },
        {
          userId: targetUser.id,
          name: targetUser.name,
          role: targetUser.role,
          avatar: targetUser.avatar,
        }
      ],
      lastMessage: 'Conversation initiated.',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      channel: 'IN_APP',
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveView('messages');
    return newConv.id;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read && (n.userId === currentUser.id || n.userId === 'all')).length;

  // Guided Walkthrough Stepper
  const startTour = () => {
    setTourStep(0);
    setCurrentUserId('usr-buyer-1'); // Start as Buyer
    setActiveView('dashboard');
    showToast('Starting Guided FarmPot Transaction Tour', 'info');
  };

  const nextTourStep = () => {
    setTourStep(prev => (prev !== null ? prev + 1 : 0));
  };

  const prevTourStep = () => {
    setTourStep(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
  };

  const endTour = () => {
    setTourStep(null);
    showToast('Tour completed. You can continue testing freely!', 'success');
  };

  const toggleFeatureFlag = (flag: 'phase2RecurringAndAggregation' | 'phase3AiForecasting') => {
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
    showToast(`Feature flag ${flag} toggled`, 'info');
  };

  const toggleRecurringSchedule = (id: string) => {
    setRecurringSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        showToast(`Schedule ${id} is now ${nextStatus}`, 'info');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const submitVerificationRequest = (data: Partial<User['verification']>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          verification: {
            ...u.verification,
            ...data,
            status: 'UNDER_REVIEW',
            submittedAt: new Date().toISOString(),
          }
        };
      }
      return u;
    }));

    addNotification({
      userId: 'usr-admin-1',
      title: 'KYC Verification Submitted',
      message: `${currentUser?.name || 'User'} submitted documentation for verification.`,
      type: 'VERIFICATION',
      targetType: 'VERIFICATION',
      targetId: currentUserId,
      channel: 'IN_APP',
    });

    showToast('KYC & asset verification submitted successfully!', 'success');
  };

  const updateWalletBalance = (amountNGN: number) => {
    addFundsToWallet(currentUserId, amountNGN);
  };

  const updateListingStatus = (id: string, status: Listing['status']) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    showToast(`Listing status updated to ${status}`, 'info');
  };

  const assignTransporter = (orderId: string, transporterId: string) => {
    assignTransporterToOrder(orderId, transporterId);
  };

  const approveVerification = (userId: string, notes?: string) => {
    adminReviewVerification(userId, 'VERIFIED', notes);
  };

  const rejectVerification = (userId: string, reason?: string) => {
    adminReviewVerification(userId, 'REJECTED', reason);
  };

  const releaseEscrowFunds = (orderId: string) => {
    releaseEscrowToSupplier(orderId);
  };

  const refundEscrowFunds = (orderId: string, _reason?: string) => {
    refundEscrowToBuyer(orderId);
  };

  const createStructuredOffer = (offerData: Omit<Offer, 'id' | 'createdAt'>): Offer => {
    return createOffer(offerData);
  };

  const submitReview = (_orderId: string, reviewData: any) => {
    submitRating({
      ...reviewData,
      transactionId: _orderId,
    });
  };

  const currentRole = currentUser?.role || 'BUYER';
  const isTourOpen = tourStep !== null;
  const setIsTourOpen = (open: boolean) => {
    if (open) startTour();
    else endTour();
  };

  const topMatchingSuppliers: any[] = [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        setCurrentUserById,
        switchRole,
        updateUserProfile,
        registerUser,
        isAuthScreenOpen,
        setIsAuthScreenOpen,
        authClient,
        setAuthClient,
        authPage,
        setAuthPage,
        sessionSummary,
        openAuth,
        closeAuth,
        logoutToExitPage,
        loginWithCredentials,
        signupWithRoleData,
        submitVerification,
        submitVerificationRequest,
        adminReviewVerification,
        approveVerification,
        rejectVerification,
        listings,
        createListing,
        updateListing,
        updateListingStatus,
        deleteListing,
        pauseListing,
        resumeListing,
        duplicateListing,
        demandRequests,
        createDemandRequest,
        updateDemandRequest,
        cancelDemandRequest,
        findMatchesForRequest,
        findDemandForListing,
        topMatchingSuppliers,
        offers,
        createOffer,
        createStructuredOffer,
        respondToOffer,
        orders,
        createOrderFromOffer,
        updateOrderStatus,
        getOrderById,
        processPayment,
        releaseEscrowToSupplier,
        releaseEscrowFunds,
        refundEscrowToBuyer,
        refundEscrowFunds,
        addFundsToWallet,
        updateWalletBalance,
        transportJobs,
        assignTransporter,
        assignTransporterToOrder,
        updateTransportJobStatus,
        updateLogisticsStatus,
        updateLogisticsCheckpoint,
        updateLogisticsTelemetry,
        submitQualityInspection,
        disputes,
        raiseDispute,
        resolveDispute,
        ratings,
        submitRating,
        submitReview,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startOrOpenConversation,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        marketPrices,
        recurringSchedules,
        toggleRecurringSchedule,
        aggregationBatches,
        activeView,
        setActiveView,
        selectedOrderId,
        setSelectedOrderId,
        selectedListingId,
        setSelectedListingId,
        selectedRequestId,
        setSelectedRequestId,
        tourStep,
        isTourOpen,
        setIsTourOpen,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
        featureFlags,
        toggleFeatureFlag,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
