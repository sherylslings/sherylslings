import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTransactions, useDeleteTransaction, useCreateTransaction, type Transaction } from '@/hooks/useTransactions';
import { useToast } from '@/hooks/use-toast';
import TransactionFormModal from '@/components/admin/TransactionFormModal';

const typeColors: Record<string, string> = {
  income: 'bg-green-100 text-green-800',
  expense: 'bg-red-100 text-red-800',
  deposit_in: 'bg-blue-100 text-blue-800',
  deposit_out: 'bg-yellow-100 text-yellow-800',
};

const typeLabels: Record<string, string> = {
  income: 'Income',
  expense: 'Expense',
  deposit_in: 'Deposit In',
  deposit_out: 'Deposit Out',
};

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction.mutateAsync(id);
      toast({ title: 'Transaction deleted' });
    } catch {
      toast({ variant: 'destructive', title: 'Failed to delete' });
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      toast({ variant: 'destructive', title: 'CSV must have a header row and data' });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const typeIdx = headers.indexOf('type');
    const catIdx = headers.indexOf('category');
    const amtIdx = headers.indexOf('amount');
    const descIdx = headers.indexOf('description');
    const dateIdx = headers.indexOf('date');
    const custIdx = headers.indexOf('customer_name');

    if (amtIdx === -1 || dateIdx === -1) {
      toast({ variant: 'destructive', title: 'CSV must have "amount" and "date" columns' });
      return;
    }

    let imported = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      try {
        await createTransaction.mutateAsync({
          type: (typeIdx >= 0 ? cols[typeIdx] : 'income') as 'income' | 'expense' | 'deposit_in' | 'deposit_out',
          category: catIdx >= 0 ? cols[catIdx] : 'other',
          amount: parseFloat(cols[amtIdx]),
          description: descIdx >= 0 ? cols[descIdx] || null : null,
          customer_name: custIdx >= 0 ? cols[custIdx] || null : null,
          transaction_date: cols[dateIdx],
          booking_id: null,
          carrier_id: null,
        });
        imported++;
      } catch {
        console.error(`Failed to import row ${i + 1}`);
      }
    }

    toast({ title: `Imported ${imported} transactions` });
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">All Transactions</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <label>
              <Upload className="w-4 h-4" />
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
            </label>
          </Button>
          <Button size="sm" className="gap-2" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{format(new Date(tx.transaction_date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={typeColors[tx.type]}>{typeLabels[tx.type]}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{tx.category}</TableCell>
                      <TableCell>{tx.customer_name || '—'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{tx.description || '—'}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={tx.type === 'expense' || tx.type === 'deposit_out' ? 'text-destructive' : 'text-green-600'}>
                          {tx.type === 'expense' || tx.type === 'deposit_out' ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tx.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
          )}
        </CardContent>
      </Card>

      <TransactionFormModal open={showForm} onOpenChange={setShowForm} />
    </div>
  );
};

export default Transactions;
