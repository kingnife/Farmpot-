import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ShieldCheck,
  Truck,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowRight,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Listing } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { TrustScoreBadge } from '../common/TrustScoreBadge';

interface BrowseProduceProps {
  onOpenNegotiation: (listing: Listing) => void;
}

export const BrowseProduce: React.FC<BrowseProduceProps> = ({ onOpenNegotiation }) => {
  const {
    listings,
    users,
    startOrOpenConversation,
    setActiveView,
    currentUser,
    setSelectedListingId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');

  const categories = ['ALL', 'VEGETABLES', 'GRAINS', 'TUBERS', 'OIL_SEEDS', 'FRUITS'];
  const nigerianStates = ['ALL', 'Kaduna', 'Kano', 'Oyo', 'Lagos', 'Plateau', 'Benue', 'Ogun', 'Niger'];

  const filteredListings = (listings || []).filter(item => {
    if (item.status !== 'PUBLISHED') return false;
    const matchesSearch =
      (item.product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.variety || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesState = selectedState === 'ALL' || item.state === selectedState;
    const matchesGrade = selectedGrade === 'ALL' || item.qualityGrade === selectedGrade;

    return matchesSearch && matchesCategory && matchesState && matchesGrade;
  });

  const handleContactFarmer = (listing: Listing) => {
    const convId = startOrOpenConversation({
      listingId: listing.id,
      targetUserId: listing.farmerId,
      targetUserName: listing.farmerName,
      title: `Inquiry: ${listing.product} (${listing.quantity} ${listing.unit})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Browse Nigerian Farm Produce</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified direct-from-farm listings across Nigerian agricultural hubs with Escrow & Cold-Chain delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            {filteredListings.length} Available Listings
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Roma Tomatoes, Maize, Habanero, Kaduna, Oyo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="ALL">All Nigerian States</option>
              {nigerianStates.filter(s => s !== 'ALL').map(s => (
                <option key={s} value={s}>{s} State</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">All Quality Grades</option>
            <option value="GRADE_A">Grade A (Premium)</option>
            <option value="GRADE_B">Grade B (Standard)</option>
            <option value="EXPORT_PREMIUM">Export Premium</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <Layers className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No produce matching your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, location filters, or quality grade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => {
            const farmer = (users || []).find(u => u.id === listing.farmerId);
            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col overflow-hidden group"
              >
                {/* Photo & Badge */}
                <div className="h-44 relative bg-slate-100 overflow-hidden">
                  <img
                    src={listing.photos[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'}
                    alt={listing.product}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/70 text-white backdrop-blur-xs">
                      {listing.qualityGrade.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs">
                      {listing.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold backdrop-blur-xs">
                    {(listing.quantity || 0).toLocaleString()} {listing.unit} in stock
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Price Header */}
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-lg font-black text-emerald-800">
                        ₦{(listing.pricePerUnit || 0).toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-500">/ {listing.unit}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Min. {listing.minOrderQuantity} {listing.unit}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {listing.product}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      Variety: <span className="font-semibold text-slate-700">{listing.variety}</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{listing.lga}, {listing.state} State</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-blue-500" />
                        <span>{listing.deliveryCapability.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Harvest: {listing.harvestDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Trust Footer & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={farmer?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                          alt={listing.farmerName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                          {listing.farmerName}
                        </span>
                      </div>

                      {farmer && (
                        <TrustScoreBadge
                          trustScore={farmer.trustScore}
                          userName={farmer.name}
                          size="sm"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleContactFarmer(listing)}
                        className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat / WA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenNegotiation(listing)}
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Make Offer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
