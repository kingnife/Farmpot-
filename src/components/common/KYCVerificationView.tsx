import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Upload, CheckCircle2, FileText, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { TrustScoreBadge } from './TrustScoreBadge';

export const KYCVerificationView: React.FC = () => {
  const { currentUser, submitVerificationRequest } = useApp();

  const [ninNumber, setNinNumber] = useState(currentUser.verification.ninNumber || '28394019283');
  const [bvnNumber, setBvnNumber] = useState(currentUser.verification.bvnNumber || '22194820192');
  const [cacNumber, setCacNumber] = useState(currentUser.verification.cacNumber || 'RC-1928472');
  const [farmGps, setFarmGps] = useState(currentUser.verification.farmGpsCoordinates || '11.0855° N, 7.7199° E');
  const [farmSize, setFarmSize] = useState<number>(currentUser.verification.farmSizeHectares || 25);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerificationRequest({
      ninNumber,
      bvnNumber,
      cacNumber,
      farmGpsCoordinates: farmGps,
      farmSizeHectares: farmSize,
      documentsUploaded: ['NIN_Slip.pdf', 'CAC_Certificate.pdf', 'Farm_Coordinates_Audit.pdf'],
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">National KYC & Entity Verification</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify your Nigerian identity (NIN/BVN), corporate registration (CAC), and physical agricultural assets to unlock premium supplier matching and higher credit limits.
        </p>
      </div>

      {/* Current Status Card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Current Verification Status</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-bold text-slate-900">{currentUser.name}</span>
              <StatusBadge status={currentUser.verification.status} size="md" />
            </div>
          </div>
        </div>

        <TrustScoreBadge trustScore={currentUser.trustScore} userName={currentUser.name} size="lg" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 text-xs">
        <h2 className="text-sm font-bold text-slate-900">Government Identity & Corporate Filings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">National Identity Number (NIN) *</label>
            <input
              type="text"
              required
              value={ninNumber}
              onChange={e => setNinNumber(e.target.value)}
              placeholder="11-digit NIN"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bank Verification Number (BVN) *</label>
            <input
              type="text"
              required
              value={bvnNumber}
              onChange={e => setBvnNumber(e.target.value)}
              placeholder="11-digit BVN"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">CAC Registration / RC Number</label>
            <input
              type="text"
              value={cacNumber}
              onChange={e => setCacNumber(e.target.value)}
              placeholder="e.g. RC-1928472 or BN-384920"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Farm / Facility GPS Coordinates</label>
            <input
              type="text"
              value={farmGps}
              onChange={e => setFarmGps(e.target.value)}
              placeholder="e.g. 11.0855° N, 7.7199° E"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Upload Doc placeholder */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
          <Upload className="w-6 h-6 mx-auto text-slate-400" />
          <div className="font-bold text-slate-700">Upload CAC Certificate, Farm Land Title, or GIT Policy</div>
          <div className="text-[11px] text-slate-400">PDF, JPG or PNG up to 15MB</div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            Submit for Verification Audit
          </button>
        </div>
      </form>
    </div>
  );
};
