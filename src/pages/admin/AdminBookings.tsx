import { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useBookingRequests } from '@/hooks/useBookingRequests';
import { useCarriers } from '@/hooks/useCarriers';
import { useCompleteBooking } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import StartRentalModal from '@/components/admin/StartRentalModal';
import MarkSoldModal from '@/components/admin/MarkSoldModal';
import type { BookingRequest } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  on_rent: 'bg-purple-100 text-purple-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
  sold: 'bg-orange-100 text-orange-800',
};

const statusLabels: Record<string, string> = {
  pending: 'pending',
  approved: 'accepted',
  on_rent: 'on rent',
  completed: 'returned',
  cancelled: 'cancelled',
  sold: 'sold',
};

const AdminBookings = () => {
  const { data: bookings, isLoading } = useBookingRequests();
  const { data: carriers } = useCarriers(undefined, { includeHidden: true });
  const completeBooking = useCompleteBooking();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rentalBooking, setRentalBooking] = useState<BookingRequest | null>(null);
  const [rentalMode, setRentalMode] = useState<'start' | 'edit'>('start');
  const [soldBooking, setSoldBooking] = useState<BookingRequest | null>(null);

  const getCarrier = (carrierId: string) => carriers?.find(c => c.id === carrierId);
  const getCarrierName = (carrierId: string) => {
    const carrier = getCarrier(carrierId);
    return carrier ? `${carrier.brand_name} ${carrier.model_name}` : 'Unknown';
  };

  const handleAccept = async (booking: BookingRequest) => {
    const { supabase } = await import('@/integrations/supabase/client');
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'approved' })
        .eq('id', booking.id);
      if (error) throw error;

      const { error: carrierError } = await supabase
        .from('carriers')
        .update({ availability_status: 'rented', next_available_date: null })
        .eq('id', booking.carrier_id);
      if (carrierError) throw carrierError;

      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast({ title: 'Booking accepted', description: 'Start the rental when you are ready.' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to accept booking' });
    }
  };

  const handleReject = async (id: string) => {
    const { supabase } = await import('@/integrations/supabase/client');
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('id', id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      toast({ title: 'Booking cancelled' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to cancel booking' });
    }
  };

  const handleComplete = async (booking: BookingRequest) => {
    try {
      const carrier = getCarrier(booking.carrier_id);
      await completeBooking.mutateAsync({
        p_booking_id: booking.id,
        p_carrier_id: booking.carrier_id,
        p_customer_name: booking.customer_name,
        p_deposit_amount: carrier?.refundable_deposit || 0,
      });
      toast({ title: 'Marked as returned!' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to update booking' });
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hi ${name}! This is regarding your baby carrier rental request.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const fmt = (date: string | null) => (date ? format(new Date(date), 'dd MMM yyyy') : '—');

  return (
    <>
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
                    <TableHead>Requested</TableHead>
                    <TableHead>Rental Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="max-w-[240px]">
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.phone}</p>
                          <p className="text-sm text-muted-foreground">{booking.city}</p>
                          {booking.address && (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words mt-1">
                              {booking.address}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getCarrierName(booking.carrier_id)}</TableCell>
                      <TableCell>
                        <p className="capitalize text-sm">{booking.duration}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.created_at), 'dd MMM yyyy')}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {booking.rental_start_date ? (
                          <>
                            <p>{fmt(booking.rental_start_date)}</p>
                            <p className="text-xs text-muted-foreground">to {fmt(booking.rental_end_date)}</p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Not started</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status] ?? statusColors.pending}>
                          {statusLabels[booking.status] ?? booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end items-center gap-1">
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
                                onClick={() => handleAccept(booking)}
                                className="text-green-600"
                                title="Accept booking"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReject(booking.id)}
                                className="text-destructive"
                                title="Decline booking"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {booking.status === 'approved' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => { setRentalMode('start'); setRentalBooking(booking); }}
                            >
                              Start Rental
                            </Button>
                          )}

                          {booking.status === 'on_rent' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setRentalMode('edit'); setRentalBooking(booking); }}
                              >
                                Edit Rental
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleComplete(booking)}>
                                Mark Returned
                              </Button>
                            </>
                          )}

                          {booking.status !== 'sold' && (
                            <Button variant="ghost" size="sm" onClick={() => setSoldBooking(booking)}>
                              Mark Sold
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

      <StartRentalModal
        open={!!rentalBooking}
        onOpenChange={(open) => !open && setRentalBooking(null)}
        booking={rentalBooking}
        carrier={rentalBooking ? getCarrier(rentalBooking.carrier_id) : undefined}
        mode={rentalMode}
      />

      <MarkSoldModal
        open={!!soldBooking}
        onOpenChange={(open) => !open && setSoldBooking(null)}
        booking={soldBooking}
        carrier={soldBooking ? getCarrier(soldBooking.carrier_id) : undefined}
      />
    </>
  );
};

export default AdminBookings;
