import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemListing, BorrowTransaction } from '../../types';
import { ProductImage } from '../common/ProductImage';
import {
  X,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface DepositCheckoutModalProps {
  item: ItemListing;
  onClose: () => void;
  onSuccess: (tx: BorrowTransaction) => void;
}

export const DepositCheckoutModal: React.FC<DepositCheckoutModalProps> = ({
  item,
  onClose,
  onSuccess
}) => {
  const { createBorrowRequest, processDepositPayment, isDemoMode } = useApp();

  const [durationDays, setDurationDays] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('2026-04-16');
  const [agreedToPolicy, setAgreedToPolicy] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'review' | 'upi_modal' | 'success'>('review');
  const [activeUpiApp, setActiveUpiApp] = useState<string>('gpay');

  const rentalTotal = item.rentalFeePerDay * durationDays;
  const totalPayable = item.securityDeposit + rentalTotal;

  const handleInitiatePayment = () => {
    if (!agreedToPolicy) return;
    setPaymentStep('upi_modal');
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    // Simulate brief payment gateway network call
    setTimeout(async () => {
      const newTx = createBorrowRequest(item.id, startDate, '2026-04-19', durationDays);
      await processDepositPayment(newTx.id, 'DEMO_RAZORPAY_UPI_9921');
      setIsProcessing(false);
      setPaymentStep('success');
      setTimeout(() => {
        onSuccess(newTx);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#28231F]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#DFD5C8] overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFD5C8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-[#28231F]">
              {paymentStep === 'upi_modal' ? 'Simulated UPI Checkout' : 'Security Deposit & Borrow Terms'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#786D65] hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStep === 'review' && (
          <div className="p-6 space-y-5">
            {/* Demo Mode Badge */}
            {isDemoMode && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Simulated Gateway (Demo Mode)</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    This transaction is for evaluation. No real bank charges or UPI transfers will occur.
                  </p>
                </div>
              </div>
            )}

            {/* Item Mini Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F3EC]/60 border border-[#DFD5C8]">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#DFD5C8]">
                <ProductImage
                  src={item.images[0]}
                  alt={item.title}
                  category={item.category}
                  aspectRatio="1/1"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#28231F] truncate">{item.title}</h4>
                <p className="text-[11px] text-[#786D65] mt-0.5">Lender: {item.ownerName}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Pickup: {item.pickupArea}</p>
              </div>
            </div>

            {/* Borrow Dates & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#786D65] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#786D65] mb-1">Duration (Days)</label>
                <select
                  value={durationDays}
                  onChange={e => setDurationDays(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>
            </div>

            {/* Itemized Financial Breakdown */}
            <div className="p-4 rounded-2xl border border-[#DFD5C8] bg-neutral-50/60 space-y-2 text-xs">
              <div className="flex justify-between text-[#786D65]">
                <span>Lender Security Deposit (Refundable)</span>
                <span className="font-semibold text-[#28231F] tabular-nums">₹{item.securityDeposit}</span>
              </div>
              <div className="flex justify-between text-[#786D65]">
                <span>Rental Fee (₹{item.rentalFeePerDay} × {durationDays} days)</span>
                <span className="font-semibold text-[#28231F] tabular-nums">₹{rentalTotal}</span>
              </div>
              <div className="flex justify-between text-[#786D65]">
                <span>LendLoop Platform Protection Fee</span>
                <span className="font-medium text-emerald-700">₹0 (Free Campus Beta)</span>
              </div>
              <div className="pt-2 border-t border-[#DFD5C8] flex justify-between text-sm font-bold text-[#28231F]">
                <span>Total Amount Due</span>
                <span className="text-[#9E6E4F] tabular-nums">₹{totalPayable}</span>
              </div>
              <div className="text-[11px] text-emerald-800 font-medium text-right pt-1">
                ✓ Full ₹{item.securityDeposit} eligible for refund upon undamaged return
              </div>
            </div>

            {/* Official Damage Policy Checkbox */}
            <div className="p-3.5 rounded-2xl border border-[#DFD5C8] bg-white">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={e => setAgreedToPolicy(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#9E6E4F] focus:ring-[#9E6E4F] border-gray-300"
                />
                <div className="text-xs text-[#28231F] leading-snug">
                  <span className="font-semibold">I accept the LendLoop Official Security Policy (Option B):</span>
                  <p className="text-[11px] text-[#786D65] mt-0.5">
                    I understand the ₹{item.securityDeposit} deposit is fully refunded when returned without damage. Deductions are limited to documented, policy-permitted repairs. Handover & return require 6-digit OTP verification.
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#DFD5C8] text-xs font-semibold text-[#28231F] hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInitiatePayment}
                disabled={!agreedToPolicy}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  agreedToPolicy
                    ? 'bg-[#9E6E4F] hover:bg-[#855739] active:scale-95'
                    : 'bg-neutral-300 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Pay ₹{totalPayable}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* UPI Simulation Step */}
        {paymentStep === 'upi_modal' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F3EC] text-[#9E6E4F] flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#28231F]">Simulated UPI Checkout</h3>
              <p className="text-xs text-[#786D65] mt-1">
                Amount payable: <span className="font-bold text-[#28231F]">₹{totalPayable}</span> (includes ₹{item.securityDeposit} refundable deposit)
              </p>
            </div>

            {/* Select UPI App */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'gpay', name: 'Google Pay' },
                { id: 'phonepe', name: 'PhonePe' },
                { id: 'paytm', name: 'Paytm UPI' }
              ].map(app => (
                <button
                  key={app.id}
                  onClick={() => setActiveUpiApp(app.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                    activeUpiApp === app.id
                      ? 'border-[#9E6E4F] bg-[#F7F3EC] text-[#9E6E4F] font-semibold'
                      : 'border-[#DFD5C8] text-[#28231F] hover:bg-neutral-50'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-[#DFD5C8] text-[11px] text-[#786D65]">
              <span>Simulated VPA: </span>
              <span className="font-mono text-[#28231F] font-semibold">aarav.sharma@okhdfcbank</span>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Simulated Deposit Escrow...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authorize ₹{totalPayable} via {activeUpiApp.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Success Animation */}
        {paymentStep === 'success' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#28231F]">Deposit Payment Confirmed!</h3>
            <p className="text-xs text-[#786D65]">
              Security deposit of ₹{item.securityDeposit} safely placed in escrow. Your Handover OTP is generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
