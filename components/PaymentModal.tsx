'use client';

import { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle, XCircle, IndianRupee } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  feeComponents: Array<{
    type: string;
    amount: number;
    quarter?: string;
  }>;
  totalAmount: number;
  onSuccess?: (paymentData: any) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  studentId,
  feeComponents,
  totalAmount,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (method: string) => {
    try {
      setLoading(true);
      setStatus('processing');
      setErrorMessage('');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      // Initiate payment
      const initiateRes = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          feeComponents,
          totalAmount,
        }),
      });

      if (!initiateRes.ok) {
        const errorData = await initiateRes.json();
        throw new Error(errorData.error || 'Failed to initiate payment');
      }

      const { orderId, amount, currency, keyId, paymentId } = await initiateRes.json();

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount * 100, // Convert to paise
        currency: currency,
        name: 'CUSTOS School',
        description: 'Fee Payment',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: paymentId,
                paymentMethod: method,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyRes.json();
            setStatus('success');
            
            // Call success callback
            if (onSuccess) {
              onSuccess(verifyData.payment);
            }

            // Close modal after 2 seconds
            setTimeout(() => {
              onClose();
              setStatus('idle');
            }, 2000);
          } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatus('idle');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Complete Payment
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Payment Successful!</p>
              <p className="text-sm text-green-300">Your payment has been processed.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Payment Failed</p>
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Amount Summary */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
          <p className="text-3xl font-bold flex items-center">
            <IndianRupee className="w-6 h-6" />
            {totalAmount.toLocaleString()}
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Fee Components:</p>
            {feeComponents.map((comp, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{comp.type}</span>
                <span className="font-medium flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {comp.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        {status === 'idle' && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground mb-3">Select Payment Method</p>
            
            <button
              onClick={() => handlePayment('upi')}
              disabled={loading}
              className="w-full p-4 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-3xl">📱</div>
              <div className="flex-1">
                <p className="font-medium">UPI</p>
                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
              </div>
            </button>

            <button
              onClick={() => handlePayment('card')}
              disabled={loading}
              className="w-full p-4 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-3xl">💳</div>
              <div className="flex-1">
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
              </div>
            </button>

            <button
              onClick={() => handlePayment('netbanking')}
              disabled={loading}
              className="w-full p-4 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-blue-500 transition-all text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-3xl">🏦</div>
              <div className="flex-1">
                <p className="font-medium">Net Banking</p>
                <p className="text-xs text-muted-foreground">All major banks supported</p>
              </div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && status === 'processing' && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <p className="text-muted-foreground">Initializing payment...</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
