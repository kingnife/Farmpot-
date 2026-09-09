import { Listing, Order, DemandRequest } from '../../types';

export type AssistantActionType =
  | 'NAVIGATE'
  | 'OPEN_DEMAND_MODAL'
  | 'OPEN_LISTING_MODAL'
  | 'OPEN_NEGOTIATION'
  | 'OPEN_INSPECTION'
  | 'OPEN_SUPPORT_CHAT'
  | 'OPEN_AUTH'
  | 'START_TOUR'
  | 'FILTER_MARKETPLACE'
  | 'CLARIFY_OPTION'
  | 'EXTERNAL_LINK';

export interface AssistantAction {
  id: string;
  label: string;
  type: AssistantActionType;
  primary?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning';
  icon?: string;
  payload?: {
    view?: string;
    listingId?: string;
    listing?: Listing;
    orderId?: string;
    order?: Order;
    clientType?: any;
    filterQuery?: string;
    filterCategory?: string;
    clarifyPrompt?: string;
    url?: string;
  };
}

export interface AssistantProductCardData {
  listing: Listing;
  highlightReason?: string;
  badge?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  products?: AssistantProductCardData[];
  actions?: AssistantAction[];
  quickReplies?: string[];
  isClarification?: boolean;
  category?: 'HOW_TO' | 'DISCOVERY' | 'RECOMMENDATION' | 'NAVIGATION' | 'PROCUREMENT' | 'SUPPORT' | 'OUT_OF_SCOPE' | 'GENERAL';
}
