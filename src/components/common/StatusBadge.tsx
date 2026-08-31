import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showDot = true }) => {
  const getStatusConfig = (s: string) => {
    const norm = s.toUpperCase().replace(/\s+/g, '_');
    switch (norm) {
      // Verification
      case 'VERIFIED':
      case 'APPROVED':
      case 'COMPLETED':
      case 'ACCEPTED':
      case 'SUCCESSFUL':
      case 'FUNDS_HELD':
      case 'RELEASED_TO_FARMER':
      case 'PUBLISHED':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };

      case 'UNDER_REVIEW':
      case 'SUBMITTED':
      case 'PENDING':
      case 'MATCHING':
      case 'MATCHED':
      case 'NEGOTIATING':
      case 'PAYMENT_PENDING':
      case 'READY_FOR_PICKUP':
      case 'TRANSPORTER_ASSIGNED':
      case 'SCHEDULED':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'QUALITY_PENDING':
      case 'WAITING_FOR_RESPONSE':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };

      case 'ORDER_CREATED':
      case 'AGREEMENT':
      case 'AVAILABLE_JOB':
      case 'ACTIVE':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };

      case 'REJECTED':
      case 'CANCELLED':
      case 'DISPUTED':
      case 'DISPUTED_LOCK':
      case 'FAILED':
      case 'PAYMENT_FAILED':
      case 'DELIVERY_FAILED':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };

      case 'DRAFT':
      case 'PAUSED':
      case 'NOT_VERIFIED':
      case 'RESUBMISSION_REQUIRED':
      case 'EXPIRED':
      case 'REFUNDED':
      case 'REFUNDED_TO_BUYER':
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  }[size];

  const formattedText = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />}
      <span className="capitalize">{formattedText.toLowerCase()}</span>
    </span>
  );
};
