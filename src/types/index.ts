export type UserRole =
  | 'BUYER'
  | 'FARMER'
  | 'TRANSPORTER'
  | 'ADMIN'
  | 'VERIFICATION_OFFICER'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'SUPPORT';

export type VerificationStatus =
  | 'NOT_VERIFIED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED';

export interface VerificationDocument {
  id: string;
  type: 'NIN' | 'CAC' | 'FARM_C_OF_O' | 'DRIVERS_LICENSE' | 'VEHICLE_ROADWORTHINESS' | 'BANK_STATEMENT' | 'UTILITY_BILL';
  name: string;
  url: string;
  uploadedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface VerificationProfile {
  status: VerificationStatus;
  documents: VerificationDocument[];
  submittedAt?: string;
  verifiedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface TrustScoreBreakdown {
  score: number; // 0 - 100
  identityVerified: boolean;
  farmOrBusinessVerified: boolean;
  orderCompletionRate: number; // e.g. 98%
  deliveryReliabilityRate: number; // e.g. 95%
  qualityConsistencyRate: number; // e.g. 96%
  averageRating: number; // e.g. 4.8
  totalReviews: number;
  disputeHistory: 'None' | 'Low' | 'Moderate' | 'High';
  responseRate: number; // e.g. 97%
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  avatar: string;
  state: string;
  lga: string;
  address: string;
  businessName?: string;
  bio?: string;
  cacNumber?: string;
  ninNumber?: string;
  verification: VerificationProfile;
  trustScore: TrustScoreBreakdown;
  walletBalance: number; // in NGN
  escrowBalance: number; // in NGN
  joinedAt: string;
  disabled?: boolean;

  // Bank & Settlement details
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;

  // Buyer Specific
  buyerType?: 'PROCESSOR' | 'SUPERMARKET' | 'WHOLESALER' | 'EXPORTER' | 'HOTEL_RESTAURANT';
  monthlyProcurementBudgetNGN?: number;
  targetCrops?: string[];
  facilityLocations?: string[];
  preferredQualityGrade?: 'EXPORT_PREMIUM' | 'GRADE_A' | 'GRADE_B' | 'ALL';
  storageWarehouseCapacityMT?: number;

  // Farmer Specific
  farmSizeHectares?: number;
  primaryCrops?: string[];
  storageCapacityTons?: number;
  deliveryCapabilities?: string[];
  cooperativeName?: string;
  cooperativeRegId?: string;
  establishedYear?: number;
  farmingMethod?: 'ORGANIC' | 'CONVENTIONAL' | 'HYDROPONIC' | 'MIXED';
  irrigationType?: 'RAINFED' | 'DRIP_IRRIGATION' | 'BOREHOLE_CENTER_PIVOT' | 'CANAL_FLOOD';

  // Transporter Specific
  fleetSize?: number;
  vehicleTypes?: ('REFRIGERATED_TRUCK' | 'FLATBED_TRUCK' | 'BOX_VAN' | 'PICKUP_TRUCK')[];
  maxPayloadTons?: number;
  coverageStates?: string[];
  gitInsuranceActive?: boolean; // Goods-In-Transit Insurance
  gitPolicyNumber?: string;
  insuranceProvider?: string;
  frscFleetNumber?: string;
  temperatureControlled?: boolean;

  // Admin / Staff Specific
  department?: 'ESCROW_SETTLEMENTS' | 'TRUST_VERIFICATION' | 'DISPUTE_TRIBUNAL' | 'OPERATIONS' | 'EXECUTIVE';
  badgeId?: string;
  supervisorRole?: string;
  clearanceLevel?: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4_MASTER';
  twoFactorEnabled?: boolean;
  emergencyPhone?: string;
}

export interface FarmerProfile extends User {
  farmSizeHectares: number;
  primaryCrops: string[];
  storageCapacityTons: number;
  deliveryCapabilities: string[];
  cooperativeName?: string;
  establishedYear: number;
}

export interface BuyerProfile extends User {
  buyerType: 'PROCESSOR' | 'SUPERMARKET' | 'WHOLESALER' | 'EXPORTER' | 'HOTEL_RESTAURANT';
  monthlyProcurementBudgetNGN: number;
  targetCrops: string[];
  facilityLocations: string[];
}

export interface TransporterProfile extends User {
  fleetSize: number;
  vehicleTypes: ('REFRIGERATED_TRUCK' | 'FLATBED_TRUCK' | 'BOX_VAN' | 'PICKUP_TRUCK')[];
  maxPayloadTons: number;
  coverageStates: string[];
  gitInsuranceActive: boolean; // Goods-In-Transit Insurance
}

export type ListingStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'PARTIALLY_SOLD'
  | 'SOLD_OUT'
  | 'EXPIRED';

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerState: string;
  farmerLga: string;
  product: string; // e.g. "Roma Tomatoes"
  category: 'VEGETABLES' | 'GRAINS' | 'TUBERS' | 'FRUITS' | 'LEGUMES' | 'OIL_SEEDS';
  variety: string; // e.g. "UC82B High-Brix"
  quantity: number;
  unit: 'KG' | 'CRATE' | 'BAG_50KG' | 'BAG_100KG' | 'TONNE';
  pricePerUnit: number; // in NGN
  qualityGrade: 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'EXPORT_PREMIUM';
  moistureContentPercent?: number;
  harvestDate: string;
  availableDate: string;
  expiryDate?: string;
  pickupLocation: string;
  state: string;
  lga: string;
  deliveryCapability: 'PICKUP_ONLY' | 'FARMER_DELIVERS' | 'FARMPOT_LOGISTICS';
  minOrderQuantity: number;
  photos: string[];
  description: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export type DemandRequestStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'MATCHING'
  | 'MATCHED'
  | 'NEGOTIATING'
  | 'FULFILLED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface DemandRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  buyerState: string;
  product: string;
  category: string;
  variety?: string;
  quantity: number;
  unit: 'KG' | 'CRATE' | 'BAG_50KG' | 'BAG_100KG' | 'TONNE';
  targetQualityGrade: 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'EXPORT_PREMIUM';
  maxBudgetPerUnit: number; // in NGN
  totalBudget: number; // in NGN
  deliveryDestination: string;
  destinationState: string;
  destinationLga: string;
  requiredDeliveryDate: string;
  isRecurring: boolean;
  recurringFrequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  notes?: string;
  status: DemandRequestStatus;
  matchedListingIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchScoreResult {
  listingId: string;
  requestId: string;
  listing: Listing;
  farmer: User;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  warnings: string[];
  quantityFitPercent: number;
  priceFitPercent: number;
  qualityFit: boolean;
  distanceKm: number;
  estimatedLogisticsNGN: number;
  shortlisted?: boolean;
}

export type OfferStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COUNTERED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Offer {
  id: string;
  requestId?: string;
  listingId?: string;
  orderId?: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: UserRole;
  toUserId: string;
  toUserName: string;
  product: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  pricePerUnit: number;
  totalProduceAmount: number;
  logisticsEstimateNGN: number;
  deliveryTerms: 'BUYER_ARRANGED' | 'FARMPOT_DISPATCH' | 'FARMER_HANDOFF';
  deliveryDestination: string;
  pickupLocation: string;
  agreedDeliveryDate: string;
  paymentTerms: 'FULL_ESCROW' | '50_DEPOSIT_50_ON_DELIVERY';
  notes?: string;
  status: OfferStatus;
  counterOfferId?: string;
  createdAt: string;
  expiresAt: string;
}

export type OrderStatus =
  | 'DRAFT'
  | 'MATCHED'
  | 'NEGOTIATING'
  | 'AGREEMENT'
  | 'ORDER_CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'ESCROW_HELD'
  | 'READY_FOR_PICKUP'
  | 'TRANSPORTER_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'QUALITY_PENDING'
  | 'ACCEPTED'
  | 'ESCROW_RELEASED'
  | 'SUPPLIER_PAID'
  | 'COMPLETED'
  | 'RATED'
  // Exception States
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'PARTIALLY_FULFILLED'
  | 'DELIVERY_FAILED'
  | 'PAYMENT_FAILED';

export interface EscrowState {
  escrowId: string;
  orderId: string;
  totalHeldNGN: number;
  produceAmountNGN: number;
  logisticsAmountNGN: number;
  platformFeeNGN: number;
  status: 'PENDING_DEPOSIT' | 'FUNDS_HELD' | 'DISPUTED_LOCK' | 'RELEASED_TO_FARMER' | 'REFUNDED_TO_BUYER' | 'PARTIAL_SETTLEMENT';
  fundedAt?: string;
  releaseCondition: string;
  expectedReleaseDate: string;
  releasedAt?: string;
  settlementDetails?: {
    farmerPayoutNGN: number;
    transporterPayoutNGN: number;
    platformFeeNGN: number;
    buyerRefundNGN: number;
  };
}

export interface LogisticsCheckpoint {
  id: string;
  name: string;
  state: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  timestamp?: string;
  temperatureC?: number;
  notes?: string;
  lat?: number;
  lng?: number;
}

export interface TransportJob {
  id: string;
  orderId: string;
  transporterId?: string;
  transporterName?: string;
  transporterPhone?: string;
  transporterVehicle?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  gitPolicyNumber?: string;
  insuranceProvider?: string;
  frscFleetNumber?: string;
  pickupLocation: string;
  pickupState: string;
  pickupContact: string;
  deliveryLocation: string;
  deliveryState: string;
  deliveryContact: string;
  productDescription: string;
  totalWeightKg: number;
  agreedFreightFeeNGN: number;
  freightPriceNGN?: number;
  status: 'AVAILABLE_JOB' | 'ACCEPTED' | 'SCHEDULED' | 'PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  currentLocation?: string;
  currentCoordinates?: { lat: number; lng: number };
  originCoordinates?: { lat: number; lng: number };
  destinationCoordinates?: { lat: number; lng: number };
  temperatureCelsius?: number;
  targetTemperatureMin?: number;
  targetTemperatureMax?: number;
  humidityPercent?: number;
  cargoSealNumber?: string;
  sealStatus?: 'INTACT_LOCKED' | 'INSPECTED' | 'BROKEN_ALERT';
  speedKmH?: number;
  estimatedTimeOfArrival?: string;
  distanceTotalKm?: number;
  distanceCoveredKm?: number;
  temperatureHistory?: { time: string; tempC: number; location: string }[];
  checkpoints?: LogisticsCheckpoint[];
  waybillNumber?: string;
  deliveryWaybillNumber?: string;
  waybillPhoto?: string;
  pickupScheduledTime?: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  pickupProofPhoto?: string;
  deliveryProofPhoto?: string;
  driverNotes?: string;
}

export interface QualityConfirmationCheck {
  inspectedAt?: string;
  inspectorId?: string;
  confirmedQuantity: number;
  unit: string;
  quantityDiscrepancy: boolean;
  confirmedGrade: string;
  gradeMatch: boolean;
  moistureChecked: boolean;
  moisturePercent?: number;
  spoilagePercentage?: number;
  packagingCondition: 'GOOD' | 'FAIR' | 'DAMAGED';
  verdict: 'PENDING' | 'ACCEPTED' | 'REPORT_PROBLEM';
  inspectorNotes?: string;
  evidencePhotos: string[];
}

export interface DisputeRecord {
  id: string;
  orderId: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByRole: UserRole;
  defendantUserId: string;
  category: 'QUANTITY' | 'QUALITY' | 'DAMAGE' | 'WRONG_PRODUCT' | 'LATE_DELIVERY' | 'MISSING_GOODS' | 'PAYMENT' | 'LOGISTICS' | 'OTHER';
  description: string;
  evidencePhotos: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'WAITING_FOR_RESPONSE' | 'RESOLUTION_PROPOSED' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  resolutionProposal?: {
    type: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'REPLACEMENT_DELIVERY' | 'RELEASE_ESCROW';
    refundAmountNGN: number;
    farmerPayoutNGN: number;
    explanation: string;
    proposedBy: string;
  };
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface RatingRecord {
  id: string;
  orderId: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: UserRole;
  toUserId: string;
  toUserName: string;
  toRole: UserRole;
  overallScore: number; // 1 - 5
  qualityScore?: number;
  communicationScore?: number;
  reliabilityScore?: number;
  deliveryScore?: number;
  accuracyScore?: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string; // e.g. "FP-10245"
  requestId?: string;
  listingId?: string;
  buyerId: string;
  buyerName: string;
  buyerState: string;
  supplierId: string;
  supplierName: string;
  supplierState: string;
  product: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  pricePerUnit: number;
  produceTotalNGN: number;
  logisticsFeeNGN: number;
  platformFeeNGN: number;
  grandTotalNGN: number;
  pickupLocation: string;
  deliveryLocation: string;
  agreedDeliveryDate: string;
  status: OrderStatus;
  paymentMethod?: 'BANK_TRANSFER' | 'CARD' | 'FARMPOT_WALLET' | 'USSD';
  paymentStatus: 'UNPAID' | 'INITIATED' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
  escrow: EscrowState;
  logistics?: TransportJob;
  qualityConfirmation?: QualityConfirmationCheck;
  dispute?: DisputeRecord;
  buyerRating?: RatingRecord;
  farmerRating?: RatingRecord;
  transporterRating?: RatingRecord;
  contractId?: string;
  createdAt: string;
  updatedAt: string;
  historyTimeline: {
    state: OrderStatus;
    timestamp: string;
    description: string;
    actor: string;
  }[];
}

export interface Contract {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  product: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalValueNGN: number;
  qualityStandard: string;
  deliveryTerms: string;
  paymentSchedule: string;
  cancellationPolicy: string;
  disputeClause: string;
  signedByBuyer: boolean;
  signedByBuyerAt?: string;
  signedByFarmer: boolean;
  signedByFarmerAt?: string;
  status: 'DRAFT' | 'PENDING_ACCEPTANCE' | 'ACCEPTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  type: 'IMAGE' | 'DOCUMENT' | 'WAYBILL' | 'INVOICE';
  name: string;
  url: string;
  sizeMb?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  attachments?: MessageAttachment[];
  isSystemEvent?: boolean;
  systemEventType?: 'PAYMENT_RECEIVED' | 'TRANSPORTER_ASSIGNED' | 'ORDER_PICKED_UP' | 'DELIVERED' | 'DISPUTE_FILED' | 'OFFER_MADE';
  timestamp: string;
}

export interface Conversation {
  id: string;
  orderId?: string;
  requestId?: string;
  listingId?: string;
  title: string;
  participants: {
    userId: string;
    name: string;
    role: UserRole;
    avatar: string;
  }[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  channel: 'IN_APP' | 'WHATSAPP' | 'SMS';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'MATCH' | 'OFFER' | 'AGREEMENT' | 'PAYMENT' | 'ESCROW' | 'PICKUP' | 'TRANSPORT' | 'DELIVERY' | 'QUALITY' | 'DISPUTE' | 'SETTLEMENT' | 'VERIFICATION' | 'RATING';
  targetType: 'ORDER' | 'REQUEST' | 'LISTING' | 'VERIFICATION' | 'DISPUTE' | 'WALLET';
  targetId?: string;
  read: boolean;
  createdAt: string;
  channel: 'PUSH' | 'IN_APP' | 'WHATSAPP' | 'SMS' | 'EMAIL';
}

export interface MarketCommodityPrice {
  id: string;
  commodity: string;
  category: string;
  unit: string;
  nationalAvgPriceNGN: number;
  wholesalePriceNGN: number;
  retailPriceNGN: number;
  change7DaysPercent: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  regionalMarkets: {
    marketName: string;
    state: string;
    currentPriceNGN: number;
    supplyLevel: 'SURPLUS' | 'ADEQUATE' | 'SCARCE';
    demandLevel: 'HIGH' | 'MODERATE' | 'LOW';
  }[];
  priceHistory: { month: string; priceNGN: number }[];
  dataSource: string;
  lastUpdated: string;
}

export interface RecurringProcurementSchedule {
  id: string;
  buyerId: string;
  buyerName: string;
  product: string;
  quantityPerCycle: number;
  unit: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  durationMonths: number;
  allocatedSupplierId?: string;
  allocatedSupplierName?: string;
  lockedPricePerUnit: number;
  status: 'CREATED' | 'MATCHED' | 'CONFIRMED' | 'UPCOMING' | 'FULFILLED' | 'NEXT_CYCLE';
  nextDeliveryDate: string;
  cyclesCompleted: number;
  totalCycles: number;
}

export interface AggregatedOrderBatch {
  id: string;
  buyerId: string;
  product: string;
  totalRequiredQuantity: number;
  unit: string;
  targetQuality: string;
  aggregationPointLocation: string;
  state: string;
  contributors: {
    farmerId: string;
    farmerName: string;
    state: string;
    allocatedQuantity: number;
    pricePerUnit: number;
    pickupStatus: 'PENDING' | 'PICKED_UP' | 'AT_AGGREGATION_HUB';
    payoutStatus: 'HELD' | 'DISBURSED';
    payoutAmountNGN: number;
  }[];
  consolidatedTransportJobId?: string;
  status: 'ACCUMULATING' | 'READY_FOR_CONSOLIDATION' | 'IN_TRANSIT_TO_BUYER' | 'DELIVERED' | 'SETTLED';
}

export type AuthClientType = 'BUYER' | 'TRANSPORTER' | 'ADMIN' | 'FARMER';
export type AuthPageView = 'login' | 'signup' | 'exit';

export interface SessionSummary {
  userId: string;
  userName: string;
  businessName?: string;
  role: UserRole;
  clientType: AuthClientType;
  loginTime: string;
  logoutTime: string;
  durationMinutes: number;
  activeOrdersCount: number;
  escrowProtectedAmountNGN: number;
  walletBalanceNGN: number;
  exitReason?: string;
}

