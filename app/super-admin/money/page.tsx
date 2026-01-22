'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Download,
  Filter,
  Calendar,
  Users,
  Building,
  Activity,
  IndianRupee,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SuperAdminMoneyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'income' | 'transactions'>('overview');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions and stats
      const txnRes = await fetch('/api/transactions');
      if (txnRes.ok) {
        const txnData = await txnRes.json();
        setTransactions(txnData.transactions || []);
        setStats(txnData.stats || { totalIncome: 0, totalExpense: 0, balance: 0 });
      }

      // Fetch expenses
      const expRes = await fetch('/api/expenses');
      if (expRes.ok) {
        const expData = await expRes.json();
        setExpenses(expData.expenses || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (res.ok) {
        setShowExpenseModal(false);
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const categoryIcons: Record<string, any> = {
    teacher_salary: Users,
    staff_salary: Users,
    building_maintenance: Building,
    utilities: Activity,
    activities: Activity,
    supplies: DollarSign,
    equipment: DollarSign,
  };

  const categoryColors: Record<string, string> = {
    teacher_salary: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    staff_salary: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    building_maintenance: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    utilities: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    activities: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    supplies: 'text-green-400 bg-green-500/10 border-green-500/30',
    equipment: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  };

  // Calculate category-wise breakdown
  const expenseByCategory = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wallet className="w-7 h-7" />
            Money Management
          </h2>
          <p className="text-muted-foreground">Track income, expenses, and financial health</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-xl border border-green-500/30 p-1">
          <div className="relative bg-green-500/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-400 text-sm font-medium">Total Income</p>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400 flex items-center">
              <IndianRupee className="w-6 h-6" />
              {stats.totalIncome.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">From student fees</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-red-500/30 p-1">
          <div className="relative bg-red-500/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-400 text-sm font-medium">Total Expenses</p>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-red-400 flex items-center">
              <IndianRupee className="w-6 h-6" />
              {stats.totalExpense.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">All categories</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Net Balance</p>
              <Wallet className="w-5 h-5" />
            </div>
            <p className={`text-3xl font-bold flex items-center ${stats.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <IndianRupee className="w-6 h-6" />
              {Math.abs(stats.balance).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {['overview', 'expenses', 'income', 'transactions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Expense by Category */}
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(expenseByCategory).map(([category, amount]: [string, any]) => {
                  const Icon = categoryIcons[category] || DollarSign;
                  const colorClass = categoryColors[category] || 'text-gray-400 bg-gray-500/10 border-gray-500/30';
                  
                  return (
                    <div key={category} className={`p-4 rounded-lg border ${colorClass}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5" />
                        <p className="font-medium capitalize">{category.replace(/_/g, ' ')}</p>
                      </div>
                      <p className="text-2xl font-bold flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {amount.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="relative rounded-2xl border border-border p-1">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="relative bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 10).map((txn) => (
                  <div key={txn._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(txn.date).toLocaleDateString()} • {txn.category.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <p className={`text-lg font-bold flex items-center ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.type === 'income' ? '+' : '-'}
                      <IndianRupee className="w-4 h-4" />
                      {txn.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">All Expenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-left p-3 font-medium">Recipient</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp._id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="p-3 capitalize">{exp.category.replace(/_/g, ' ')}</td>
                      <td className="p-3">{exp.description}</td>
                      <td className="p-3">{exp.recipient || '-'}</td>
                      <td className="p-3 font-medium flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {exp.amount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          exp.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          exp.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Income Transactions</h3>
            <div className="space-y-3">
              {transactions.filter(t => t.type === 'income').map((txn) => (
                <div key={txn._id} className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString()} • {txn.paymentMethod || 'N/A'}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-400 flex items-center">
                    +<IndianRupee className="w-5 h-5" />
                    {txn.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="relative rounded-2xl border border-border p-1">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {txn.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(txn.date).toLocaleDateString()} • {txn.category.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <p className={`text-lg font-bold flex items-center ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {txn.type === 'income' ? '+' : '-'}
                    <IndianRupee className="w-4 h-4" />
                    {txn.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <ExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
}

// Expense Modal Component
function ExpenseModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    category: 'teacher_salary',
    amount: '',
    description: '',
    recipient: '',
    paymentMethod: 'bank_transfer',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
        <h3 className="text-xl font-bold mb-4">Add Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
            >
              <option value="teacher_salary">Teacher Salary</option>
              <option value="staff_salary">Staff Salary</option>
              <option value="building_maintenance">Building Maintenance</option>
              <option value="utilities">Utilities</option>
              <option value="activities">Activities</option>
              <option value="supplies">Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Recipient (Optional)</label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 rounded-lg bg-muted border border-border"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
