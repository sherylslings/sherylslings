import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreatePurchase, useRecordPurchasePaid } from '@/hooks/usePurchases';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { toast } from 'sonner';
import type { Carrier } from '@/lib/types';
import { Link } from 'react-router-dom';

const buyNowSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  address: z.string().min(5, 'Full address is required'),
  agreed_to_terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type BuyNowFormData = z.infer<typeof buyNowSchema>;

interface BuyNowModalProps {
  carrier: Carrier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuyNowModal = ({ carrier, open, onOpenChange }: BuyNowModalProps) => {
  const [step, setStep] = useState<'form' | 'qr' | 'done'>('form');
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const { settings } = useSiteSettingsContext();
  const createPurchase = useCreatePurchase();
  const recordPaid = useRecordPurchasePaid();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BuyNowFormData>({
    resolver: zodResolver(buyNowSchema),
    defaultValues: {
      agreed_to_terms: false,
    },
  });

  const agreedToTerms = watch('agreed_to_terms');
  const paymentQrUrl = settings?.payment_qr_url;
  const amount = carrier.buyout_price;

  const handleClose = () => {
    setStep('form');
    setPurchaseId(null);
    reset();
    onOpenChange(false);
  };

  const onSubmitForm = async (data: BuyNowFormData) => {
    try {
      const purchase = await createPurchase.mutateAsync({
        carrier_id: carrier.id,
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        pincode: data.pincode,
        amount,
        agreed_to_terms: data.agreed_to_terms,
      });
      setPurchaseId(purchase.id);
      setStep('qr');
    } catch (error) {
      console.error('Create purchase failed', error);
      toast.error('Failed to start purchase. Please try again.');
    }
  };

  const handlePaymentMade = async () => {
    if (!purchaseId) return;
    try {
      await recordPaid.mutateAsync(purchaseId);
      setStep('done');
    } catch (error) {
      console.error('Record purchase paid failed', error);
      toast.error('Failed to confirm payment. Please try again.');
    }
  };

  if (step === 'done') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-available/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-available" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Payment Claimed!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you! We'll verify the payment and confirm your order on WhatsApp shortly.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'qr') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Complete Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <div className="bg-accent/50 rounded-lg p-4 text-left">
              <p className="text-sm font-medium">{carrier.brand_name} {carrier.model_name}</p>
              <p className="text-sm text-muted-foreground">Amount Payable</p>
              <p className="text-3xl font-bold text-foreground">₹{amount.toLocaleString('en-IN')}</p>
            </div>

            {paymentQrUrl ? (
              <div className="space-y-3">
                <div className="rounded-lg border p-4 bg-white">
                  <img
                    src={paymentQrUrl}
                    alt="Payment QR code"
                    className="w-full max-w-[280px] mx-auto h-auto object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan the QR code with any UPI app to pay.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 flex flex-col items-center gap-2">
                <QrCode className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Payment QR not configured. Please contact us on WhatsApp to complete your purchase.
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Shipping charges</p>
              <p>Shipping charges will be as per actuals and will be shared at the time of shipping (approx. ₹200-400, based on location).</p>
            </div>

            <Button
              onClick={handlePaymentMade}
              className="w-full"
              disabled={recordPaid.isPending || !paymentQrUrl}
            >
              {recordPaid.isPending ? 'Confirming...' : 'Payment Made'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Buy Now</DialogTitle>
        </DialogHeader>

        <div className="bg-accent/50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium">{carrier.brand_name} {carrier.model_name}</p>
          <p className="text-sm text-muted-foreground">Buyout Price: ₹{amount.toLocaleString('en-IN')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buy_customer_name">Full Name</Label>
              <Input
                id="buy_customer_name"
                {...register('customer_name')}
                placeholder="Your name"
              />
              {errors.customer_name && (
                <p className="text-xs text-destructive">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy_phone">Phone Number</Label>
              <Input
                id="buy_phone"
                {...register('phone')}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buy_address">Full Address</Label>
            <textarea
              id="buy_address"
              {...register('address')}
              placeholder="House/flat no., street, area, city, landmark"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buy_pincode">Pincode</Label>
            <Input
              id="buy_pincode"
              {...register('pincode')}
              placeholder="6-digit pincode"
              inputMode="numeric"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-xs text-destructive">{errors.pincode.message}</p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">Buyout Summary</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{carrier.brand_name} {carrier.model_name}</span>
              <span>₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total Payable*</span>
              <span>₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              * shipping charges extra as per actuals (approx. ₹200-400, based on location)
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="buy_terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setValue('agreed_to_terms', checked as boolean, { shouldValidate: true })}
            />
            <Label htmlFor="buy_terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link to="/policies" className="text-primary hover:underline" target="_blank">
                terms & conditions
              </Link>
              , including the buyout and shipping policy.
            </Label>
          </div>
          {errors.agreed_to_terms && (
            <p className="text-xs text-destructive">{errors.agreed_to_terms.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || !agreedToTerms}>
            {isSubmitting ? 'Submitting...' : 'Show QR Code for Payment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
