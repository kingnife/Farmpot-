import React from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Truck,
  DollarSign,
  PackageCheck,
  Star,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GuidedTourModal: React.FC = () => {
  const {
    tourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    setCurrentUserById,
    setActiveView,
    setSelectedOrderId,
    orders,
  } = useApp();

  if (tourStep === null) return null;

  const tourSteps = [
    {
      title: 'FarmPot Complete Transaction Lifecycle',
      role: 'SYSTEM',
      persona: 'Platform Architecture Tour',
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      description:
        'Welcome to FarmPot. This interactive guide tests the full Nigerian agricultural supply chain lifecycle specified in the architectural requirements:',
      points: [
        '1. Identity & Verification (NIN & Farm Audit)',
        '2. Supply & Demand Matching (Weighted explainable algorithms)',
        '3. Structured Negotiation & Binding Contracts',
        '4. Escrow Vault Funding (Nigerian Naira ₦)',
        '5. Cold-chain Logistics & Waybill Tracking',
        '6. Destination Quality & Quantity Confirmation',
        '7. Multi-party Automated Escrow Settlement',
        '8. Trust Score Feedback Loop'
      ],
      actionLabel: 'Start Step 1: Buyer Demand Request',
      onAction: () => {
        setCurrentUserById('usr-buyer-1');
        setActiveView('requests');
        nextTourStep();
      }
    },
    {
      title: 'Step 1: Buyer Creates Demand Request',
      role: 'BUYER',
      persona: 'Amina Bello (Lagos Fresh Processing Ltd)',
      icon: <ShoppingBag className="w-6 h-6 text-emerald-600" />,
      description:
        'Amina Bello in Ikeja, Lagos needs 500 crates of Grade A Roma Tomatoes with a maximum budget of ₦3,700/crate. The request has been published to the Nigerian agricultural network.',
      points: [
        'Product: Roma Tomatoes (UC82B High-Brix)',
        'Volume: 500 Crates (12.5 metric tonnes)',
        'Destination: Ikeja Industrial Estate, Lagos',
        'Status: Matched with Northern suppliers'
      ],
      actionLabel: 'Proceed to Step 2: View Matches',
      onAction: () => {
        setActiveView('matching');
        nextTourStep();
      }
    },
    {
      title: 'Step 2: Explainable Deterministic Matching',
      role: 'BUYER',
      persona: 'Amina Bello (Lagos Fresh Processing Ltd)',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      description:
        'The matching engine evaluates quantity fit, quality grade, price ceiling, transit distance from Kaduna to Lagos, and farmer Trust Score without faking unexplainable black-box ML.',
      points: [
        '96% Match: Alhaji Musa Danladi (Zaria Agro, Kaduna)',
        '✓ Quantity available: 1,200 crates in stock',
        '✓ Grade A matched: High-Brix firm red Roma',
        '✓ Within budget: ₦3,500 vs ₦3,700 max budget',
        '✓ Trust Score: 94/100 with verified farm audit'
      ],
      actionLabel: 'Proceed to Step 3: Review Negotiation & Agreement',
      onAction: () => {
        setActiveView('orders');
        setSelectedOrderId('FP-10245');
        nextTourStep();
      }
    },
    {
      title: 'Step 3: Escrow Payment & Locking',
      role: 'BUYER',
      persona: 'Amina Bello (Lagos Fresh Processing Ltd)',
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      description:
        'Buyer deposits ₦1,985,000 NGN into the FarmPot Escrow Vault. Funds are securely locked before harvest loading to protect both parties.',
      points: [
        'Produce Amount: ₦1,750,000 NGN',
        'Cold-Chain Freight: ₦200,000 NGN',
        'Platform Escrow Fee (2%): ₦35,000 NGN',
        'Escrow State: FUNDS HELD (Safe custody until delivery)'
      ],
      actionLabel: 'Switch to Farmer: Prepare Produce & Dispatch',
      onAction: () => {
        setCurrentUserById('usr-farmer-1'); // Switch to Alhaji Musa
        setActiveView('orders');
        setSelectedOrderId('FP-10245');
        nextTourStep();
      }
    },
    {
      title: 'Step 4: Farmer Prepares Produce & Requests Transport',
      role: 'FARMER',
      persona: 'Alhaji Musa Danladi (Zaria Agro, Kaduna State)',
      icon: <Sprout className="w-6 h-6 text-amber-600" />,
      description:
        'Alhaji Musa sees the payment safely secured in FarmPot Escrow. He confirms 500 crates are crated and loaded at Zaria depot, and hands over to cold-chain transporter.',
      points: [
        'Confirmed Escrow Balance: ₦1,750,000 allocated',
        'Loading Depot: Km 12 Zaria-Kano Road, Kaduna',
        'Assigned Hauler: Emeka Okonkwo (Niger-Transit Logistics)',
        'Vehicle: 15-Tonne ThermoKing Refrigerated Truck'
      ],
      actionLabel: 'Switch to Transporter: Haulage & Delivery',
      onAction: () => {
        setCurrentUserById('usr-transporter-1'); // Switch to Emeka
        setActiveView('active-delivery');
        setSelectedOrderId('FP-10245');
        nextTourStep();
      }
    },
    {
      title: 'Step 5: Transporter Haulage & Waybill Delivery',
      role: 'TRANSPORTER',
      persona: 'Emeka Okonkwo (Niger-Transit Cold-Chain)',
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      description:
        'Transporter executes the 780km haulage from Zaria to Ikeja, Lagos with temperature maintained at 11°C, and uploads digital waybill proof upon arrival.',
      points: [
        'Waybill: WB-NGT-2025-0912',
        'Freight Value: ₦200,000 NGN',
        'Route: Zaria → Kaduna → Abuja Bypass → Lokoja → Ibadan → Lagos',
        'Status: Delivered at Ikeja Processing Facility'
      ],
      actionLabel: 'Switch to Buyer: Inspect Quality & Release Escrow',
      onAction: () => {
        setCurrentUserById('usr-buyer-1'); // Switch back to Amina
        setActiveView('orders');
        setSelectedOrderId('FP-10245');
        nextTourStep();
      }
    },
    {
      title: 'Step 6: Destination Quality Inspection & Settlement',
      role: 'BUYER',
      persona: 'Amina Bello (Lagos Fresh Processing Ltd)',
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      description:
        'Amina inspects the shipment: Grade A Brix confirmed, 500 crates accounted for with under 1.5% sorting variance. She accepts the produce, triggering automatic multi-party payout!',
      points: [
        '✓ Quantity: 500 crates verified',
        '✓ Grade: Grade A High-Brix accepted',
        '✓ Automated Settlement: ₦1,750,000 credited to Alhaji Musa',
        '✓ Logistics Settlement: ₦200,000 credited to Emeka Okonkwo'
      ],
      actionLabel: 'Step 7: Ratings & Trust Score Update',
      onAction: () => {
        setActiveView('orders');
        nextTourStep();
      }
    },
    {
      title: 'Step 7: Reputation Loop & Completed Transaction',
      role: 'SYSTEM',
      persona: 'FarmPot Trust & Surveillance Engine',
      icon: <Star className="w-6 h-6 text-amber-500" />,
      description:
        'Both buyer and supplier submit 5-star ratings with quality reviews. The deterministic Trust Scores update automatically, strengthening credit and future match ranking across Nigeria.',
      points: [
        'Farmer Trust Score: 94 → 95 / 100 (99% completion rate)',
        'Buyer Trust Score: 96 / 100',
        'Transporter Delivery Reliability: 98%',
        'Complete transactional loop achieved!'
      ],
      actionLabel: 'Complete Tour & Explore Freely',
      onAction: () => {
        endTour();
      }
    }
  ];

  const currentStepData = tourSteps[tourStep] || tourSteps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Stepper Banner */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Guided Test Flow • Step {tourStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button
            type="button"
            onClick={endTour}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 shrink-0">
              {currentStepData.icon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold mb-1">
                <span>{currentStepData.persona}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{currentStepData.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{currentStepData.description}</p>
            </div>
          </div>

          {/* Key Checkpoints Box */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Verification & Workflow Points:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentStepData.points.map((pt, idx) => (
                <li key={idx} className="flex items-baseline gap-2">
                  <span className="text-emerald-600 font-bold text-xs">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={prevTourStep}
            disabled={tourStep === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold ${
              tourStep === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-200/70 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={endTour}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 cursor-pointer"
            >
              Skip Tour
            </button>
            <button
              type="button"
              onClick={currentStepData.onAction}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 hover:shadow transition-all cursor-pointer"
            >
              <span>{currentStepData.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
