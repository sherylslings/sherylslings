import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMarkBookingSold } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import type { BookingRequest, Carrier } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingRequest | null;
  carrier?: Carrier;
}

const MarkSoldModal = ({ open, onOpenChange, booking, carrier }: Props) => {
  const [amount, setAmount] = useState('');
  const markSold = useMarkBookingSold();
  const { toast } = useToast();

  useEffect(() => {
    if (open) setAmount(carrier ? String(carrier.buyout_price) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    try {
      await markSold.mutateAsync({
        p_booking_id: booking.id,
        p_carrier_id: booking.carrier_id,
        p_customer_name: booking.customer_name,
        p_amount: parseFloat(amount),
      });
      toast({ title: 'Marked as sold' });
      onOpenChange(false);
    } catch {
      toast({ variant: 'destructive', title: 'Failed to mark as sold' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">Mark as Sold</DialogTitle>
        </DialogHeader>
        {booking && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium">{booking.customer_name}</p>
              {carrier && (
                <p className="text-muted-foreground">
                  {carrier.brand_name} {carrier.model_name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sale amount (₹)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This records the amount as sale income and marks the carrier sold out.
            </p>
            <Button type="submit" className="w-full" disabled={markSold.isPending}>
              {markSold.isPending ? 'Saving...' : 'Mark as Sold'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarkSoldModal;
