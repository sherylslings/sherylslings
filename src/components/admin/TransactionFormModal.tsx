import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionFormModal = ({ open, onOpenChange }: Props) => {
  const [type, setType] = useState<'income' | 'expense' | 'deposit_in' | 'deposit_out'>('income');
  const [category, setCategory] = useState('rental');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const createTransaction = useCreateTransaction();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction.mutateAsync({
        type,
        category,
        amount: parseFloat(amount),
        description: description || null,
        customer_name: customerName || null,
        transaction_date: transactionDate,
        booking_id: null,
        carrier_id: null,
      });
      toast({ title: 'Transaction added!' });
      onOpenChange(false);
      setAmount('');
      setDescription('');
      setCustomerName('');
    } catch {
      toast({ variant: 'destructive', title: 'Failed to add transaction' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="deposit_in">Deposit In</SelectItem>
                  <SelectItem value="deposit_out">Deposit Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="buyout">Buyout</SelectItem>
                  <SelectItem value="laundry">Laundry</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes" />
          </div>
          <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
            {createTransaction.isPending ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionFormModal;
