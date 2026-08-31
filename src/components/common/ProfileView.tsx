import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Building2,
  Edit3,
  CheckCircle2,
  X,
  Camera,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Star,
  Landmark,
  FileText,
  Warehouse,
  Truck,
  Sprout,
  Users,
  Briefcase,
  KeyRound,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { TrustScoreBadge } from './TrustScoreBadge';
import { User, UserRole } from '../../types';
import { BuyerProfileForm } from '../profile/BuyerProfileForm';
import { FarmerProfileForm } from '../profile/FarmerProfileForm';
import { TransporterProfileForm } from '../profile/TransporterProfileForm';
import { AdminProfileForm } from '../profile/AdminProfileForm';
import { NIGERIAN_STATES, NIGERIAN_LGAS_BY_STATE, AVATAR_PRESETS } from '../../data/nigeriaGeography';

export const ProfileView: React.FC = () => {
  const { currentUser, users, updateUserProfile, setActiveView, showToast } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  // For Admin: ability to inspect and edit any user profile
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser?.id || 'usr-buyer-1');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // If not admin, strictly keep target to currentUser
  useEffect(() => {
    if (!isAdmin && currentUser) {
      setSelectedUserId(currentUser.id);
    }
  }, [isAdmin, currentUser]);

  const targetUser = (isAdmin ? users.find(u => u.id === selectedUserId) : currentUser) || currentUser;

  // Sync formData when targetUser changes or editing starts
  useEffect(() => {
    if (targetUser) {
      setFormData({ ...targetUser });
    }
  }, [targetUser, isEditing, selectedUserId]);

  if (!currentUser || !targetUser) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-slate-500">
        <UserIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm font-semibold">User profile not found</p>
      </div>
    );
  }

  const handleFieldChange = (updates: Partial<User>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleStateChange = (newState: string) => {
    const defaultLgas = NIGERIAN_LGAS_BY_STATE[newState] || ['Central'];
    handleFieldChange({
      state: newState,
      lga: defaultLgas[0] || ''
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUserProfile(targetUser.id, formData);
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccessNotice(true);
      showToast(
        isAdmin && targetUser.id !== currentUser.id
          ? `Admin: Successfully updated profile for ${targetUser.name}`
          : 'Profile updated successfully!',
        'success'
      );
      setTimeout(() => setSaveSuccessNotice(false), 4000);
    }, 400);
  };

  const handleCancel = () => {
    setFormData({ ...targetUser });
    setIsEditing(false);
  };

  const availableLgas = NIGERIAN_LGAS_BY_STATE[formData.state || targetUser.state] || [formData.lga || 'Municipal'];

  const trustScore = targetUser.trustScore || {
    score: 94,
    orderCompletionRate: 98,
    deliveryReliabilityRate: 95,
    qualityConsistencyRate: 96,
    averageRating: 4.8,
    totalReviews: 42,
    badgeLevel: 'GOLD'
  };

  // Role Color Styling
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'BUYER':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'FARMER':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'TRANSPORTER':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ADMIN-ONLY: Persona Quick-Switch & Master Authority Bar */}
      {isAdmin ? (
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Master Administrator Profile Authority
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                As Platform Administrator, you have master authority to inspect, test, and edit any stakeholder profile across Nigeria.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveView('admin-users')}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Full Directory</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {users.map(u => {
              const isSelected = u.id === targetUser.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedUserId(u.id);
                    setIsEditing(false);
                  }}
                  className={`p-2.5 rounded-2xl text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-950/90 border-purple-500 ring-1 ring-purple-500/50'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-600 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                      <span className="font-semibold text-purple-400">{u.role}</span>
                      <span>• {u.state}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* NON-ADMIN: Authenticated Personal Profile Notification */
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Authenticated {currentUser.role} Workspace Profile
              </div>
              <div className="text-[11px] text-slate-500">
                You have exclusive editing authority over your personal verified enterprise credentials.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            ID: {currentUser.id}
          </span>
        </div>
      )}

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              Profile for <strong>{targetUser.name}</strong> successfully synchronized across FarmPot platform state!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotice(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Header & Main Identity Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {isAdmin && targetUser.id !== currentUser.id && (
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>
                Master Authority Mode: You are managing the profile of <strong>{targetUser.name}</strong> ({targetUser.role})
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
              Admin Override Active
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full lg:w-auto">
            {/* Avatar & Photo Editor */}
            <div className="relative group flex-shrink-0">
              <img
                src={
                  (isEditing ? formData.avatar : targetUser.avatar) ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={targetUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-50 shadow-md"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-emerald-700 transition-colors cursor-pointer border border-white"
                  title="Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isEditing ? (formData.name || '') : targetUser.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getRoleBadgeStyle(
                    targetUser.role
                  )}`}
                >
                  {targetUser.role}
                </span>
                {targetUser.verification && (
                  <StatusBadge status={targetUser.verification.status} size="sm" />
                )}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {isEditing ? (formData.businessName || '') : targetUser.businessName || 'Agricultural Enterprise'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {isEditing ? formData.lga : targetUser.lga},{' '}
                  {isEditing ? formData.state : targetUser.state} State, Nigeria
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {isEditing ? formData.phone : targetUser.phone}
                </span>
                {targetUser.cacNumber && (
                  <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {targetUser.cacNumber}
                  </span>
                )}
                {targetUser.ninNumber && (
                  <span className="flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {targetUser.ninNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button: Edit vs Save / Cancel */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>
                  {isAdmin && targetUser.id !== currentUser.id
                    ? `Admin: Edit ${targetUser.name}'s Profile`
                    : `Edit My ${targetUser.role} Profile`}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                    isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Preset Drawer (When Opened) */}
        {isEditing && showAvatarPicker && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Choose an Avatar Preset or Paste Image URL</span>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleFieldChange({ avatar: preset.url });
                    setShowAvatarPicker(false);
                  }}
                  className={`p-2 rounded-xl flex items-center gap-2 border text-left cursor-pointer transition-all ${
                    formData.avatar === preset.url
                      ? 'bg-emerald-100 border-emerald-500 ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-slate-800 truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Or Custom Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.avatar || ''}
                onChange={e => handleFieldChange({ avatar: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Bio / Description */}
        <div className="pt-2">
          {isEditing ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Executive Bio & Enterprise Description
              </label>
              <textarea
                rows={3}
                placeholder="Provide details on operations, sourcing capacity, or logistics specializations..."
                value={formData.bio || ''}
                onChange={e => handleFieldChange({ bio: e.target.value })}
                className="w-full p-3 text-xs rounded-2xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {targetUser.bio ||
                'Verified agro stakeholder operating actively within the FarmPot Pan-Nigerian escrow and agricultural supply network.'}
            </p>
          )}
        </div>
      </div>

      {/* EDIT MODE: General Contact & Location Information */}
      {isEditing && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>General Contact & Primary Business Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name / Representative
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => handleFieldChange({ name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Business / Farm / Fleet Enterprise Name
              </label>
              <input
                type="text"
                value={formData.businessName || ''}
                onChange={e => handleFieldChange({ businessName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={e => handleFieldChange({ email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={e => handleFieldChange({ phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                WhatsApp Business Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={e => handleFieldChange({ whatsapp: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State (Nigeria)
              </label>
              <select
                value={formData.state || NIGERIAN_STATES[0]}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {NIGERIAN_STATES.map(st => (
                  <option key={st} value={st}>{st} State</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                LGA (Local Government Area)
              </label>
              <select
                value={formData.lga || availableLgas[0]}
                onChange={e => handleFieldChange({ lga: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableLgas.map(lg => (
                  <option key={lg} value={lg}>{lg}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Physical Facility / Farm Gate Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={e => handleFieldChange({ address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODE: Dedicated Role-Specific Form */}
      {isEditing && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {targetUser.role === 'BUYER' && 'Buyer Sourcing & Procurement Settings'}
                {targetUser.role === 'FARMER' && 'Farmer Agronomic & Farmland Settings'}
                {targetUser.role === 'TRANSPORTER' && 'Transporter Logistics & Fleet Settings'}
                {targetUser.role === 'ADMIN' && 'Admin Governance & Clearance Settings'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customized operational attributes specifically tailored for {targetUser.role.toLowerCase()} operations.
              </p>
            </div>
          </div>

          {targetUser.role === 'BUYER' && (
            <BuyerProfileForm formData={formData} onChange={handleFieldChange} />
          )}

          {targetUser.role === 'FARMER' && (
            <FarmerProfileForm formData={formData} onChange={handleFieldChange} />
          )}

          {targetUser.role === 'TRANSPORTER' && (
            <TransporterProfileForm formData={formData} onChange={handleFieldChange} />
          )}

          {targetUser.role === 'ADMIN' && (
            <AdminProfileForm formData={formData} onChange={handleFieldChange} />
          )}

          {/* Bottom Action Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-2xl disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Profile...' : 'Save & Sync Profile'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE: Rich Role-Specific Details Cards */}
      {!isEditing && (
        <div className="space-y-6">
          {/* BUYER VIEW */}
          {targetUser.role === 'BUYER' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>Procurement & Corporate Sourcing Profile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Specifications</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Buyer Category</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.buyerType || 'Industrial Food Processor'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Monthly Sourcing Budget</div>
                  <div className="text-sm font-bold text-emerald-800 mt-1">
                    ₦{(targetUser.monthlyProcurementBudgetNGN || 45000000).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Preferred Quality Grade</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.preferredQualityGrade || 'GRADE_A'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Warehouse Capacity</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {(targetUser.storageWarehouseCapacityMT || 2500).toLocaleString()} MT
                  </div>
                </div>
              </div>

              {/* Target Commodities */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Target Commodities Sourced:</div>
                <div className="flex flex-wrap gap-2">
                  {(targetUser.targetCrops || ['Tomatoes', 'Maize', 'Soybeans', 'Cassava Tubers']).map(crop => (
                    <span
                      key={crop}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200"
                    >
                      ✓ {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facility Locations */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Drop-off Hubs & Processing Plants:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(targetUser.facilityLocations || ['Ikeja Industrial Estate, Lagos', 'Sagamu Inter-State Warehouse, Ogun']).map((loc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700 flex items-center justify-center text-emerald-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {targetUser.bankName || 'Access Bank Nigeria PLC'}
                    </div>
                    <div className="text-xs font-mono text-emerald-300">
                      {targetUser.bankAccountNumber || '0129847192'} • {targetUser.bankAccountName || targetUser.businessName}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 font-semibold">
                  Verified Escrow Billing Account
                </span>
              </div>
            </div>
          )}

          {/* FARMER VIEW */}
          {targetUser.role === 'FARMER' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>Farmland Acreage & Operations Overview</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Farm Specs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Cultivated Land</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.farmSizeHectares || 45} Hectares
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ≈ {((targetUser.farmSizeHectares || 45) * 2.471).toFixed(1)} Acres
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">On-Farm Silo Storage</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.storageCapacityTons || 120} Metric Tonnes
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Irrigation Method</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.irrigationType || 'BOREHOLE_CENTER_PIVOT'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Established</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    Since {targetUser.establishedYear || 2012}
                  </div>
                </div>
              </div>

              {/* Cultivated Crops */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Primary Harvest Commodities:</div>
                <div className="flex flex-wrap gap-2">
                  {(targetUser.primaryCrops || ['Roma Tomatoes', 'Yellow Maize', 'Soybeans', 'Chili Pepper']).map(crop => (
                    <span
                      key={crop}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200"
                    >
                      🌱 {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cooperative Affiliation */}
              {targetUser.cooperativeName && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">
                        {targetUser.cooperativeName}
                      </div>
                      <div className="text-[11px] text-amber-800 font-mono">
                        Affiliation Reg: {targetUser.cooperativeRegId || 'KAD/AFAN/2021/8492'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-900 font-bold">
                    AFAN Member
                  </span>
                </div>
              )}

              {/* Bank Payout Details */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700 flex items-center justify-center text-emerald-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {targetUser.bankName || 'Zenith Bank PLC'}
                    </div>
                    <div className="text-xs font-mono text-emerald-300">
                      {targetUser.bankAccountNumber || '2081928340'} • {targetUser.bankAccountName || targetUser.name}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 font-semibold">
                  Direct Escrow Harvest Disbursal
                </span>
              </div>
            </div>
          )}

          {/* TRANSPORTER VIEW */}
          {targetUser.role === 'TRANSPORTER' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span>Haulage Fleet Capacity & Insurance Specifications</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Fleet Specs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Active Fleet Size</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.fleetSize || 14} Commercial Vehicles
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Max Single Payload</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.maxPayloadTons || 35} Metric Tonnes
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Cold-Chain Refrig.</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Equipped (2°C – 8°C)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">FRSC Fleet Reg</div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                    {targetUser.frscFleetNumber || 'FRSC-RTC-KAN-849'}
                  </div>
                </div>
              </div>

              {/* Coverage States */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Active Freight Corridors & States:</div>
                <div className="flex flex-wrap gap-1.5">
                  {(targetUser.coverageStates || ['Kano', 'Kaduna', 'Oyo', 'Lagos', 'Ogun', 'Plateau', 'Benue', 'FCT Abuja']).map(st => (
                    <span
                      key={st}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold"
                    >
                      📍 {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* GIT Insurance */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-950">
                      {targetUser.insuranceProvider || 'Leadway Assurance Nigeria PLC'}
                    </div>
                    <div className="text-[11px] text-blue-800 font-mono">
                      Policy Certificate: {targetUser.gitPolicyNumber || 'LEADWAY-GIT-2025-89410'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-200/80 text-blue-900 font-bold">
                  GIT Active & Bonded
                </span>
              </div>

              {/* Bank Payout Details */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700 flex items-center justify-center text-emerald-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {targetUser.bankName || 'First Bank of Nigeria'}
                    </div>
                    <div className="text-xs font-mono text-emerald-300">
                      {targetUser.bankAccountNumber || '3109283741'} • {targetUser.bankAccountName || targetUser.businessName}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 font-semibold">
                  Automated Freight Waybill Payout
                </span>
              </div>
            </div>
          )}

          {/* ADMIN VIEW */}
          {targetUser.role === 'ADMIN' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <span>Platform Governance & Staff Clearance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Credentials</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-[11px] text-purple-900 font-medium">Staff Department</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {targetUser.department || 'EXECUTIVE'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-[11px] text-purple-900 font-medium">Clearance Authority</div>
                  <div className="text-sm font-bold text-purple-950 mt-1">
                    {targetUser.clearanceLevel || 'TIER_4_MASTER'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-[11px] text-purple-900 font-medium">Staff Badge ID</div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                    {targetUser.badgeId || 'FP-ADMIN-001'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-[11px] text-purple-900 font-medium">Hardware 2FA Key</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>FIDO2 Active</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700 flex items-center justify-center text-purple-300">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {targetUser.supervisorRole || 'Lead Platform Custodian & Chief Operations Officer'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Emergency Hotline: {targetUser.emergencyPhone || '+234 802 000 9999'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-purple-900/80 border border-purple-600 text-purple-200 font-mono font-semibold">
                  256-Bit Escrow Signer
                </span>
              </div>
            </div>
          )}

          {/* Deterministic Trust Engine Breakdown */}
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
      )}
    </div>
  );
};
