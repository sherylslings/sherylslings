import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePurchases, useUpdatePurchase, type Purchase } from '@/hooks/usePurchases';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const statusColors: Record<string, string> = {
  payment_claimed: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  payment_claimed: 'Payment Claimed',
  verified: 'Verified',
  cancelled: 'Cancelled',
};

const AdminPurchases = () => {
  const [carrierNames, setCarrierNames] = useState<Record<string, string>>({});
  const { data: purchases, isLoading } = usePurchases();
  const updatePurchase = useUpdatePurchase();

  useEffect(() => {
    if (!purchases || purchases.length === 0) return;
    const ids = Array.from(new Set(purchases.map((p) => p.carrier_id)));
    const load = async () => {
      const { data } = await supabase.from('carriers').select('id, brand_name, model_name').in('id', ids);
      const map: Record<string, string> = {};
      data?.forEach((c) => {
        map[c.id] = `${c.brand_name} ${c.model_name}`;
      });
      setCarrierNames(map);
    };
    load();
  }, [purchases]);

  const handleStatusChange = async (purchase: Purchase, status: Purchase['status']) => {
    try {
      await updatePurchase.mutateAsync({ id: purchase.id, status });
      toast.success(`Purchase marked ${statusLabels[status]}`);
    } catch {
      toast.error('Failed to update purchase');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Buy Now Purchases</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : purchases && purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{format(new Date(purchase.created_at), 'dd MMM yyyy')}</TableCell>
                      <TableCell>{purchase.customer_name}</TableCell>
                      <TableCell>{purchase.phone}</TableCell>
                      <TableCell>{carrierNames[purchase.carrier_id] || '—'}</TableCell>
                      <TableCell className="font-medium">₹{Number(purchase.amount).toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[purchase.status]}>{statusLabels[purchase.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {purchase.status === 'payment_claimed' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(purchase, 'verified')}
                                title="Verify"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(purchase, 'cancelled')}
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" title="Details" disabled>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No purchases yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPurchases;
