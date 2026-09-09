import React from 'react';
import { MapPin, ShieldCheck, Sparkles, ArrowRight, DollarSign } from 'lucide-react';
import { AssistantProductCardData } from './types';
import { Listing } from '../../types';

interface ProductCardInChatProps {
  cardData: AssistantProductCardData;
  onNegotiate: (listing: Listing) => void;
  onViewInMarketplace: (listing: Listing) => void;
}

export const ProductCardInChat: React.FC<ProductCardInChatProps> = ({
  cardData,
  onNegotiate,
  onViewInMarketplace,
}) => {
  const { listing, highlightReason, badge } = cardData;

  const photo = (listing.photos && listing.photos.length > 0)
    ? listing.photos[0]
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

  const formattedUnit = listing.unit.replace(/_/g, ' ');

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs hover:border-[#334E1B]/50 transition-all text-left">
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* Product Image */}
        <div className="relative w-full sm:w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60">
          <img
            src={photo}
            alt={listing.product}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#334E1B] text-white shadow-xs">
            {listing.qualityGrade.replace('_', ' ')}
          </span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#1F1F1F] leading-tight line-clamp-1">
                  {listing.product}
                </h4>
                {listing.variety && (
                  <p className="text-[11px] text-[#777777] line-clamp-1">
                    {listing.variety}
                  </p>
                )}
              </div>
              {badge && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDFFE0] text-[#334E1B] border border-[#BEE7A5]">
                  {badge}
                </span>
              )}
            </div>

            {/* Location & Farmer */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#334E1B] shrink-0" />
                <span>{listing.state}, {listing.lga}</span>
              </span>
              <span>•</span>
              <span className="text-stone-500 truncate">{listing.farmerName}</span>
            </div>

            {/* Highlight reason if recommendation */}
            {highlightReason && (
              <div className="mt-1.5 p-1.5 bg-[#EDFFE0]/50 rounded-md border border-[#BEE7A5]/50 flex items-start gap-1.5 text-[11px] text-[#334E1B]">
                <Sparkles className="w-3.5 h-3.5 text-[#334E1B] shrink-0 mt-0.5" />
                <span className="leading-tight font-medium">{highlightReason}</span>
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#777777] tracking-wider">
                Price / {formattedUnit}
              </div>
              <div className="text-base font-extrabold text-[#334E1B] font-mono leading-none">
                ₦{listing.pricePerUnit.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {listing.quantity.toLocaleString()} {formattedUnit} in stock
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onViewInMarketplace(listing)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                title="View full listing details in Marketplace"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => onNegotiate(listing)}
                className="px-3 py-1.5 rounded-lg bg-[#334E1B] hover:bg-[#3F6B24] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Open instant trade negotiation with supplier"
              >
                <span>Negotiate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
