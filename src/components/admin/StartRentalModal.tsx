import { useEffect, useState } from 'react';
import { addDays, addMonths, format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStartRental, useUpdateRental } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import type { BookingRequest, Carrier } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingRequest | null;
  carrier?: Carrier;
  mode: 'start' | 'edit';
}

type Duration = 'weekly' | 'biweekly' | 'monthly';

const endFrom = (start: string, duration: Duration) => {
  const d = new Date(start);
  const end = duration === 'weekly' ? addDays(d, 7) : duration === 'biweekly' ? addDays(d, 14) : addMonths(d, 1);
  return format(end, 'yyyy-MM-dd');
};

const StartRentalModal = ({ open, onOpenChange, booking, carrier, mode }: Props) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(today);
  const [duration, setDuration] = useState<Duration>('weekly');
  const [endDate, setEndDate] = useState(endFrom(today, 'weekly'));

  const startRental = useStartRental();
  const updateRental = useUpdateRental();
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !booking) return;
    const initialStart = booking.rental_start_date || booking.start_date || today;
    const initialDuration = ((booking.rental_duration || booking.duration) as Duration) || 'weekly';
    setStartDate(initialStart);
    setDuration(initialDuration);
    setEndDate(booking.rental_end_date || endFrom(initialStart, initialDuration));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking?.id]);

  const rentAmount = carrier
    ? duration === 'weekly'
      ? carrier.weekly_rent
      : duration === 'biweekly'
        ? carrier.weekly_rent * 2
        : carrier.monthly_rent
    : 0;

  const handleStartChange = (value: string) => {
    setStartDate(value);
    if (value) setEndDate(endFrom(value, duration));
  };

  const handleDurationChange = (value: Duration) => {
    setDuration(value);
    if (startDate) setEndDate(endFrom(startDate, value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    try {
      if (mode === 'start') {
        await startRental.mutateAsync({
          p_booking_id: booking.id,
          p_carrier_id: booking.carrier_id,
          p_customer_name: booking.customer_name,
          p_start_date: startDate,
          p_end_date: endDate,
          p_duration: duration,
          p_rent_amount: rentAmount,
          p_deposit_amount: carrier?.refundable_deposit ?? 0,
        });
        toast({ title: 'Rental started' });
      } else {
        await updateRental.mutateAsync({
          p_booking_id: booking.id,
          p_carrier_id: booking.carrier_id,
          p_start_date: startDate,
          p_end_date: endDate,
          p_duration: duration,
          p_rent_amount: rentAmount,
        });
        toast({ title: 'Rental updated' });
      }
      onOpenChange(false);
    } catch {
      toast({ variant: 'destructive', title: mode === 'start' ? 'Failed to start rental' : 'Failed to update rental' });
    }
  };

  const isPending = startRental.isPending || updateRental.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {mode === 'start' ? 'Start Rental' : 'Edit Rental'}
          </DialogTitle>
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
              <Label>Rental start date</Label>
              <Input type="date" value={startDate} onChange={(e) => handleStartChange(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={(v) => handleDurationChange(v as Duration)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly{carrier ? ` (₹${carrier.weekly_rent})` : ''}</SelectItem>
                  <SelectItem value="biweekly">Biweekly{carrier ? ` (₹${carrier.weekly_rent * 2})` : ''}</SelectItem>
                  <SelectItem value="monthly">Monthly{carrier ? ` (₹${carrier.monthly_rent})` : ''}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Return date (shown to visitors as available from)</Label>
              <Input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>

            <div className="bg-accent/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rent</span>
                <span>₹{rentAmount}</span>
              </div>
              {mode === 'start' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit received</span>
                  <span>₹{carrier?.refundable_deposit ?? 0}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving...' : mode === 'start' ? 'Start Rental' : 'Save Changes'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartRentalModal;
