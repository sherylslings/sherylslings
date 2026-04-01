import { format } from 'date-fns';
import { Check, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useCarriers } from '@/hooks/useCarriers';
import { useApproveBooking, useCompleteBooking } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { addDays, addMonths } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const AdminBookings = () => {
  const { data: bookings, isLoading } = useBookingRequests();
  const { data: carriers } = useCarriers();
  const approveBooking = useApproveBooking();
  const completeBooking = useCompleteBooking();
  const { toast } = useToast();

  const getCarrier = (carrierId: string) => carriers?.find(c => c.id === carrierId);
  const getCarrierName = (carrierId: string) => {
    const carrier = getCarrier(carrierId);
    return carrier ? `${carrier.brand_name} ${carrier.model_name}` : 'Unknown';
  };

  const handleApprove = async (booking: NonNullable<typeof bookings>[number]) => {
    try {
      const carrier = getCarrier(booking.carrier_id);
      const startDate = new Date(booking.start_date);
      const returnDate = booking.duration === 'weekly'
        ? addDays(startDate, 7)
        : addMonths(startDate, 1);

      const rentAmount = carrier
        ? (booking.duration === 'weekly' ? carrier.weekly_rent : carrier.monthly_rent)
        : 0;
      const depositAmount = carrier?.refundable_deposit || 0;

      await approveBooking.mutateAsync({
        p_booking_id: booking.id,
        p_carrier_id: booking.carrier_id,
        p_customer_name: booking.customer_name,
        p_duration: booking.duration,
        p_start_date: booking.start_date,
        p_rent_amount: rentAmount,
        p_deposit_amount: depositAmount,
        p_return_date: format(returnDate, 'yyyy-MM-dd'),
      });

      toast({ title: 'Booking approved & transactions created!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to approve booking' });
    }
  };

  const handleReject = async (id: string) => {
    // Still use direct update for cancellation (no transactions needed)
    const { supabase } = await import('@/integrations/supabase/client');
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Booking cancelled' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to cancel booking' });
    }
  };

  const handleComplete = async (booking: NonNullable<typeof bookings>[number]) => {
    try {
      const carrier = getCarrier(booking.carrier_id);
      await completeBooking.mutateAsync({
        p_booking_id: booking.id,
        p_carrier_id: booking.carrier_id,
        p_customer_name: booking.customer_name,
        p_deposit_amount: carrier?.refundable_deposit || 0,
      });
      toast({ title: 'Marked as returned & deposit refunded!' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to update booking' });
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hi ${name}! This is regarding your baby carrier rental request.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Booking Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.phone}</p>
                        <p className="text-sm text-muted-foreground">{booking.city}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getCarrierName(booking.carrier_id)}</TableCell>
                    <TableCell>{format(new Date(booking.start_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="capitalize">{booking.duration}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openWhatsApp(booking.phone, booking.customer_name)}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(booking)}
                              className="text-green-600"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(booking.id)}
                              className="text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        {booking.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(booking)}
                          >
                            Mark Returned
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No booking requests yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBookings;
