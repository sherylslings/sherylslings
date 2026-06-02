import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, Clock, Ban } from 'lucide-react';

interface AvailabilityBadgeProps {
  status: 'available' | 'rented' | 'hidden' | 'sold-out';
  nextAvailableDate?: string | null;
  size?: 'sm' | 'md';
}

export const AvailabilityBadge = ({ status, nextAvailableDate, size = 'md' }: AvailabilityBadgeProps) => {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const base = 'inline-flex items-center gap-1.5 rounded-full font-medium shadow-sm backdrop-blur-sm';

  if (status === 'sold-out') {
    return (
      <div className={cn(base, sizeClass, 'bg-muted text-muted-foreground border border-border')}>
        <Ban className={iconSize} />
        Sold Out
      </div>
    );
  }

  const isAvailable = status === 'available';
  return (
    <div
      className={cn(
        base,
        sizeClass,
        isAvailable
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      )}
    >
      {isAvailable ? (
        <>
          <Check className={iconSize} />
          Available
        </>
      ) : (
        <>
          <Clock className={iconSize} />
          {nextAvailableDate
            ? `Available ${format(new Date(nextAvailableDate), 'dd MMM')}`
            : 'Rented'}
        </>
      )}
    </div>
  );
};
