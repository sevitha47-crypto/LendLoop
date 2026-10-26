import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES } from '../../data/mockData';
import { ItemCard } from '../common/ItemCard';
import { ItemListing } from '../../types';
import {
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    listings,
    setSelectedItem,
    transactions,
    setSelectedTransaction,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewportMode
  } = useApp();

  const [activeConditionFilter, setActiveConditionFilter] = useState<string>('All');
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(1);
  const [showPolicyModal, setShowPolicyModal] = useState<boolean>(false);

  // Filter listings based on search, category, and condition
  const filteredListings = listings.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCondition = activeConditionFilter === 'All' || item.condition === activeConditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Check for active borrows for current user
  const activeBorrows = currentUser
    ? transactions.filter(
        tx => tx.borrowerId === currentUser.id && (tx.status === 'ACTIVE_BORROW' || tx.status === 'RETURN_INSPECTION')
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Charcoal Hero Banner with Greeting & Quick Search */}
      <div className="bg-[#28231F] rounded-3xl p-6 sm:p-8 text-[#F7F3EC] shadow-sm relative overflow-hidden">
        {/* Subtle decorative geometry */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#9E6E4F]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#9E6E4F] mb-2 tracking-wide uppercase">
            <span>Community Item Lending & Borrowing</span>
            <span aria-hidden="true">·</span>
            <span>Bengaluru Campus & City Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
            Hello, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Friend'}! Ready to borrow smarter?
          </h1>

          <p className="text-sm text-[#DFD5C8]/80 mb-6">
            Borrow cameras, tools, textbooks & study equipment. Pay a lender-defined refundable deposit and get 100% refunded when returned intact.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-1.5 focus-within:ring-2 focus-within:ring-[#9E6E4F]">
            <Search className="w-5 h-5 text-[#786D65] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search calculator, DSLR camera, drill kit, projector..."
              className="w-full px-3 py-2 text-sm text-[#28231F] placeholder:text-[#786D65] outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#786D65] hover:text-[#28231F] mr-2 p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setActiveTab('search')}
              className="px-4 py-2 bg-[#9E6E4F] hover:bg-[#855739] text-white rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Active Borrow Status Banner (if user has an ongoing borrow) */}
      {activeBorrows.length > 0 && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Active Borrow</span>
                <span className="text-xs text-[#786D65]">·</span>
                <span className="text-xs text-[#786D65]">Due April 18</span>
              </div>
              <h4 className="text-sm font-semibold text-[#28231F] mt-0.5">
                {activeBorrows[0].listingTitle}
              </h4>
              <p className="text-xs text-[#786D65] mt-0.5">
                Refundable Deposit: <span className="font-semibold text-[#28231F]">₹{activeBorrows[0].securityDeposit}</span> · Held safely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                setSelectedTransaction(activeBorrows[0]);
                setActiveTab('activity');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#28231F] text-white text-xs font-medium hover:bg-[#3E3630] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Manage Return & OTP</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Category Horizontal Filter Carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#28231F]">Browse by Category</h2>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('search');
            }}
            className="text-xs font-semibold text-[#9E6E4F] hover:underline cursor-pointer"
          >
            View all 20 categories
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#28231F] text-white shadow-sm'
                : 'bg-white text-[#786D65] border border-[#DFD5C8] hover:border-[#9E6E4F]'
            }`}
          >
            All Items
          </button>
          {ALL_CATEGORIES.slice(0, 10).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#9E6E4F] text-white shadow-sm'
                  : 'bg-white text-[#786D65] border border-[#DFD5C8] hover:border-[#9E6E4F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LendLoop Match Feature Card */}
      <div className="bg-gradient-to-r from-[#F7F3EC] via-[#F2EBE1] to-[#F7F3EC] rounded-2xl border border-[#9E6E4F]/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#9E6E4F] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9E6E4F] uppercase tracking-wider">LendLoop Match</span>
              <span className="text-xs text-[#786D65]">·</span>
              <span className="text-xs text-[#786D65]">Smart Demand Matching</span>
            </div>
            <h3 className="text-sm font-semibold text-[#28231F] mt-0.5">
              Can't find what you need right now? Post a Need Request.
            </h3>
            <p className="text-xs text-[#786D65] mt-0.5">
              Set your required dates and maximum refundable deposit budget. Verified community owners will be alerted automatically.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('match')}
          className="px-4 py-2 bg-[#28231F] hover:bg-[#3E3630] text-white rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Post Need Request</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#9E6E4F]" />
        </button>
      </div>

      {/* Official Security Policy Banner (Option B Transparency) */}
      <div className="bg-white rounded-2xl border border-[#DFD5C8] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <span className="font-bold text-[#28231F]">LendLoop Option B Policy: </span>
            <span className="text-[#786D65]">
              Full 100% security deposit refunded upon undamaged return. Only verified, documented repairs permitted by policy can be deducted. Disputed claims require admin mediation.
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowPolicyModal(true)}
          className="text-[#9E6E4F] font-semibold hover:underline shrink-0 cursor-pointer"
        >
          Read Policy Rules
        </button>
      </div>

      {/* Featured & Available Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#28231F]">
              {selectedCategory === 'All' ? 'Available Community Items' : `${selectedCategory}`}
            </h2>
            <p className="text-xs text-[#786D65]">
              Showing {filteredListings.length} items with lender-chosen refundable deposits
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile 1-col vs 2-col toggle button when in phone frame */}
            {viewportMode === 'mobile-frame' && (
              <div className="flex items-center bg-white border border-[#DFD5C8] rounded-xl p-0.5 shadow-xs">
                <button
                  onClick={() => setMobileColumns(1)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    mobileColumns === 1
                      ? 'bg-[#28231F] text-white shadow-xs'
                      : 'text-[#786D65] hover:text-[#28231F]'
                  }`}
                  title="Single Column (Large Photos)"
                >
                  Feed
                </button>
                <button
                  onClick={() => setMobileColumns(2)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    mobileColumns === 2
                      ? 'bg-[#28231F] text-white shadow-xs'
                      : 'text-[#786D65] hover:text-[#28231F]'
                  }`}
                  title="2 Columns (Compact Grid)"
                >
                  Grid
                </button>
              </div>
            )}

            <span className="text-xs text-[#786D65] hidden sm:inline">Condition:</span>
            <select
              value={activeConditionFilter}
              onChange={e => setActiveConditionFilter(e.target.value)}
              className="text-xs bg-white border border-[#DFD5C8] rounded-xl px-2.5 py-1.5 text-[#28231F] outline-none focus:border-[#9E6E4F] cursor-pointer"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
            </select>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DFD5C8] p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F7F3EC] text-[#9E6E4F] flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#28231F]">No listings match your search</h3>
            <p className="text-xs text-[#786D65] mt-1 mb-4">
              Try adjusting your search terms or post a request via LendLoop Match.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setActiveConditionFilter('All');
              }}
              className="px-4 py-2 bg-[#9E6E4F] text-white text-xs font-semibold rounded-xl hover:bg-[#855739] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewportMode === 'mobile-frame'
                ? mobileColumns === 1
                  ? 'grid grid-cols-1 gap-4'
                  : 'grid grid-cols-2 gap-2.5'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
            }
          >
            {filteredListings.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={clickedItem => setSelectedItem(clickedItem)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Option B Security Policy Rules Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-[#28231F]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#DFD5C8] overflow-hidden my-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DFD5C8] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-[#28231F]">
                  LendLoop Official Security Policy (Option B)
                </h3>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded-lg text-[#786D65] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#786D65]">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <p className="font-bold text-emerald-900">Case A: Undamaged Return (100% Refund)</p>
                <p className="mt-0.5 text-emerald-800">
                  When an item is returned on time without verified damage, 100% of the security deposit is refunded immediately.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-[#DFD5C8]">
                <p className="font-bold text-[#28231F]">Case B: Verified Damage Deduction</p>
                <p className="mt-0.5">
                  Only verified, documented, reasonable repair costs permitted by policy can be deducted. Normal wear-and-tear is never charged.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <p className="font-bold text-amber-900">Case C: Disputed Deductions</p>
                <p className="mt-0.5 text-amber-800">
                  If borrower and lender disagree, deposit settlement is held safely and referred to LendLoop Trust & Safety for review. No automatic deposit forfeiture.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-[#DFD5C8]">
                <p className="font-bold text-[#28231F]">Case D: Damage Exceeds Deposit</p>
                <p className="mt-0.5">
                  Deductions are capped at the deposit amount. Additional claims require separate formal review and can never auto-debit saved payment methods.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPolicyModal(false)}
              className="w-full py-2.5 bg-[#28231F] hover:bg-[#3E3630] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
