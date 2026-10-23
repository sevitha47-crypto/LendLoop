import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  History,
  Layers,
  Users,
  Search,
  Filter,
  ArrowRight,
  Code2
} from 'lucide-react';
import { ALL_CATEGORIES } from '../../data/mockData';
import { FlutterArchitectureScreen } from './FlutterArchitectureScreen';

export const AdminDashboardScreen: React.FC = () => {
  const {
    currentUser,
    switchUser,
    transactions,
    resolveDisputeByAdmin,
    auditLogs,
    listings,
    toggleListingStatus
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'disputes' | 'listings' | 'logs' | 'specs'>('disputes');
  const [selectedDisputeTxId, setSelectedDisputeTxId] = useState<string>('');
  const [arbitratedDeduction, setArbitratedDeduction] = useState<number>(30);
  const [arbitrationNote, setArbitrationNote] = useState<string>('Standard component accessory replacement fee verified from authorized store invoice.');
  const [resolvedNotice, setResolvedNotice] = useState<string>('');

  const isAdmin = currentUser?.role === 'admin';

  const disputedTransactions = transactions.filter(t => t.status === 'DISPUTED' || (t.settlement?.approvedDamageDeduction ?? 0) > 0);

  const handleArbitrate = (txId: string) => {
    resolveDisputeByAdmin(txId, arbitratedDeduction, arbitrationNote);
    setResolvedNotice(`Dispute arbitrated successfully. Settled approved repair deduction of ₹${arbitratedDeduction} and released balance to borrower.`);
  };

  return (
    <div className="space-y-6">
      {/* Role Verification Notice */}
      {!isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="font-bold">Administrative Access Restricted</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                You are currently previewing as {currentUser?.name || 'Guest'} ({currentUser?.role || 'user'}). Admin actions require Trust & Safety privileges.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchUser('user_admin')}
            className="px-3.5 py-1.5 bg-[#28231F] text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
          >
            Switch to Staff Moderator
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#28231F] rounded-3xl p-6 sm:p-8 text-[#F7F3EC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E6E4F] uppercase tracking-wider mb-2">
            <Gavel className="w-4 h-4" />
            <span>Trust & Safety Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            LendLoop Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[#DFD5C8]/80">
            Arbitrate damage claims under Option B policy, moderate campus listings, and audit deposit escrow settlements.
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-[#F7F3EC]/70 block">Escrow Active</span>
            <span className="text-lg font-bold text-[#F7F3EC] tabular-nums">₹1,830</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-[#F7F3EC]/70 block">Dispute Rate</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">1.2%</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-[#F7F3EC]/70 block">On-Time Return</span>
            <span className="text-lg font-bold text-[#9E6E4F] tabular-nums">98.5%</span>
          </div>
        </div>
      </div>

      {resolvedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{resolvedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DFD5C8] pb-2">
        <button
          onClick={() => setActiveAdminTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'disputes' ? 'bg-[#28231F] text-white shadow-sm' : 'text-[#786D65]'
          }`}
        >
          Dispute Arbitration Queue ({disputedTransactions.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'listings' ? 'bg-[#28231F] text-white shadow-sm' : 'text-[#786D65]'
          }`}
        >
          Community Listings Moderation ({listings.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeAdminTab === 'logs' ? 'bg-[#28231F] text-white shadow-sm' : 'text-[#786D65]'
          }`}
        >
          Platform Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('specs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'specs' ? 'bg-[#28231F] text-white shadow-sm' : 'text-[#786D65]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#9E6E4F]" />
          <span>Developer Specs & Architecture</span>
        </button>
      </div>

      {/* Tab 1: Dispute Arbitration */}
      {activeAdminTab === 'disputes' && (
        <div className="space-y-4">
          {disputedTransactions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#DFD5C8]">
              <p className="text-xs text-[#786D65]">Zero active disputes. All returns settled smoothly!</p>
            </div>
          ) : (
            disputedTransactions.map(tx => (
              <div
                key={tx.id}
                className="bg-white rounded-2xl border border-[#DFD5C8] p-6 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DFD5C8] pb-3">
                  <div>
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                      Dispute #{tx.id}
                    </span>
                    <h3 className="text-sm font-bold text-[#28231F] mt-0.5">{tx.listingTitle}</h3>
                    <p className="text-xs text-[#786D65]">
                      Borrower: <strong className="text-[#28231F]">{tx.borrowerName}</strong> · Lender: <strong className="text-[#28231F]">{tx.ownerName}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#786D65]">Deposit Held in Escrow</span>
                    <p className="text-base font-bold text-[#28231F] tabular-nums">₹{tx.securityDeposit}</p>
                  </div>
                </div>

                {/* Evidence & Claims Review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-1.5">
                    <span className="font-bold text-[#28231F]">Lender Damage Claim / Note</span>
                    <p className="text-[#786D65] leading-relaxed">
                      {tx.returnReport?.damageNoted || '1x 6mm masonry bit missing from drill set accessory tray. Claimed deduction: ₹30.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#DFD5C8] space-y-1.5">
                    <span className="font-bold text-[#28231F]">Borrower Explanation / Contest</span>
                    <p className="text-[#786D65] leading-relaxed">
                      {tx.disputeReason || 'Borrower contends drill bit was absent upon collection or agrees to fair component replacement cost.'}
                    </p>
                  </div>
                </div>

                {/* Arbitration Form */}
                <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#9E6E4F]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#28231F]">
                    <Gavel className="w-4 h-4 text-[#9E6E4F]" />
                    <span>LendLoop Arbitration Determination</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
                        Approved Deduction Amount (INR)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={tx.securityDeposit}
                        value={arbitratedDeduction}
                        onChange={e => setArbitratedDeduction(Number(e.target.value))}
                        className="w-full text-xs font-bold p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                      />
                      <span className="text-[10px] text-[#786D65]">
                        Net refund to borrower: ₹{tx.securityDeposit - arbitratedDeduction}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
                        Recorded Policy Reason
                      </label>
                      <input
                        type="text"
                        value={arbitrationNote}
                        onChange={e => setArbitrationNote(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleArbitrate(tx.id)}
                    className="px-5 py-2.5 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Execute Binding Arbitration Settlement
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Listings Moderation */}
      {activeAdminTab === 'listings' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(item => (
            <div key={item.id} className="p-4 bg-white rounded-2xl border border-[#DFD5C8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#9E6E4F]">{item.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-[#786D65]'
                }`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#28231F] truncate">{item.title}</h4>
              <p className="text-[11px] text-[#786D65]">Lender: {item.ownerName}</p>
              <p className="text-[11px] text-[#28231F] font-semibold">
                Deposit: ₹{item.securityDeposit} · Value: ₹{item.estimatedValue}
              </p>
              <div className="pt-2 border-t border-[#DFD5C8] flex justify-end">
                <button
                  onClick={() => toggleListingStatus(item.id)}
                  className="text-xs text-[#9E6E4F] font-semibold hover:underline cursor-pointer"
                >
                  {item.status === 'active' ? 'Force Pause Listing' : 'Approve & Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#DFD5C8] overflow-hidden">
          <div className="p-4 border-b border-[#DFD5C8] font-bold text-xs text-[#28231F]">
            Immutable Administrator Audit Ledger
          </div>
          <div className="divide-y divide-[#DFD5C8]">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#9E6E4F]">{log.action}</span>
                    <span className="text-[#786D65]">·</span>
                    <span className="font-medium text-[#28231F]">{log.targetType} #{log.targetId}</span>
                  </div>
                  <p className="text-[#786D65] mt-0.5">{log.reason}</p>
                </div>
                <span className="text-[11px] text-[#786D65] font-mono shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Developer Specs & Flutter Architecture */}
      {activeAdminTab === 'specs' && (
        <div className="pt-2">
          <FlutterArchitectureScreen embedded={true} />
        </div>
      )}
    </div>
  );
};
