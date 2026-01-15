'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Receipt, IndianRupee } from 'lucide-react';
import { useState } from 'react';

export default function StudentFeesPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const feesSummary = {
    totalAnnual: 85000,
    paid: 42500,
    pending: 42500,
    dueDate: 'February 15, 2026',
  };

  const pendingFees = [
    { id: '1', type: 'Tuition Fee', amount: 25000, dueDate: 'Feb 15, 2026', quarter: 'Q3' },
    { id: '2', type: 'Lab Fee', amount: 5000, dueDate: 'Feb 15, 2026', quarter: 'Q3' },
    { id: '3', type: 'Library Fee', amount: 2500, dueDate: 'Feb 15, 2026', quarter: 'Q3' },
    { id: '4', type: 'Sports Fee', amount: 5000, dueDate: 'Mar 15, 2026', quarter: 'Q4' },
    { id: '5', type: 'Activity Fee', amount: 5000, dueDate: 'Mar 15, 2026', quarter: 'Q4' },
  ];

  const paymentHistory = [
    { id: 'TXN001', date: 'Jul 10, 2025', type: 'Tuition Fee Q1', amount: 25000, status: 'paid', method: 'UPI' },
    { id: 'TXN002', date: 'Jul 10, 2025', type: 'Lab Fee Q1', amount: 5000, status: 'paid', method: 'UPI' },
    { id: 'TXN003', date: 'Oct 12, 2025', type: 'Tuition Fee Q2', amount: 25000, status: 'paid', method: 'Card' },
    { id: 'TXN004', date: 'Oct 12, 2025', type: 'Library Fee Q2', amount: 2500, status: 'paid', method: 'Card' },
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', desc: 'Pay via Google Pay, PhonePe, Paytm' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  ];

  const totalSelected = pendingFees
    .filter(f => selectedPayment === 'all' || selectedPayment === f.id)
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <CreditCard className="w-7 h-7" />
            Fee Payment
          </h2>
          <p className="text-muted-foreground">View and pay your school fees</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <Download className="w-5 h-5" />
          Download Statement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative rounded-xl border border-border p-1">
          <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.1} borderWidth={2} />
          <div className="relative bg-card rounded-lg p-4">
            <p className="text-muted-foreground text-sm">Total Annual</p>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5" />
              {feesSummary.totalAnnual.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative rounded-xl border border-green-500/30 p-1">
          <div className="relative bg-green-500/10 rounded-lg p-4">
            <p className="text-green-400 text-sm">Amount Paid</p>
            <p className="text-2xl font-bold text-green-400 flex items-center">
              <IndianRupee className="w-5 h-5" />
              {feesSummary.paid.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative rounded-xl border border-orange-500/30 p-1">
          <div className="relative bg-orange-500/10 rounded-lg p-4">
            <p className="text-orange-400 text-sm">Pending Amount</p>
            <p className="text-2xl font-bold text-orange-400 flex items-center">
              <IndianRupee className="w-5 h-5" />
              {feesSummary.pending.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative rounded-xl border border-red-500/30 p-1">
          <div className="relative bg-red-500/10 rounded-lg p-4">
            <p className="text-red-400 text-sm">Next Due Date</p>
            <p className="text-lg font-bold text-red-400">{feesSummary.dueDate}</p>
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
              Pending Fees
            </h3>
            <button
              onClick={() => setSelectedPayment(selectedPayment === 'all' ? null : 'all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedPayment === 'all' ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {selectedPayment === 'all' ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-3">
            {pendingFees.map(fee => (
              <div
                key={fee.id}
                onClick={() => setSelectedPayment(selectedPayment === fee.id ? null : fee.id)}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                  selectedPayment === fee.id || selectedPayment === 'all'
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === fee.id || selectedPayment === 'all'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-muted-foreground'
                  }`}>
                    {(selectedPayment === fee.id || selectedPayment === 'all') && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{fee.type}</p>
                    <p className="text-sm text-muted-foreground">Due: {fee.dueDate} • {fee.quarter}</p>
                  </div>
                </div>
                <p className="text-lg font-bold flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {fee.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pay Now Section */}
          {(selectedPayment) && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium">Total to Pay:</p>
                <p className="text-2xl font-bold text-green-400 flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {(selectedPayment === 'all' ? feesSummary.pending : pendingFees.find(f => f.id === selectedPayment)?.amount || 0).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </button>
                ))}
              </div>

              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-opacity">
                Proceed to Pay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Payment History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Transaction ID</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(payment => (
                  <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-mono text-sm">{payment.id}</td>
                    <td className="p-3">{payment.date}</td>
                    <td className="p-3">{payment.type}</td>
                    <td className="p-3">{payment.method}</td>
                    <td className="p-3 font-medium flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {payment.amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="p-2 rounded hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
