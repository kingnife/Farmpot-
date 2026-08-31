import React from 'react';
import { PlusCircle, Store, Trash2, Edit3, Eye, PauseCircle, PlayCircle, MapPin, Calendar, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

interface FarmerListingsProps {
  onOpenCreateListing: () => void;
}

export const FarmerListings: React.FC<FarmerListingsProps> = ({ onOpenCreateListing }) => {
  const { currentUser, listings, updateListingStatus, deleteListing } = useApp();

  const farmerListings = (listings || []).filter(l => l.farmerId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Agricultural Produce Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your published inventory, adjust prices in NGN, and monitor stock availability.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateListing}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Produce Listing</span>
        </button>
      </div>

      {farmerListings.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
          <Store className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No produce listed yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            List your harvest batches to start receiving instant matching requests from corporate buyers and food processors.
          </p>
          <button
            type="button"
            onClick={onOpenCreateListing}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            List Your First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerListings.map(listing => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-40 relative bg-slate-100">
                  <img
                    src={listing.photos[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'}
                    alt={listing.product}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <StatusBadge status={listing.status} size="sm" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      Grade {listing.qualityGrade.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{listing.product}</h3>
                    <span className="text-base font-black text-emerald-800">
                      ₦{(listing.pricePerUnit || 0).toLocaleString()}/{listing.unit || 'unit'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{listing.description}</p>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Available Stock:</span>
                      <strong className="text-slate-800">{(listing.quantity || 0).toLocaleString()} {listing.unit || 'units'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Harvest Date:</span>
                      <span className="text-slate-700">{listing.harvestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loading Depot:</span>
                      <span className="text-slate-700">{listing.lga}, {listing.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {listing.status === 'PUBLISHED' ? (
                    <button
                      type="button"
                      onClick={() => updateListingStatus(listing.id, 'PAUSED')}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
                      title="Pause Listing"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateListingStatus(listing.id, 'PUBLISHED')}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
                      title="Publish Listing"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteListing(listing.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
