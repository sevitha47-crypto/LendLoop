import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BorrowTransaction, ItemListing } from '../../types';
import { ProductImage } from '../common/ProductImage';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  Star,
  Receipt,
  FileCheck,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  LogOut
} from 'lucide-react';

interface ActivityHubScreenProps {
  onSelectTransaction: (tx: BorrowTransaction) => void;
  onOpenChat: (txId: string) => void;
}

export const ActivityHubScreen: React.FC<ActivityHubScreenProps> = ({
  onSelectTransaction,
  onOpenChat
}) => {
  const {
    currentUser,
    logout,
    transactions,
    listings,
    toggleListingStatus,
    setSelectedItem,
    reviews,
    setActiveTab
  } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'borrowing' | 'lending' | 'reviews'>('borrowing');

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#DFD5C8]">
        <p className="text-sm text-[#786D65]">Please log in to view your activity.</p>
        <button
          onClick={() => setActiveTab('auth')}
          className="mt-3 px-4 py-2 bg-[#9E6E4F] text-white text-xs font-bold rounded-xl"
        >
          Log In
        </button>
      </div>
    );
  }

  // Filter transactions
  const myBorrows = transactions.filter(t => t.borrowerId === currentUser.id);
  const myLent = transactions.filter(t => t.ownerId === currentUser.id);
  const myListings = listings.filter(i => i.ownerId === currentUser.id);
  const myReviews = reviews.filter(r => r.targetUserId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Top User Profile & Trust Score Strip */}
      <div className="bg-white rounded-3xl p-6 border border-[#DFD5C8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl border-2 border-[#DFD5C8] bg-[#F7F3EC] shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#28231F]">{currentUser.name}</h2>
              {currentUser.verifiedIdentity && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  ID Verified
                </span>
              )}
              <button
                onClick={logout}
                className="px-2.5 py-1 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ml-auto sm:ml-2"
                title="Log out of LendLoop"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
            <p className="text-xs text-[#786D65] mt-0.5">
              {currentUser.email} · Member since {currentUser.joinedDate}
            </p>
            <div className="flex items-center gap-3 text-xs text-[#786D65] mt-2">
              <span>{currentUser.preferredLocation}</span>
            </div>
          </div>
        </div>

        {/* Trust Score & Key Metrics */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 bg-[#F7F3EC] rounded-2xl border border-[#9E6E4F]/20 text-center">
            <span className="text-[10px] text-[#786D65] uppercase tracking-wider font-semibold block">
              Trust Score
            </span>
            <span className="text-xl font-extrabold text-[#9E6E4F] tabular-nums">
              {currentUser.trustScore}%
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-[#DFD5C8] text-center">
            <span className="text-[10px] text-[#786D65] uppercase tracking-wider font-semibold block">
              Completed
            </span>
            <span className="text-xl font-bold text-[#28231F] tabular-nums">
              {currentUser.successfulTransactions}
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-[#DFD5C8] text-center">
            <span className="text-[10px] text-[#786D65] uppercase tracking-wider font-semibold block">
              On-Time
            </span>
            <span className="text-xl font-bold text-emerald-700 tabular-nums">
              {currentUser.onTimeReturnRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DFD5C8] pb-2">
        <button
          onClick={() => setActiveTabMode('borrowing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTabMode === 'borrowing'
              ? 'bg-[#28231F] text-white shadow-sm'
              : 'text-[#786D65] hover:text-[#28231F]'
          }`}
        >
          My Borrows ({myBorrows.length})
        </button>

        <button
          onClick={() => setActiveTabMode('lending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTabMode === 'lending'
              ? 'bg-[#28231F] text-white shadow-sm'
              : 'text-[#786D65] hover:text-[#28231F]'
          }`}
        >
          My Listings & Loans ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTabMode('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTabMode === 'reviews'
              ? 'bg-[#28231F] text-white shadow-sm'
              : 'text-[#786D65] hover:text-[#28231F]'
          }`}
        >
          Community Trust & Reviews ({myReviews.length})
        </button>
      </div>

      {/* Tab 1: Borrowing Dashboard */}
      {activeTabMode === 'borrowing' && (
        <div className="space-y-4">
          {myBorrows.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-[#DFD5C8]">
              <p className="text-xs text-[#786D65]">You haven't requested any items yet.</p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-3 px-4 py-2 bg-[#9E6E4F] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Explore Items to Borrow
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myBorrows.map(tx => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-[#DFD5C8] p-5 hover:border-[#9E6E4F]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#DFD5C8] shrink-0 bg-[#F7F3EC]">
                      <ProductImage
                        src={tx.listingImage}
                        alt={tx.listingTitle}
                        aspectRatio="1/1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#9E6E4F] uppercase">
                          {tx.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[#786D65]">·</span>
                        <span className="text-xs text-[#786D65]">Lender: {tx.ownerName}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#28231F] mt-0.5">
                        {tx.listingTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-[#786D65] mt-1.5">
                        <span>Dates: {tx.startDate} → {tx.endDate}</span>
                        <span>·</span>
                        <span>Deposit: <strong className="text-[#28231F]">₹{tx.securityDeposit}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => onOpenChat(tx.id)}
                      className="p-2 rounded-xl border border-[#DFD5C8] text-[#786D65] hover:bg-[#F7F3EC] hover:text-[#9E6E4F] transition-colors cursor-pointer"
                      title="Open Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectTransaction(tx)}
                      className="px-4 py-2 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Manage Flow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Lender Listings & Active Loans */}
      {activeTabMode === 'lending' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#786D65] uppercase tracking-wider">
                My Listed Items ({myListings.length})
              </h3>
              <button
                onClick={() => setActiveTab('list')}
                className="text-xs font-semibold text-[#9E6E4F] hover:underline cursor-pointer"
              >
                + Add Another Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#DFD5C8] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#DFD5C8] shrink-0 bg-[#F7F3EC]">
                      <ProductImage
                        src={item.images[0]}
                        alt={item.title}
                        category={item.category}
                        aspectRatio="1/1"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#28231F] line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-[#786D65] mt-0.5">{item.category}</p>
                      <p className="text-[11px] font-semibold text-[#9E6E4F] mt-1">
                        Deposit: ₹{item.securityDeposit} · Rent: ₹{item.rentalFeePerDay}/d
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DFD5C8] text-xs">
                    <button
                      onClick={() => toggleListingStatus(item.id)}
                      className="flex items-center gap-1 text-[#786D65] hover:text-[#28231F] cursor-pointer"
                    >
                      {item.status === 'active' ? (
                        <>
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 text-emerald-600" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-[#9E6E4F] font-semibold hover:underline cursor-pointer"
                    >
                      View Public Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Loans as Lender */}
          <div>
            <h3 className="text-xs font-bold text-[#786D65] uppercase tracking-wider mb-3">
              Items Currently Lent Out ({myLent.length})
            </h3>
            <div className="space-y-3">
              {myLent.map(tx => (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-[#DFD5C8] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">
                        {tx.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#786D65]">·</span>
                      <span className="text-xs text-[#786D65]">Borrower: {tx.borrowerName}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#28231F] mt-0.5">{tx.listingTitle}</h4>
                    <p className="text-xs text-[#786D65] mt-1">
                      Refundable Deposit Escrow: <strong className="text-[#28231F]">₹{tx.securityDeposit}</strong> · Due: {tx.endDate}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTransaction(tx)}
                    className="px-4 py-2 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Inspect & Settle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reviews & Trust Score Breakdown */}
      {activeTabMode === 'reviews' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#F7F3EC] border border-[#9E6E4F]/20 space-y-2">
            <h3 className="text-sm font-bold text-[#28231F]">How LendLoop Trust Score is Computed</h3>
            <p className="text-xs text-[#786D65] leading-relaxed">
              LendLoop uses explainable, non-punitive trust calculations. 100% on-time returns, verified student/identity status, and completed transactions contribute to score elevation. Submitting a good-faith dispute never automatically decreases your score.
            </p>
          </div>

          <div className="space-y-3">
            {myReviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-white border border-[#DFD5C8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#28231F]">{rev.reviewerName}</span>
                    <span className="text-xs text-[#786D65]">·</span>
                    <span className="text-xs text-[#786D65]">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold text-[#28231F]">{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-[#786D65] leading-relaxed">{rev.comment}</p>
                {rev.onTimeReturn && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified On-Time Return</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
