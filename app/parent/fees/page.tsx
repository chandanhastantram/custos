'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CreditCard, CheckCircle, Clock, Download, Receipt, IndianRupee, Users, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { PaymentModal } from '@/components/PaymentModal';
import { useSession } from 'next-auth/react';

export default function ParentFeesPage() {
  const { data: session } = useSession();
  const [selectedChild, setSelectedChild] = useState('Alice');
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const children = ['Alice', 'Bob'];

  const childrenFees: Record<string, {
    totalAnnual: number;
    paid: number;
    pending: number;
    dueDate: string;
    class: string;
    pendingFees: { id: string; type: string; amount: number; dueDate: string }[];
    history: { id: string; date: string; type: string; amount: number; status: string }[];
  }> = {
    'Alice': {
      totalAnnual: 85000,
      paid: 42500,
      pending: 42500,
      dueDate: 'Feb 15, 2026',
      class: '10A',
      pendingFees: [
        { id: 'a1', type: 'Tuition Fee Q3', amount: 25000, dueDate: 'Feb 15, 2026' },
        { id: 'a2', type: 'Lab Fee Q3', amount: 5000, dueDate: 'Feb 15, 2026' },
        { id: 'a3', type: 'Library Fee', amount: 2500, dueDate: 'Feb 15, 2026' },
        { id: 'a4', type: 'Tuition Fee Q4', amount: 10000, dueDate: 'Mar 15, 2026' },
      ],
      history: [
        { id: 'TXN001', date: 'Jul 10, 2025', type: 'Tuition Fee Q1', amount: 25000, status: 'paid' },
        { id: 'TXN002', date: 'Oct 12, 2025', type: 'Tuition Fee Q2', amount: 17500, status: 'paid' },
      ],
    },
    'Bob': {
      totalAnnual: 65000,
      paid: 32500,
      pending: 32500,
      dueDate: 'Feb 15, 2026',
      class: '7B',
      pendingFees: [
        { id: 'b1', type: 'Tuition Fee Q3', amount: 20000, dueDate: 'Feb 15, 2026' },
        { id: 'b2', type: 'Activity Fee', amount: 5000, dueDate: 'Feb 15, 2026' },
        { id: 'b3', type: 'Sports Fee', amount: 7500, dueDate: 'Mar 15, 2026' },
      ],
      history: [
        { id: 'TXN003', date: 'Jul 10, 2025', type: 'Tuition Fee Q1', amount: 20000, status: 'paid' },
        { id: 'TXN004', date: 'Oct 12, 2025', type: 'Tuition Fee Q2', amount: 12500, status: 'paid' },
      ],
    },
  };

  const currentChild = childrenFees[selectedChild];
  const totalSelectedAmount = currentChild.pendingFees
    .filter(f => selectedFees.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPendingAllChildren = Object.values(childrenFees).reduce((sum, c) => sum + c.pending, 0);

  const toggleFee = (id: string) => {
    setSelectedFees(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedFees(currentChild.pendingFees.map(f => f.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <CreditCard className="w-7 h-7" />
            Fee Payment
          </h2>
          <p className="text-muted-foreground">Manage and pay fees for your children</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedChild}
            onChange={(e) => {
              setSelectedChild(e.target.value);
              setSelectedFees([]);
            }}
            className="px-4 py-2 rounded-lg bg-card border border-border focus:border-blue-500 focus:outline-none"
          >
            {children.map(child => (
              <option key={child} value={child}>{child}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              const csv = `Fee Statement for ${selectedChild}\nType,Amount,Status,Date\n${currentChild.history.map(h => `${h.type},₹${h.amount},${h.status},${h.date}`).join('\n')}\n${currentChild.pendingFees.map(f => `${f.type},₹${f.amount},pending,${f.dueDate}`).join('\n')}`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `fee_statement_${selectedChild.toLowerCase()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Download className="w-5 h-5" />
            Statement
          </button>
        </div>
      </div>

      {/* Total Alert */}
      {totalPendingAllChildren > 0 && (
        <div className="relative rounded-xl border border-orange-500/30 p-1">
          <div className="relative bg-orange-500/10 rounded-lg p-4 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <div>
              <p className="font-medium text-orange-200">Total Pending for All Children</p>
              <p className="text-2xl font-bold text-orange-400 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {totalPendingAllChildren.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Child Info */}
      <div className="relative rounded-xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-lg p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {selectedChild.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{selectedChild}</h3>
            <p className="text-muted-foreground">Class {currentChild.class}</p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
                {currentChild.totalAnnual.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-400">Paid</p>
              <p className="text-xl font-bold text-green-400 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
                {currentChild.paid.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-orange-400">Pending</p>
              <p className="text-xl font-bold text-orange-400 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
                {currentChild.pending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Fees */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Pending Fees - {selectedChild}
            </h3>
            <button
              onClick={selectAll}
              className="px-3 py-1 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors"
            >
              Select All
            </button>
          </div>

          <div className="space-y-3">
            {currentChild.pendingFees.map(fee => (
              <div
                key={fee.id}
                onClick={() => toggleFee(fee.id)}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                  selectedFees.includes(fee.id)
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedFees.includes(fee.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedFees.includes(fee.id) && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium">{fee.type}</p>
                    <p className="text-sm text-muted-foreground">Due: {fee.dueDate}</p>
                  </div>
                </div>
                <p className="text-lg font-bold flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {fee.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Payment Section */}
          {selectedFees.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">Selected {selectedFees.length} item(s)</p>
                  <p className="text-2xl font-bold text-green-400 flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {totalSelectedAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFees([])}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear Selection
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-center">
                  <p className="text-xl mb-1">📱</p>
                  <p className="text-sm font-medium">UPI</p>
                </button>
                <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-center">
                  <p className="text-xl mb-1">💳</p>
                  <p className="text-sm font-medium">Card</p>
                </button>
                <button className="p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-center">
                  <p className="text-xl mb-1">🏦</p>
                  <p className="text-sm font-medium">Net Banking</p>
                </button>
              </div>

              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Pay ₹{totalSelectedAmount.toLocaleString()} Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedFees.length > 0 && session?.user && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          studentId={selectedChild} // In real app, this would be the child's user ID
          feeComponents={currentChild.pendingFees
            .filter(f => selectedFees.includes(f.id))
            .map(f => ({ type: f.type, amount: f.amount }))}
          totalAmount={totalSelectedAmount}
          onSuccess={(paymentData) => {
            console.log('Payment successful:', paymentData);
            // Refresh the page or update state
            window.location.reload();
          }}
        />
      )}

      {/* Payment History */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Payment History - {selectedChild}
          </h3>

          <div className="space-y-3">
            {currentChild.history.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.type}</p>
                    <p className="text-sm text-muted-foreground">{payment.date} • {payment.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {payment.amount.toLocaleString()}
                  </p>
                  <button className="p-2 rounded hover:bg-muted transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
