import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BorrowTransaction } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Camera,
  KeyRound,
  AlertTriangle,
  Receipt,
  RotateCcw,
  MessageSquare,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { calculateSettlement } from '../../utils/settlementCalculator';

interface TransactionDetailScreenProps {
  transaction: BorrowTransaction;
  onBack: () => void;
  onOpenChat: (txId: string) => void;
}

export const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({
  transaction,
  onBack,
  onOpenChat
}) => {
  const {
    currentUser,
    verifyHandover,
    initiateReturn,
    verifyReturnInspection,
    settleTransactionRefund,
    submitDispute
  } = useApp();

  const [handoverInputOtp, setHandoverInputOtp] = useState<string>('');
  const [returnInputOtp, setReturnInputOtp] = useState<string>('');
  const [damageAmount, setDamageAmount] = useState<number>(0);
  const [damageDescription, setDamageDescription] = useState<string>('');
  const [inspectionNotes, setInspectionNotes] = useState<string>('Item returned in good condition. Accessories complete.');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [showDisputeForm, setShowDisputeForm] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const isBorrower = currentUser ? currentUser.id === transaction.borrowerId : false;
  const isOwner = currentUser ? currentUser.id === transaction.ownerId : false;

  // Handle Handover OTP Verification
  const handleVerifyHandover = () => {
    setActionError('');
    if (!handoverInputOtp) {
      setActionError('Please enter the 6-digit Handover OTP.');
      return;
    }
    const success = verifyHandover(
      transaction.id,
      handoverInputOtp,
      'Handover verified in-person. Item inspected and working.',
      [transaction.listingImage]
    );
    if (success) {
      setActionSuccess('Handover successfully verified! Active borrowing period has started.');
    } else {
      setActionError(`Incorrect OTP. Please enter the valid OTP: ${transaction.handoverOtp}`);
    }
  };

  // Handle Return Initiation
  const handleInitiateReturn = () => {
    initiateReturn(transaction.id);
    setActionSuccess('Return initiated. Meet the lender to verify condition and provide your Return OTP.');
  };

  // AI-Assisted Difference Analysis simulation
  const handleRunAiInspection = () => {
    setAiAnalysisRunning(true);
    setTimeout(() => {
      setAiAnalysisRunning(false);
      if (damageAmount > 0) {
        setAiSuggestions('AI Visual Comparison: Detected surface scuff on casing. Verified repair/replacement estimate aligns with standard component tier (₹30 - ₹50). No structural damage detected.');
      } else {
        setAiSuggestions('AI Visual Comparison: Zero detected scratches or cracks. All accessory elements present in returned frame. 100% deposit refund recommended.');
      }
    }, 900);
  };

  // Handle Return Verification
  const handleVerifyReturn = () => {
    setActionError('');
    if (!returnInputOtp) {
      setActionError('Please enter the 6-digit Return OTP provided by borrower.');
      return;
    }
    const success = verifyReturnInspection(
      transaction.id,
      returnInputOtp,
      damageAmount,
      inspectionNotes,
      [transaction.listingImage],
      damageAmount > 0 ? damageDescription : undefined
    );

    if (success) {
      setActionSuccess('Return inspection recorded! Review the settlement breakdown below.');
    } else {
      setActionError(`Invalid Return OTP. Provide the matching code: ${transaction.returnOtp}`);
    }
  };

  // Settlement calculations
  const settlementPreview = calculateSettlement({
    depositInInr: transaction.securityDeposit,
    approvedDamageInInr: transaction.settlement?.approvedDamageDeduction || damageAmount,
    isDisputed: transaction.status === 'DISPUTED'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DFD5C8]">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-[#9E6E4F] hover:underline mb-1 cursor-pointer flex items-center gap-1"
          >
            ← Back to Activity
          </button>
          <h1 className="text-lg font-bold text-[#28231F]">Transaction #{transaction.id}</h1>
          <p className="text-xs text-[#786D65]">
            {transaction.listingTitle} · {transaction.startDate} to {transaction.endDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenChat(transaction.id)}
            className="px-3.5 py-2 rounded-xl border border-[#DFD5C8] text-xs font-semibold text-[#28231F] hover:bg-[#F7F3EC] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#9E6E4F]" />
            <span>Chat ({isBorrower ? transaction.ownerName : transaction.borrowerName})</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-[#28231F] text-white text-xs font-semibold">
            {transaction.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Transaction Progress Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8]">
        <h3 className="text-xs font-bold text-[#786D65] uppercase tracking-wider mb-4">
          Lifecycle State Timeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            {
              label: '1. Deposit Confirmed',
              done: ['HANDOVER_PENDING', 'ACTIVE_BORROW', 'RETURN_REQUESTED', 'RETURN_INSPECTION', 'REFUND_PENDING', 'COMPLETED'].includes(transaction.status),
              active: transaction.status === 'HANDOVER_PENDING'
            },
            {
              label: '2. Handover & OTP',
              done: ['ACTIVE_BORROW', 'RETURN_REQUESTED', 'RETURN_INSPECTION', 'REFUND_PENDING', 'COMPLETED'].includes(transaction.status),
              active: transaction.status === 'ACTIVE_BORROW'
            },
            {
              label: '3. Return Inspection',
              done: ['REFUND_PENDING', 'COMPLETED'].includes(transaction.status),
              active: transaction.status === 'RETURN_INSPECTION' || transaction.status === 'RETURN_REQUESTED'
            },
            {
              label: '4. Refund Settled',
              done: transaction.status === 'COMPLETED',
              active: transaction.status === 'REFUND_PENDING'
            }
          ].map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                step.done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold'
                  : step.active
                  ? 'border-[#9E6E4F] bg-[#F7F3EC] text-[#9E6E4F] font-bold ring-1 ring-[#9E6E4F]'
                  : 'border-[#DFD5C8] text-[#786D65]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-[#786D65] shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Deposit & Escrow Summary Box */}
      <div className="bg-[#F7F3EC] rounded-2xl border border-[#9E6E4F]/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-[#28231F]">LendLoop Escrow Protection</h3>
          </div>
          <span className="text-xs bg-white px-2.5 py-1 rounded-md text-emerald-800 font-semibold border border-emerald-200">
            Funds Safeguarded
          </span>
        </div>
        <p className="text-xs text-[#786D65] leading-relaxed">
          Refundable Security Deposit of <span className="font-bold text-[#28231F] tabular-nums">₹{transaction.securityDeposit}</span> is held under LendLoop Option B Policy. 100% of the deposit is refunded if returned undamaged. No deduction can occur without verified physical inspection and borrower concurrence or admin arbitration.
        </p>
      </div>

      {/* STEP 1: Handover Verification Phase */}
      {transaction.status === 'HANDOVER_PENDING' && (
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#28231F]">
            <KeyRound className="w-4 h-4 text-[#9E6E4F]" />
            <span>Step 2: Physical Handover & OTP Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-2">
              <h4 className="text-xs font-bold text-[#28231F]">Borrower OTP Display</h4>
              <p className="text-xs text-[#786D65]">
                Show this 6-digit code to the lender only after physically inspecting the item and included accessories:
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#DFD5C8] text-center">
                <span className="font-mono text-xl font-bold tracking-widest text-[#9E6E4F]">
                  {transaction.handoverOtp}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-3">
              <h4 className="text-xs font-bold text-[#28231F]">Lender OTP Entry</h4>
              <p className="text-xs text-[#786D65]">
                Enter the OTP provided by the borrower to confirm handover and start borrowing:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={handoverInputOtp}
                  onChange={e => setHandoverInputOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
                <button
                  onClick={handleVerifyHandover}
                  className="px-4 py-2 bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Confirm Handover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Active Borrow Phase */}
      {transaction.status === 'ACTIVE_BORROW' && (
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#28231F]">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Borrowing is Active</span>
            </div>
            <span className="text-xs text-[#786D65]">Return Due: {transaction.endDate}</span>
          </div>

          <p className="text-xs text-[#786D65]">
            The item is currently in use. When you are ready to return the item, click Initiate Return below to coordinate with the lender.
          </p>

          <div className="p-4 rounded-xl bg-neutral-50 border border-[#DFD5C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#28231F]">Ready to return?</h4>
              <p className="text-xs text-[#786D65]">
                Ensure all accessories are packed and condition is clean before handover.
              </p>
            </div>
            <button
              onClick={handleInitiateReturn}
              className="px-5 py-2.5 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Initiate Return Flow
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Return Inspection & Condition Check Phase */}
      {(transaction.status === 'RETURN_REQUESTED' || transaction.status === 'RETURN_INSPECTION') && (
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#28231F]">
              <RotateCcw className="w-4 h-4 text-[#9E6E4F]" />
              <span>Return Verification & Option B Inspection</span>
            </div>
            <button
              onClick={handleRunAiInspection}
              disabled={aiAnalysisRunning}
              className="px-3 py-1.5 rounded-xl border border-[#9E6E4F]/40 bg-[#F7F3EC] text-[#9E6E4F] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F2EBE1] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiAnalysisRunning ? 'Analyzing...' : 'AI Condition Assistant'}</span>
            </button>
          </div>

          {aiSuggestions && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Automated Inspection Suggestion (Non-binding advisory)</p>
                <p className="text-[11px] text-purple-800 mt-0.5">{aiSuggestions}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Borrower Return OTP */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-2">
              <h4 className="text-xs font-bold text-[#28231F]">Borrower Return OTP</h4>
              <p className="text-xs text-[#786D65]">
                Provide this OTP to the lender during return inspection:
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#DFD5C8] text-center">
                <span className="font-mono text-xl font-bold tracking-widest text-emerald-700">
                  {transaction.returnOtp}
                </span>
              </div>
            </div>

            {/* Lender Condition Verification Form */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-3">
              <h4 className="text-xs font-bold text-[#28231F]">Lender Return Checklist</h4>

              <div>
                <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
                  Damage Repair Deduction (INR)
                </label>
                <input
                  type="number"
                  min={0}
                  max={transaction.securityDeposit}
                  value={damageAmount}
                  onChange={e => setDamageAmount(Number(e.target.value))}
                  placeholder="0 for undamaged return"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
                <span className="text-[10px] text-[#786D65]">
                  Set ₹0 if returned in agreed condition (full ₹{transaction.securityDeposit} refund).
                </span>
              </div>

              {damageAmount > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
                    Documented Justification
                  </label>
                  <input
                    type="text"
                    value={damageDescription}
                    onChange={e => setDamageDescription(e.target.value)}
                    placeholder="e.g., Replacement 6mm drill bit cost"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
                  Enter Borrower's Return OTP
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={returnInputOtp}
                    onChange={e => setReturnInputOtp(e.target.value)}
                    placeholder="6-digit Return OTP"
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                  />
                  <button
                    onClick={handleVerifyReturn}
                    className="px-4 py-2 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Verify & Settle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Refund Settlement Review & Completion */}
      {(transaction.status === 'REFUND_PENDING' || transaction.status === 'COMPLETED') && (
        <div className="bg-white p-6 rounded-2xl border border-[#DFD5C8] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#28231F]">
              <Receipt className="w-4 h-4 text-emerald-700" />
              <span>Official Settlement Breakdown Receipt</span>
            </div>
            {transaction.status === 'COMPLETED' ? (
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Refund Released
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold">
                Settlement Pending
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl border border-[#DFD5C8] bg-neutral-50 space-y-2 text-xs">
            <div className="flex justify-between text-[#786D65]">
              <span>Security Deposit Placed in Escrow</span>
              <span className="font-semibold text-[#28231F] tabular-nums">₹{transaction.securityDeposit}</span>
            </div>
            <div className="flex justify-between text-[#786D65]">
              <span>Rental Charges Settled</span>
              <span className="font-semibold text-[#28231F] tabular-nums">₹{transaction.rentalFee}</span>
            </div>
            <div className="flex justify-between text-[#786D65]">
              <span>Verified Damage Deduction (Policy Permitted)</span>
              <span className="font-semibold text-red-600 tabular-nums">
                -₹{transaction.settlement?.approvedDamageDeduction ?? 0}
              </span>
            </div>
            <div className="pt-2 border-t border-[#DFD5C8] flex justify-between text-base font-bold text-[#28231F]">
              <span>Eligible Deposit Refund to Borrower</span>
              <span className="text-emerald-700 tabular-nums">
                ₹{transaction.settlement?.eligibleRefund ?? transaction.securityDeposit}
              </span>
            </div>
            {transaction.settlement?.paymentGatewayRef && (
              <p className="text-[11px] text-[#786D65] pt-1">
                Gateway Reference: <span className="font-mono text-[#28231F]">{transaction.settlement.paymentGatewayRef}</span>
              </p>
            )}
          </div>

          {transaction.status === 'REFUND_PENDING' && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDisputeForm(true)}
                className="px-4 py-2 rounded-xl border border-[#DFD5C8] text-xs font-semibold text-[#786D65] hover:text-red-600 transition-colors cursor-pointer"
              >
                Dispute Deduction
              </button>
              <button
                onClick={() => settleTransactionRefund(transaction.id)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Release Eligible Refund
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dispute Modal/Section */}
      {showDisputeForm && (
        <div className="bg-red-50/70 p-6 rounded-2xl border border-red-200 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-red-900">
            <ShieldAlert className="w-5 h-5 text-red-700" />
            <span>Open LendLoop Dispute Mediation</span>
          </div>
          <p className="text-xs text-red-800">
            Under LendLoop rules, disputed deductions immediately freeze deposit settlement. Neither party will receive contested funds until Trust & Safety reviews before-and-after photo evidence.
          </p>
          <textarea
            rows={3}
            value={disputeReason}
            onChange={e => setDisputeReason(e.target.value)}
            placeholder="Explain why the deduction is unjustified or specify pre-existing condition..."
            className="w-full p-3 rounded-xl border border-red-200 bg-white text-xs outline-none focus:ring-1 focus:ring-red-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDisputeForm(false)}
              className="px-3.5 py-1.5 text-xs text-[#786D65] hover:text-[#28231F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!disputeReason.trim()) return;
                submitDispute(transaction.id, disputeReason, [transaction.listingImage]);
                setShowDisputeForm(false);
                setActionSuccess('Dispute registered. An administrator has been assigned to mediate.');
              }}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Submit for Admin Review
            </button>
          </div>
        </div>
      )}

      {/* Disputed State Notice */}
      {transaction.status === 'DISPUTED' && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>Dispute Under Official Review</span>
          </div>
          <p>
            Reason: <span className="font-semibold text-amber-950">{transaction.disputeReason}</span>
          </p>
          <p className="text-[11px] text-amber-800">
            Settlement is paused. Switch to the Staff Moderator role via the top right dropdown to review evidence and arbitrate this case.
          </p>
        </div>
      )}
    </div>
  );
};
