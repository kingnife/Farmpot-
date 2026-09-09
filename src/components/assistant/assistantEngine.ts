import { Listing, Order, DemandRequest, User, MarketCommodityPrice } from '../../types';
import { AssistantMessage, AssistantAction, AssistantProductCardData } from './types';

export interface AssistantEngineContext {
  listings: Listing[];
  orders: Order[];
  demandRequests: DemandRequest[];
  currentUser: User;
  marketPrices: MarketCommodityPrice[];
  conversationsCount: number;
}

export const INITIAL_ASSISTANT_MESSAGE: AssistantMessage = {
  id: 'msg-initial',
  sender: 'assistant',
  text: `Hi! 👋 I'm your FarmPot Assistant.\nI can help you find products, understand FarmPot, manage your orders, and answer questions about using the platform.\nWhat can I help you with?`,
  timestamp: new Date().toISOString(),
  quickReplies: [
    '🔎 Find a product',
    '🛒 Manage my order',
    '🌱 Get product recommendations',
    '📦 Procurement',
    '❓ How FarmPot works'
  ],
  actions: [
    {
      id: 'act-init-browse',
      label: 'Explore Marketplace',
      type: 'NAVIGATE',
      variant: 'primary',
      payload: { view: 'marketplace' }
    },
    {
      id: 'act-init-procurement',
      label: 'Start Procurement Request',
      type: 'OPEN_DEMAND_MODAL',
      variant: 'secondary'
    },
    {
      id: 'act-init-tour',
      label: 'Take Platform Tour',
      type: 'START_TOUR',
      variant: 'outline'
    }
  ],
  category: 'GENERAL'
};

export const QUICK_START_OPTIONS = [
  { id: 'opt-find', label: '🔎 Find a product', query: 'Find a product' },
  { id: 'opt-order', label: '🛒 Manage my order', query: 'Manage my order' },
  { id: 'opt-rec', label: '🌱 Get product recommendations', query: 'Get product recommendations' },
  { id: 'opt-proc', label: '📦 Procurement', query: 'How does procurement work?' },
  { id: 'opt-how', label: '❓ How FarmPot works', query: 'How does FarmPot work?' },
];

