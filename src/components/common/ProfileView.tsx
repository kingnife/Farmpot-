import React from 'react';
import { ShieldCheck, Award, Star, CheckCircle2, User, Phone, MapPin, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { TrustScoreBadge } from './TrustScoreBadge';

export const ProfileView: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500">
        <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm font-semibold">User profile not found</p>
      </div>
    );
  }

  const trustScore = currentUser.trustScore || {
    score: 90,
    orderCompletionRate: 95,
    deliveryReliabilityRate: 92,
    qualityConsistencyRate: 94,
    averageRating: 4.8,
    totalReviews: 24,
    badgeLevel: 'GOLD'
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-emerald-50 shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              {currentUser.verification && (
                <StatusBadge status={currentUser.verification.status} size="sm" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {currentUser.businessName || 'Agricultural Trader'} • {currentUser.role}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentUser.lga || 'HQ'}, {currentUser.state || 'Nigeria'} State, Nigeria
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {currentUser.phone || '+234 800 000 0000'}
              </span>
            </div>
          </div>
        </div>

        <TrustScoreBadge trustScore={trustScore} userName={currentUser.name} size="lg" />
      </div>

      {/* Trust Score Deep Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Deterministic Trust Engine Audit</h2>
            <p className="text-xs text-slate-500">
              Scored objectively from identity audits, on-time delivery rates, and quality consistency.
            </p>
          </div>
          <div className="text-2xl font-black text-emerald-800">{trustScore.score} / 100</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-500">Order Completion</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {trustScore.orderCompletionRate}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${trustScore.orderCompletionRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-500">Delivery Reliability</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {trustScore.deliveryReliabilityRate}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${trustScore.deliveryReliabilityRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-500">Quality Consistency</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {trustScore.qualityConsistencyRate}%
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${trustScore.qualityConsistencyRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs text-slate-500">Reviews & Rating</div>
            <div className="text-xl font-bold text-amber-500 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{trustScore.averageRating} / 5.0</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {trustScore.totalReviews} verified trade reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
