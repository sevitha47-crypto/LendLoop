import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES } from '../../data/mockData';
import { ItemCard } from '../common/ItemCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Shield,
  ArrowUpDown,
  X,
  AlertCircle
} from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const {
    listings,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewportMode
  } = useApp();

  const [maxDeposit, setMaxDeposit] = useState<number>(2000);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'deposit_asc' | 'rating' | 'newest'>('relevance');

  // Filter listings
  const results = listings.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDeposit = item.securityDeposit <= maxDeposit;
    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesDeposit && matchesCondition;
  });

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'deposit_asc') return a.securityDeposit - b.securityDeposit;
    if (sortBy === 'rating') return b.ownerRating - a.ownerRating;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#DFD5C8] shadow-sm space-y-4">
        <div className="relative flex items-center bg-[#F7F3EC]/60 rounded-2xl p-1.5 border border-[#DFD5C8] focus-within:border-[#9E6E4F]">
          <Search className="w-5 h-5 text-[#786D65] ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items by keyword, brand, or exam/study need..."
            className="w-full px-3 py-2 text-xs text-[#28231F] placeholder:text-[#786D65] outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[#786D65] hover:text-[#28231F] mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#786D65] mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
            >
              <option value="All">All Categories (20)</option>
              {ALL_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#786D65] mb-1">
              Max Deposit: ₹{maxDeposit}
            </label>
            <input
              type="range"
              min={50}
              max={3000}
              step={50}
              value={maxDeposit}
              onChange={e => setMaxDeposit(Number(e.target.value))}
              className="w-full accent-[#9E6E4F] mt-2"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#786D65] mb-1">Condition</label>
            <select
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
            >
              <option value="All">Any Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#786D65] mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
            >
              <option value="relevance">Relevance</option>
              <option value="deposit_asc">Lowest Deposit (₹)</option>
              <option value="rating">Highest Lender Trust</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-[#786D65]">
        <span>Showing {sortedResults.length} verified community listings</span>
        {(searchQuery || selectedCategory !== 'All' || selectedCondition !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedCondition('All');
              setMaxDeposit(2000);
            }}
            className="text-[#9E6E4F] font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      {sortedResults.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DFD5C8] p-12 text-center">
          <AlertCircle className="w-8 h-8 text-[#9E6E4F] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#28231F]">No items found</h3>
          <p className="text-xs text-[#786D65] mt-1">
            Try broadening your search or adjusting the deposit slider.
          </p>
        </div>
      ) : (
        <div
          className={
            viewportMode === 'mobile-frame'
              ? 'grid grid-cols-1 gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
          }
        >
          {sortedResults.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={clicked => setSelectedItem(clicked)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
