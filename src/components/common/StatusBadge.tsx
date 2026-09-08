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
      // Success & Approved States
      case 'VERIFIED':
      case 'APPROVED':
      case 'COMPLETED':
      case 'ACCEPTED':
      case 'SUCCESSFUL':
      case 'FUNDS_HELD':
      case 'RELEASED_TO_FARMER':
      case 'PUBLISHED':
      case 'ACTIVE':
      case 'DELIVERED':
      case 'ORDER_CREATED':
      case 'AGREEMENT':
      case 'AVAILABLE_JOB':
        return { bg: 'bg-[#EDFFE0] text-[#334E1B] border-[#BEE7A5]', dot: 'bg-[#334E1B]' };

      // Warning & Pending States
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
        return { bg: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]', dot: 'bg-[#D97706]' };

      // Error & Failed States
      case 'REJECTED':
      case 'CANCELLED':
      case 'DISPUTED':
      case 'DISPUTED_LOCK':
      case 'FAILED':
      case 'PAYMENT_FAILED':
      case 'DELIVERY_FAILED':
        return { bg: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]', dot: 'bg-[#DC2626]' };

      // Neutral / Draft States
      case 'DRAFT':
      case 'PAUSED':
      case 'NOT_VERIFIED':
      case 'RESUBMISSION_REQUIRED':
      case 'EXPIRED':
      case 'REFUNDED':
      case 'REFUNDED_TO_BUYER':
      default:
        return { bg: 'bg-stone-100 text-stone-700 border-stone-200', dot: 'bg-stone-400' };
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
