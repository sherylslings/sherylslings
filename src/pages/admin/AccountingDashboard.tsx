import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/hooks/useTransactions';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['hsl(25, 95%, 53%)', 'hsl(200, 70%, 50%)', 'hsl(150, 60%, 45%)', 'hsl(45, 90%, 50%)', 'hsl(280, 60%, 55%)', 'hsl(0, 70%, 55%)'];

const AccountingDashboard = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(now, 'yyyy-MM'));
  const { data: transactions, isLoading } = useTransactions(selectedMonth);
  const { data: allTransactions } = useTransactions();

  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const d = subMonths(now, i);
      result.push({ value: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy') });
    }
    return result;
  }, []);

  const stats = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, depositsHeld: 0, profit: 0 };
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const depIn = transactions.filter(t => t.type === 'deposit_in').reduce((s, t) => s + Number(t.amount), 0);
    const depOut = transactions.filter(t => t.type === 'deposit_out').reduce((s, t) => s + Number(t.amount), 0);
    return { income, expenses, depositsHeld: depIn - depOut, profit: income - expenses };
  }, [transactions]);

  const outstandingDeposits = useMemo(() => {
    if (!allTransactions) return 0;
    const depIn = allTransactions.filter(t => t.type === 'deposit_in').reduce((s, t) => s + Number(t.amount), 0);
    const depOut = allTransactions.filter(t => t.type === 'deposit_out').reduce((s, t) => s + Number(t.amount), 0);
    return depIn - depOut;
  }, [allTransactions]);

  const categoryData = useMemo(() => {
    if (!transactions) return [];
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold">Accounting</h2>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map(m => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{fmt(stats.income)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
                <TrendingDown className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{fmt(stats.expenses)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                <IndianRupee className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {fmt(stats.profit)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Deposits</CardTitle>
                <Wallet className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{fmt(outstandingDeposits)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* P&L Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Profit & Loss Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Income</span>
                    <span className="font-medium text-green-600">{fmt(stats.income)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Total Expenses</span>
                    <span className="font-medium text-destructive">-{fmt(stats.expenses)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Deposits Received</span>
                    <span className="font-medium text-blue-600">{fmt(transactions?.filter(t => t.type === 'deposit_in').reduce((s, t) => s + Number(t.amount), 0) || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Deposits Refunded</span>
                    <span className="font-medium text-yellow-600">-{fmt(transactions?.filter(t => t.type === 'deposit_out').reduce((s, t) => s + Number(t.amount), 0) || 0)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-semibold text-lg">
                    <span>Net Profit</span>
                    <span className={stats.profit >= 0 ? 'text-green-600' : 'text-destructive'}>{fmt(stats.profit)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Income by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No income data for this month</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountingDashboard;