export function processAssistantQuery(
  rawQuery: string,
  context: AssistantEngineContext
): AssistantMessage {
  const query = rawQuery.trim().toLowerCase();
  const id = `msg-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // -------------------------------------------------------------
  // 1. OUT OF SCOPE CHECK (Weather, Sports, Non-farm trivia, etc.)
  // -------------------------------------------------------------
  const outOfScopePatterns = [
    /weather/i,
    /rain today/i,
    /temperature in london/i,
    /football|premier league|chelsea|arsenal|manchester/i,
    /who is the president of/i,
    /movie|cinema|hollywood/i,
    /crypto|bitcoin|ethereum|forex trading/i,
    /write a poem|write code|python script|javascript code/i,
    /joke|tell me a joke/i,
    /recipe for jollof|how to cook/i
  ];

  const isOutOfScope = outOfScopePatterns.some(pat => pat.test(query));
  if (isOutOfScope) {
    return {
      id,
      sender: 'assistant',
      text: `I am the **FarmPot Assistant**, specialized strictly in Nigerian agricultural marketplace trading, produce listings, B2B procurement, escrow payments, and order tracking on FarmPot.\n\nI don't have information on general topics outside FarmPot. Can I help you discover verified produce, check order status, or start a bulk procurement request instead?`,
      timestamp,
      category: 'OUT_OF_SCOPE',
      quickReplies: [
        '🔎 Find a product',
        '🛒 Manage my order',
        '📦 Procurement',
        '❓ How FarmPot works'
      ],
      actions: [
        {
          id: 'act-oos-browse',
          label: 'Browse Produce',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'marketplace' }
        },
        {
          id: 'act-oos-procurement',
          label: 'Start Procurement',
          type: 'OPEN_DEMAND_MODAL',
          variant: 'secondary'
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 2. NAVIGATION SHORTCUTS
  // -------------------------------------------------------------
  // "Where is my cart?", "Take me to my cart", "Show cart"
  if (query.includes('cart') || query.includes('basket')) {
    const activeOrders = context.orders.filter(
      o => !['COMPLETED', 'CANCELLED', 'REFUNDED'].includes(o.status)
    );
    const inTransit = context.orders.filter(o => o.status === 'IN_TRANSIT').length;
    const pendingPayment = context.orders.filter(o => o.status === 'PAYMENT_PENDING').length;

    return {
      id,
      sender: 'assistant',
      text: `FarmPot operates as a wholesale B2B exchange with direct escrow transactions rather than a standard consumer retail cart.\n\nYour active transactions are managed in your **Orders** pipeline. You currently have **${activeOrders.length} active orders** (${inTransit} in transit, ${pendingPayment} awaiting escrow funding) and **${context.demandRequests.length} procurement requests**.`,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-nav-orders',
          label: `Open My Orders (${activeOrders.length})`,
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'orders' }
        },
        {
          id: 'act-nav-browse',
          label: 'Browse Produce Marketplace',
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'marketplace' }
        }
      ],
      quickReplies: ['Track my orders', 'Start procurement request', 'Open my wallet']
    };
  }

  // "Open my orders", "Show orders", "Order status", "My orders"
  if (
    query === 'manage my order' ||
    query.includes('my order') ||
    query.includes('open orders') ||
    query.includes('track my order') ||
    query.includes('order status') ||
    (query.includes('track') && query.includes('order'))
  ) {
    const totalOrders = context.orders.length;
    const latestOrder = context.orders[0];
    const inTransit = context.orders.filter(o => o.status === 'IN_TRANSIT').length;

    let statusDescription = `You have **${totalOrders} orders on file** in your FarmPot profile.`;
    if (latestOrder) {
      const orderTotal = latestOrder.grandTotalNGN || latestOrder.produceTotalNGN || 0;
      statusDescription += `\n\n📌 **Latest Order (#${latestOrder.id.toUpperCase()})**: ${latestOrder.product} (${latestOrder.quantity} ${latestOrder.unit})\nStatus: **${latestOrder.status.replace(/_/g, ' ')}** · Amount: **₦${orderTotal.toLocaleString()}**`;
      if (inTransit > 0) {
        statusDescription += `\n🚚 **${inTransit} shipment currently in transit** with live GPS/checkpoint monitoring.`;
      }
    } else {
      statusDescription += `\nYou do not have any orders yet. Browse available produce batches or create a demand request to place your first order.`;
    }

    return {
      id,
      sender: 'assistant',
      text: statusDescription,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-orders-view',
          label: 'Open Orders Manager',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'orders' }
        },
        {
          id: 'act-logistics-view',
          label: 'Track in Logistics Hub',
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'logistics' }
        }
      ],
      quickReplies: ['Where is my cart?', 'How does escrow work?', 'Browse marketplace']
    };
  }

  // "Show wishlist" / "Wishlist" / "Favorites"
  if (query.includes('wishlist') || query.includes('favorite') || query.includes('saved')) {
    const matchedCount = context.demandRequests.filter(r => r.matchedListingIds && r.matchedListingIds.length > 0).length;
    return {
      id,
      sender: 'assistant',
      text: `Your saved procurement pipeline and verified matches are accessible in the **Procurement Matching Engine**. You currently have **${matchedCount} requests matched with pre-vetted farm suppliers**.`,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-matching-view',
          label: 'Open Procurement Matches',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'matching' }
        },
        {
          id: 'act-marketplace-view',
          label: 'Browse Marketplace',
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'marketplace' }
        }
      ]
    };
  }

  // "Go to marketplace" / "Open marketplace"
  if (
    query === 'go to the marketplace' ||
    query === 'open marketplace' ||
    query === 'marketplace' ||
    query === 'browse produce' ||
    query === 'browse marketplace'
  ) {
    const publishedCount = context.listings.filter(l => l.status === 'PUBLISHED').length;
    return {
      id,
      sender: 'assistant',
      text: `The FarmPot Marketplace is active with **${publishedCount} verified harvest batches** ready for direct purchase or negotiation across Nigerian agricultural hubs.`,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-goto-mkt',
          label: `Go to Marketplace (${publishedCount} Listings)`,
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'marketplace' }
        }
      ],
      quickReplies: ['I need tomatoes', 'Where can I find yam?', 'Which fertilizer should I buy?']
    };
  }

  // "Open wallet" / "My balance" / "Escrow"
  if (query.includes('wallet') || query.includes('my balance') || query.includes('how much in escrow')) {
    const wallet = context.currentUser.walletBalance || 0;
    const escrow = context.currentUser.escrowBalance || 0;
    return {
      id,
      sender: 'assistant',
      text: `💰 **FarmPot Escrow & Wallet Status**:\n- Available Wallet Balance: **₦${wallet.toLocaleString()}**\n- Protected Escrow Balance: **₦${escrow.toLocaleString()}**\n\nAll payments are held securely in the FarmPot Escrow Vault until physical delivery and quality confirmation.`,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-wallet-view',
          label: 'Open Wallet & Escrow Vault',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'wallet' }
        }
      ],
      quickReplies: ['How does escrow work?', 'Manage my order', 'Open orders']
    };
  }

  // "Messages" / "Chat"
  if (query.includes('message') || query === 'chat' || query.includes('inbox')) {
    return {
      id,
      sender: 'assistant',
      text: `You have **${context.conversationsCount} active conversations** with suppliers, logistics providers, and platform support.`,
      timestamp,
      category: 'NAVIGATION',
      actions: [
        {
          id: 'act-messages-view',
          label: 'Open Messages',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'messages' }
        }
      ]
    };
  }

  // -------------------------------------------------------------
  // 3. ACCOUNT & SUPPORT ISSUES
  // -------------------------------------------------------------
  // "How do I change my password?", "Edit profile", "Settings"
  if (
    query.includes('password') ||
    query.includes('edit profile') ||
    query.includes('change name') ||
    query.includes('settings') ||
    query.includes('account details')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `You can update your personal contact info, business profile, delivery address, and bank settlement details in your **Account Settings**.\n\n1. Open your Profile & Settings screen.\n2. Update your business information or banking accounts.\n3. Click "Save Profile Changes".`,
      timestamp,
      category: 'SUPPORT',
      actions: [
        {
          id: 'act-profile-view',
          label: 'Open Profile & Settings',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'profile' }
        }
      ],
      quickReplies: ['How do I verify my account?', 'How does escrow work?']
    };
  }

  // "How do I verify my account?", "KYC", "NIN", "CAC"
  if (query.includes('verify') || query.includes('kyc') || query.includes('nin') || query.includes('cac')) {
    const kycStatus = context.currentUser.verification?.status || 'PENDING';
    return {
      id,
      sender: 'assistant',
      text: `Your current verification status is **${kycStatus}**.\n\nFarmPot requires identity verification (NIN for individuals, CAC for corporate entities) to maintain high trust scores and enable high-volume escrow trades across Nigerian agricultural corridors.`,
      timestamp,
      category: 'SUPPORT',
      actions: [
        {
          id: 'act-kyc-view',
          label: 'Open KYC Verification',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'kyc' }
        }
      ],
      quickReplies: ['Open profile settings', 'How does escrow work?']
    };
  }

  // Human intervention required: "Payment didn't go through", "Payment failed", "Can't find my order", "Contact support", "Dispute", "Fraud"
  if (
    query.includes('payment didn\'t go through') ||
    query.includes('payment failed') ||
    query.includes('failed payment') ||
    query.includes('can\'t find my order') ||
    query.includes('lost order') ||
    query.includes('contact support') ||
    query.includes('talk to human') ||
    query.includes('support desk') ||
    query.includes('dispute') ||
    query.includes('fraud') ||
    query.includes('refund issue')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `I understand this requires human intervention. Issues involving payment investigations, missing records, or escrow disputes must be handled directly by our **FarmPot Escrow Operations & Support Desk** to ensure transaction security and formal logging.\n\nPlease connect directly with our support team using the actions below:`,
      timestamp,
      category: 'SUPPORT',
      actions: [
        {
          id: 'act-support-chat',
          label: 'Open Official Support Chat',
          type: 'OPEN_SUPPORT_CHAT',
          variant: 'primary'
        },
        {
          id: 'act-support-disputes',
          label: 'Open Dispute Resolution Desk',
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'admin-disputes' }
        },
        {
          id: 'act-support-wa',
          label: 'WhatsApp Support Desk (+234 803 111 2233)',
          type: 'EXTERNAL_LINK',
          variant: 'outline',
          payload: { url: 'https://wa.me/2348031112233?text=Hello%20FarmPot%20Support,%20I%20need%20assistance' }
        }
      ],
      quickReplies: ['Open my wallet', 'Open my orders', 'How does escrow work?']
    };
  }

  // -------------------------------------------------------------
  // 4. PROCUREMENT ASSISTANCE
  // -------------------------------------------------------------
  // "Procurement", "How does procurement work?", "Submit a request", "Supplier finding"
  if (
    query === 'procurement' ||
    query.includes('how does procurement work') ||
    query.includes('what is procurement') ||
    query.includes('submit a request') ||
    query.includes('bulk sourcing') ||
    query.includes('supplier-finding') ||
    query.includes('procurement request')
  ) {
    const totalRequests = context.demandRequests.length;
    return {
      id,
      sender: 'assistant',
      text: `**FarmPot Bulk Procurement** allows commercial processors, retail chains, and food aggregators to source volume agricultural commodities transparently:\n\n1. **Submit Request**: Specify commodity, required volume (e.g. 20 Tonnes), quality grade (Grade A / Export), and delivery target.\n2. **Deterministic Matching**: FarmPot screens verified farmers and cooperatives matching your tonnage, location, and required dates.\n3. **Structured Negotiation**: Review offers, counter prices, and agree on logistics.\n4. **Escrow Safeguard**: Pay into the Nigerian Escrow Vault. Funds stay protected until delivery inspection.\n\nYou currently have **${totalRequests} active procurement requests**.`,
      timestamp,
      category: 'PROCUREMENT',
      actions: [
        {
          id: 'act-proc-create',
          label: 'Start a Procurement Request',
          type: 'OPEN_DEMAND_MODAL',
          variant: 'primary'
        },
        {
          id: 'act-proc-view',
          label: `View Procurement Pipeline (${totalRequests})`,
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'procurement' }
        },
        {
          id: 'act-proc-matches',
          label: 'Check Supplier Matches',
          type: 'NAVIGATE',
          variant: 'outline',
          payload: { view: 'matching' }
        }
      ],
      quickReplies: ['I need tomatoes', 'Where can I find yam?', 'How does escrow work?']
    };
  }

  // -------------------------------------------------------------
  // 5. PLATFORM HOW-TO QUESTIONS
  // -------------------------------------------------------------
  // "How do I buy a product?" / "How to buy" / "How do I place an order?"
  if (
    query.includes('how do i buy') ||
    query.includes('how to buy') ||
    query.includes('how to place an order') ||
    query.includes('how do i place an order') ||
    query.includes('how to order')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `Buying produce on FarmPot is straightforward and secured by Nigerian Escrow:\n\n1. **Browse verified listings** in the Marketplace or search for specific commodities.\n2. **Click "Make Offer / Buy"** to initiate a structured trade negotiation on price and delivery terms.\n3. **Fund the Escrow Vault**: Pay via Bank Transfer or Card. Funds are held safely.\n4. **Receive & Inspect**: Once the transporter delivers, inspect the quality. When satisfied, release funds to the farmer.`,
      timestamp,
      category: 'HOW_TO',
      actions: [
        {
          id: 'act-howto-browse',
          label: 'Browse Produce Marketplace',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'marketplace' }
        },
        {
          id: 'act-howto-procure',
          label: 'Post a Bulk Procurement Request',
          type: 'OPEN_DEMAND_MODAL',
          variant: 'secondary'
        }
      ],
      quickReplies: ['Where is my cart?', 'How does escrow work?', 'Manage my order']
    };
  }

  // "How do I become a seller?" / "How to sell" / "Become a farmer"
  if (
    query.includes('become a seller') ||
    query.includes('how do i sell') ||
    query.includes('how to sell') ||
    query.includes('register as farmer') ||
    query.includes('seller signup')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `To sell produce or agricultural inputs on FarmPot:\n\n1. **Register or Switch to Farmer / Aggregator profile**.\n2. **Verify your identity**: Provide your farm location, cooperative info, and NIN/CAC for verified seller badge.\n3. **Create Harvest Listings**: Post your batch details with photos, harvest date, quality grade, and minimum order quantity.\n4. **Get Guaranteed Payment**: Once buyers accept and receive goods, funds are released directly to your Nigerian bank account.`,
      timestamp,
      category: 'HOW_TO',
      actions: [
        {
          id: 'act-seller-auth',
          label: 'Start Seller Signup (Client Portals)',
          type: 'OPEN_AUTH',
          variant: 'primary',
          payload: { clientType: 'FARMER' }
        },
        {
          id: 'act-seller-listing',
          label: 'Create a Harvest Listing',
          type: 'OPEN_LISTING_MODAL',
          variant: 'secondary'
        }
      ],
      quickReplies: ['How does escrow work?', 'How does FarmPot work?', 'Find a product']
    };
  }

  // "How does escrow work?" / "Escrow"
  if (
    query.includes('how does escrow work') ||
    query.includes('what is escrow') ||
    query.includes('escrow guarantee') ||
    query === 'escrow'
  ) {
    return {
      id,
      sender: 'assistant',
      text: `**FarmPot Nigeria Escrow Vault Protection**:\n\n- 🛡️ **Zero Upfront Loss**: Buyer funds are deposited into an audited escrow trust account before loading.\n- 🚜 **Farmer Reassurance**: Farmers know funds are 100% verified before harvesting or packing.\n- 🚚 **Tracked Logistics**: Transporters only haul validated orders with FRSC/GPS checkpoints.\n- 🔍 **Quality Confirmation**: Payment is only released to the supplier after the buyer confirms produce specifications at destination.`,
      timestamp,
      category: 'HOW_TO',
      actions: [
        {
          id: 'act-escrow-wallet',
          label: 'View Escrow Vault & Payments',
          type: 'NAVIGATE',
          variant: 'primary',
          payload: { view: 'wallet' }
        },
        {
          id: 'act-escrow-tour',
          label: 'Launch Guided Trade Tour',
          type: 'START_TOUR',
          variant: 'secondary'
        }
      ],
      quickReplies: ['How do I buy a product?', 'Start a procurement request', 'Manage my order']
    };
  }

  // "How FarmPot works"
  if (
    query === 'how farmpot works' ||
    query.includes('how does farmpot work') ||
    query.includes('about farmpot')
  ) {
    return {
      id,
      sender: 'assistant',
      text: `**FarmPot is Nigeria's Leading B2B Agricultural Commodity & Procurement Exchange**.\n\nWe connect verified commercial buyers, food processors, and supermarkets with pre-vetted farmers and cooperatives across 36 states.\n\n- 📦 **Direct Sourcing**: Eliminate middleman markups.\n- ⚖️ **Deterministic Matching**: AI matches specifications, quality grade, and distance.\n- 🔒 **Escrow Guarantee**: Risk-free transactions in Nigerian Naira (₦).\n- 🚛 **Integrated Freight**: Cold-chain and haulage dispatch across transit corridors.`,
      timestamp,
      category: 'HOW_TO',
      actions: [
        {
          id: 'act-works-tour',
          label: 'Take Platform Walkthrough',
          type: 'START_TOUR',
          variant: 'primary'
        },
        {
          id: 'act-works-browse',
          label: 'Explore Produce Marketplace',
          type: 'NAVIGATE',
          variant: 'secondary',
          payload: { view: 'marketplace' }
        }
      ],
      quickReplies: ['🔎 Find a product', '📦 Procurement', '🌱 Get product recommendations']
    };
  }

  // -------------------------------------------------------------
  // 6. PRODUCT RECOMMENDATIONS & AMBIGUOUS CLARIFICATION
  // -------------------------------------------------------------
  // Check if query is asking for recommendations
  const isRecommendationQuery =
    query.includes('recommend') ||
    query.includes('which fertilizer') ||
    query.includes('what should i use') ||
    query.includes('affordable') ||
    query.includes('best product') ||
    query.includes('best for planting') ||
    query.includes('planting season') ||
    query.includes('what to buy') ||
    query === 'get product recommendations';

  if (isRecommendationQuery) {
    // Check if underspecified (e.g. "I need something affordable" or "What should I use for my farm?" with no crop/category)
    const mentionsFertilizer = query.includes('fertilizer') || query.includes('planting') || query.includes('soil');
    const mentionsCrop = query.includes('tomato') || query.includes('yam') || query.includes('maize') || query.includes('pepper') || query.includes('vegetable') || query.includes('grain') || query.includes('tuber');
    const mentionsBudget = query.includes('under') || query.includes('cheap') || query.includes('affordable');

    if (!mentionsFertilizer && !mentionsCrop && (query === 'get product recommendations' || query === 'what should i use for my farm?' || query === 'i need something affordable' || query.includes('recommend'))) {
      // Underspecified request -> Ask a clarifying question first!
      return {
        id,
        sender: 'assistant',
        text: `To give you the most accurate recommendation from our verified catalog, what type of produce or farming inputs are you looking for, or what is your target budget?`,
        timestamp,
        isClarification: true,
        category: 'RECOMMENDATION',
        quickReplies: [
          'Vegetables (Tomatoes, Peppers)',
          'Grains (Maize, Soybeans)',
          'Tubers (Yam, Cassava)',
          'Fertilizer & Planting Inputs',
          'Under ₦25,000 / unit'
        ],
        actions: [
          {
            id: 'act-clarify-veg',
            label: 'Vegetables (Tomatoes & Peppers)',
            type: 'CLARIFY_OPTION',
            variant: 'outline',
            payload: { clarifyPrompt: 'Show me recommended vegetables' }
          },
          {
            id: 'act-clarify-fert',
            label: 'Fertilizer & Planting Season',
            type: 'CLARIFY_OPTION',
            variant: 'outline',
            payload: { clarifyPrompt: 'Which fertilizer should I buy?' }
          },
          {
            id: 'act-clarify-tubers',
            label: 'Tubers (Yam & Cassava)',
            type: 'CLARIFY_OPTION',
            variant: 'outline',
            payload: { clarifyPrompt: 'Show me recommended tubers like yam' }
          }
        ]
      };
    }

    // Handle Fertilizer recommendation
    if (mentionsFertilizer) {
      const fertilizerListings = context.listings.filter(
        l => l.product.toLowerCase().includes('fertilizer') || l.description.toLowerCase().includes('fertilizer')
      );
      const matched = fertilizerListings.length > 0 ? fertilizerListings : context.listings.slice(0, 1);

      const cards: AssistantProductCardData[] = matched.map((item, idx) => ({
        listing: item,
        badge: idx === 0 ? 'Top Pick for Planting' : 'Recommended',
        highlightReason: 'Balanced 15-15-15 formula provides essential Nitrogen, Phosphorus, and Potassium for high germination and rapid root establishment.'
      }));

      return {
        id,
        sender: 'assistant',
        text: `Here is our top-ranked fertilizer recommendation based on Nigerian planting season standards:\n\n⭐ **#1 Indorama NPK 15-15-15 Granular Fertilizer** (50kg Bag)\n- **Reason**: Balanced NPK ratio suited for early soil nourishment across maize, vegetables, and tubers with verified lab purity in Kaduna.`,
        timestamp,
        category: 'RECOMMENDATION',
        products: cards,
        actions: [
          {
            id: 'act-rec-fert-neg',
            label: 'Negotiate Deal / Buy Now',
            type: 'OPEN_NEGOTIATION',
            variant: 'primary',
            payload: { listing: matched[0], listingId: matched[0]?.id }
          },
          {
            id: 'act-rec-mkt',
            label: 'View All Input Listings',
            type: 'NAVIGATE',
            variant: 'secondary',
            payload: { view: 'marketplace' }
          }
        ],
        quickReplies: ['I need farming equipment', 'Where can I find yam?', 'How does escrow work?']
      };
    }

    // Handle Affordable or General Produce recommendations
    if (mentionsBudget || query.includes('vegetable') || query.includes('grain') || query.includes('tuber')) {
      const sorted = [...context.listings]
        .filter(l => l.status === 'PUBLISHED')
        .sort((a, b) => a.pricePerUnit - b.pricePerUnit);

      const topPicks = sorted.slice(0, 2);
      const cards: AssistantProductCardData[] = topPicks.map((item, idx) => ({
        listing: item,
        badge: idx === 0 ? 'Best Value Pick' : 'High Demand Crop',
        highlightReason: idx === 0
          ? `Lowest unit cost (₦${item.pricePerUnit.toLocaleString()} / ${item.unit}) with high processing yield and active logistics.`
          : `Strong resale margin in urban distribution centers with minimal storage loss.`
      }));

      return {
        id,
        sender: 'assistant',
        text: `Here is a ranked set of top-value produce recommendations from our live verified catalog:\n\n1. **${topPicks[0]?.product}** (₦${topPicks[0]?.pricePerUnit.toLocaleString()} / ${topPicks[0]?.unit}) — *Lowest unit cost with high processing yield in ${topPicks[0]?.state}.*\n2. **${topPicks[1]?.product}** (₦${topPicks[1]?.pricePerUnit.toLocaleString()} / ${topPicks[1]?.unit}) — *High retail market turnover with established cold-chain dispatch.*`,
        timestamp,
        category: 'RECOMMENDATION',
        products: cards,
        actions: [
          {
            id: 'act-rec-browse',
            label: 'View in Marketplace',
            type: 'NAVIGATE',
            variant: 'primary',
            payload: { view: 'marketplace' }
          },
          {
            id: 'act-rec-procure',
            label: 'Post Custom Demand Request',
            type: 'OPEN_DEMAND_MODAL',
            variant: 'secondary'
          }
        ],
        quickReplies: ['I need tomatoes', 'Where can I find yam?', 'Manage my order']
      };
    }
  }

  // -------------------------------------------------------------
  // 7. PRODUCT DISCOVERY (Search Live Catalog)
  // -------------------------------------------------------------
  // Handle queries like: "I need tomatoes", "Where can I find yam?", "Show me vegetables", "I need farming equipment", "What products are available near me?"
  const isSearchQuery =
    query === 'find a product' ||
    query.includes('i need') ||
    query.includes('find') ||
    query.includes('where can i find') ||
    query.includes('show me') ||
    query.includes('what products are available') ||
    query.includes('available near me') ||
    query.includes('do you have') ||
    query.includes('looking for') ||
    query.includes('tomato') ||
    query.includes('yam') ||
    query.includes('maize') ||
    query.includes('pepper') ||
    query.includes('cassava') ||
    query.includes('soybean') ||
    query.includes('onion') ||
    query.includes('fertilizer') ||
    query.includes('equipment') ||
    query.includes('sprayer');

  if (isSearchQuery) {
    // Extract key keywords
    let keyword = query
      .replace(/find a product/g, '')
      .replace(/where can i find/g, '')
      .replace(/what products are available near me/g, '')
      .replace(/what products are available/g, '')
      .replace(/show me/g, '')
      .replace(/i need/g, '')
      .replace(/do you have/g, '')
      .replace(/looking for/g, '')
      .replace(/products near me/g, '')
      .trim();

    // Map common terms to synonyms
    let targetCategory = '';
    if (query.includes('vegetable')) targetCategory = 'VEGETABLES';
    if (query.includes('grain')) targetCategory = 'GRAINS';
    if (query.includes('tuber')) targetCategory = 'TUBERS';
    if (query.includes('oil seed')) targetCategory = 'OIL_SEEDS';

    let matchedListings = context.listings.filter(item => {
      if (item.status !== 'PUBLISHED') return false;

      const pName = (item.product || '').toLowerCase();
      const pVariety = (item.variety || '').toLowerCase();
      const pDesc = (item.description || '').toLowerCase();
      const pState = (item.state || '').toLowerCase();
      const pCat = (item.category || '').toLowerCase();

      if (targetCategory && item.category === targetCategory) return true;

      if (!keyword) return true;

      // Check keyword pieces
      const words = keyword.split(' ').filter(w => w.length > 2);
      if (words.length === 0) return true;

      return words.some(
        w => pName.includes(w) || pVariety.includes(w) || pDesc.includes(w) || pState.includes(w) || pCat.includes(w)
      );
    });

    // If query is specifically for yam and matchedListings is empty, search by 'yam'
    if (query.includes('yam') && matchedListings.length === 0) {
      matchedListings = context.listings.filter(l => l.product.toLowerCase().includes('yam'));
    }
    // If query is specifically for tomato
    if (query.includes('tomato') && matchedListings.length === 0) {
      matchedListings = context.listings.filter(l => l.product.toLowerCase().includes('tomato'));
    }
    // If query is specifically for equipment
    if ((query.includes('equipment') || query.includes('sprayer')) && matchedListings.length === 0) {
      matchedListings = context.listings.filter(l => l.product.toLowerCase().includes('sprayer') || l.product.toLowerCase().includes('equipment'));
    }

    if (matchedListings.length > 0) {
      const topItems = matchedListings.slice(0, 3);
      const cards: AssistantProductCardData[] = topItems.map(item => ({
        listing: item,
        badge: item.qualityGrade.replace('_', ' ')
      }));

      const displayCategory = targetCategory ? `${targetCategory.toLowerCase()} ` : '';
      const displayKeyword = keyword ? `for "${keyword}"` : '';

      return {
        id,
        sender: 'assistant',
        text: `I found **${matchedListings.length} verified ${displayCategory}product(s)** ${displayKeyword} in the live FarmPot catalog. Each batch is inspected and backed by the Nigeria Escrow Vault:`,
        timestamp,
        category: 'DISCOVERY',
        products: cards,
        actions: [
          {
            id: 'act-disc-viewall',
            label: `View All ${matchedListings.length} Results in Marketplace`,
            type: 'NAVIGATE',
            variant: 'primary',
            payload: { view: 'marketplace', filterQuery: keyword }
          },
          {
            id: 'act-disc-procure',
            label: 'Post a Bulk Procurement Request',
            type: 'OPEN_DEMAND_MODAL',
            variant: 'secondary'
          }
        ],
        quickReplies: ['Where can I find yam?', 'Which fertilizer should I buy?', 'Manage my order']
      };
    } else {
      // Check physical commodity prices for Nigerian benchmark
      const benchmark = context.marketPrices.find(m =>
        keyword && m.commodity.toLowerCase().includes(keyword)
      );

      let text = `We don't currently have active published listings matching **"${keyword || rawQuery}"** in the instant marketplace stock.`;
      if (benchmark) {
        text += `\n\n📊 **Physical Nigerian Market Index**: ${benchmark.commodity} national average is currently **₦${benchmark.nationalAvgPriceNGN.toLocaleString()} / ${benchmark.unit}** (${benchmark.trend === 'UP' ? 'Trending Up 📈' : 'Trending Down 📉'}).`;
      }
      text += `\n\nYou can post a **Bulk Procurement Request** and FarmPot will broadcast your requirements to our verified farmer cooperatives across 36 states to fulfill.`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        category: 'DISCOVERY',
        actions: [
          {
            id: 'act-no-match-demand',
            label: `Start Procurement Request for ${keyword || 'Commodity'}`,
            type: 'OPEN_DEMAND_MODAL',
            variant: 'primary'
          },
          {
            id: 'act-no-match-browse',
            label: 'Browse All Available Produce',
            type: 'NAVIGATE',
            variant: 'secondary',
            payload: { view: 'marketplace' }
          }
        ],
        quickReplies: ['I need tomatoes', 'Where can I find yam?', 'How does procurement work?']
      };
    }
  }

  // -------------------------------------------------------------
  // 8. FALLBACK (DEFAULT ENGAGEMENT WITH ACTIONS)
  // -------------------------------------------------------------
  return {
    id,
    sender: 'assistant',
    text: `I'm your **FarmPot Assistant**. I can help you search produce listings, manage your orders, submit procurement requests, or understand platform escrow and verification.\n\nHere are quick actions you can take right now:`,
    timestamp,
    category: 'GENERAL',
    quickReplies: [
      '🔎 Find a product',
      '🛒 Manage my order',
      '🌱 Get product recommendations',
      '📦 Procurement',
      '❓ How FarmPot works'
    ],
    actions: [
      {
        id: 'act-fallback-browse',
        label: 'Browse Produce Marketplace',
        type: 'NAVIGATE',
        variant: 'primary',
        payload: { view: 'marketplace' }
      },
      {
        id: 'act-fallback-orders',
        label: 'Check My Orders',
        type: 'NAVIGATE',
        variant: 'secondary',
        payload: { view: 'orders' }
      },
      {
        id: 'act-fallback-procure',
        label: 'Start Procurement Request',
        type: 'OPEN_DEMAND_MODAL',
        variant: 'outline'
      }
    ]
  };
}
