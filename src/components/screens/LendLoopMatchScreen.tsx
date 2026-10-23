import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES } from '../../data/mockData';
import { NeedRequest, ItemListing } from '../../types';
import { ProductImage } from '../common/ProductImage';
import {
  Sparkles,
  Search,
  MapPin,
  Calendar,
  Shield,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Bot
} from 'lucide-react';

export const LendLoopMatchScreen: React.FC = () => {
  const { needRequests, addNeedRequest, listings, setSelectedItem, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'matches' | 'post'>('matches');
  const [selectedNeed, setSelectedNeed] = useState<NeedRequest>(needRequests[0]);

  // Form State for posting a new Need Request
  const [requiredItem, setRequiredItem] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-04-18');
  const [endDate, setEndDate] = useState('2026-04-21');
  const [preferredLocation, setPreferredLocation] = useState('Koramangala 4th Block');
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [maxDepositBudget, setMaxDepositBudget] = useState(150);
  const [postedSuccess, setPostedSuccess] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Compute matched items for selected need request
  const matchedListings = listings.map(item => {
    let score = 0;
    const reasons: string[] = [];

    // Category match (+40)
    if (item.category.toLowerCase() === selectedNeed.category.toLowerCase()) {
      score += 40;
      reasons.push('Direct category match');
    }

    // Keyword match (+30)
    const needKeywords = selectedNeed.requiredItem.toLowerCase().split(' ');
    const titleLower = item.title.toLowerCase();
    const hasKeyword = needKeywords.some(kw => kw.length > 3 && titleLower.includes(kw));
    if (hasKeyword) {
      score += 30;
      reasons.push('Title & specifications overlap');
    }

    // Deposit budget match (+20)
    if (item.securityDeposit <= selectedNeed.maxDepositBudget) {
      score += 20;
      reasons.push(`Deposit ₹${item.securityDeposit} is within ₹${selectedNeed.maxDepositBudget} budget`);
    }

    // High lender trust (+10)
    if (item.ownerTrustScore >= 90) {
      score += 10;
      reasons.push(`High lender trust (${item.ownerTrustScore}%)`);
    }

    return {
      item,
      score: Math.min(score, 100),
      reasons
    };
  }).filter(m => m.score >= 30).sort((a, b) => b.score - a.score);

  const handlePostNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredItem.trim()) return;

    addNeedRequest({
      requiredItem,
      category,
      description,
      requiredStartDate: startDate,
      requiredEndDate: endDate,
      preferredLocation,
      maxDistanceKm,
      maxDepositBudget
    });

    setPostedSuccess(true);
    setTimeout(() => {
      setPostedSuccess(false);
      setActiveTab('matches');
    }, 1200);
  };

  const handleRunAiMatchAnalysis = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setLoadingAi(false);
      setAiExplanation(
        `LendLoop AI Match Analysis for "${selectedNeed.requiredItem}":\n` +
        `• Primary Match: Casio fx-991EX (98% alignment). Fits within deposit limit (₹80 vs ₹${selectedNeed.maxDepositBudget} budget).\n` +
        `• Proximity: Indiranagar pickup hub is within 4.2 km of Koramangala.\n` +
        `• Alternative Recommendation: If exact model is occupied on exam day, Casio fx-82MS is available as secondary backup.`
      );
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#28231F] rounded-3xl p-6 sm:p-8 text-[#F7F3EC] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E6E4F] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Smart Demand-to-Listing Matchmaker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            LendLoop Match
          </h1>
          <p className="text-xs sm:text-sm text-[#DFD5C8]/80">
            Tell the community what you need for an upcoming course, exam, or DIY project. Our matching algorithm connects your budget and dates with nearby verified owners.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-[#9E6E4F] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Active Needs & Matches
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'post'
                ? 'bg-[#9E6E4F] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Need</span>
          </button>
        </div>
      </div>

      {activeTab === 'matches' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: List of Need Requests */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#786D65] uppercase tracking-wider">
              Community Need Requests
            </h2>
            <div className="space-y-2.5">
              {needRequests.map(req => {
                const isSelected = selectedNeed.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedNeed(req);
                      setAiExplanation(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#9E6E4F] shadow-md ring-1 ring-[#9E6E4F]'
                        : 'bg-white border-[#DFD5C8] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#28231F] leading-snug">
                        {req.requiredItem}
                      </h4>
                      <span className="text-[10px] bg-[#F7F3EC] text-[#9E6E4F] font-bold px-2 py-0.5 rounded-md shrink-0">
                        Budget ₹{req.maxDepositBudget}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#786D65] line-clamp-2 mt-1">
                      {req.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#DFD5C8] flex items-center justify-between text-[11px] text-[#786D65]">
                      <span className="truncate">{req.userName}</span>
                      <span>Within {req.maxDistanceKm}km</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Match Results & AI Semantic Explanation */}
          <div className="lg:col-span-2 space-y-4">
            {/* Selected Request Detail Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#DFD5C8] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#786D65]">
                    <span className="font-semibold text-[#9E6E4F]">{selectedNeed.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Posted by {selectedNeed.userName}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#28231F] mt-0.5">
                    {selectedNeed.requiredItem}
                  </h3>
                </div>

                <button
                  onClick={handleRunAiMatchAnalysis}
                  disabled={loadingAi}
                  className="px-3.5 py-2 rounded-xl bg-[#F7F3EC] border border-[#9E6E4F]/40 text-[#9E6E4F] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F2EBE1] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Bot className="w-4 h-4" />
                  <span>{loadingAi ? 'Synthesizing...' : 'AI Semantic Explanation'}</span>
                </button>
              </div>

              <p className="text-xs text-[#786D65]">
                {selectedNeed.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#DFD5C8] text-xs text-[#786D65]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E6E4F]" />
                  <span>{selectedNeed.requiredStartDate} to {selectedNeed.requiredEndDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9E6E4F]" />
                  <span>{selectedNeed.preferredLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Max Deposit: ₹{selectedNeed.maxDepositBudget}</span>
                </div>
              </div>
            </div>

            {/* AI Explanation Box */}
            {aiExplanation && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-purple-900">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Explainable Match Rationale</span>
                </div>
                <p className="whitespace-pre-line text-[11px] leading-relaxed text-purple-900">
                  {aiExplanation}
                </p>
              </div>
            )}

            {/* Matched Listings List */}
            <div>
              <h3 className="text-xs font-bold text-[#786D65] uppercase tracking-wider mb-3">
                Algorithmic Matches ({matchedListings.length} found)
              </h3>

              <div className="space-y-3">
                {matchedListings.map(({ item, score, reasons }) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-[#DFD5C8] hover:border-[#9E6E4F]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#DFD5C8] shrink-0 bg-[#F7F3EC]">
                        <ProductImage
                          src={item.images[0]}
                          alt={item.title}
                          category={item.category}
                          aspectRatio="1/1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {score}% Match
                          </span>
                          <span className="text-xs text-[#786D65]">{item.category}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#28231F] mt-1">
                          {item.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#786D65] mt-1">
                          {reasons.map((r, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && <span>·</span>}
                              <span>{r}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] text-[#786D65]">Refundable Deposit</div>
                        <div className="text-sm font-bold text-[#28231F] tabular-nums">
                          ₹{item.securityDeposit}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>View Listing</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Post a Need Form */
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD5C8] shadow-sm">
          <h2 className="text-lg font-bold text-[#28231F] mb-1">Post a Need Request</h2>
          <p className="text-xs text-[#786D65] mb-6">
            Broadcast what you need to lenders in your neighborhood or campus.
          </p>

          {postedSuccess && (
            <div className="p-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Need request posted successfully! Redirecting to match feed...</span>
            </div>
          )}

          <form onSubmit={handlePostNeed} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Required Item Name *
              </label>
              <input
                type="text"
                required
                value={requiredItem}
                onChange={e => setRequiredItem(e.target.value)}
                placeholder="e.g., Casio fx-991EX Scientific Calculator"
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">
                  Max Refundable Deposit Budget (INR) *
                </label>
                <input
                  type="number"
                  min={10}
                  required
                  value={maxDepositBudget}
                  onChange={e => setMaxDepositBudget(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">Needed From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">Needed Until</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">Preferred Location</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={e => setPreferredLocation(e.target.value)}
                  placeholder="e.g., Koramangala or Indiranagar"
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#28231F] mb-1">Max Distance: {maxDistanceKm} km</label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={maxDistanceKm}
                  onChange={e => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#9E6E4F] mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Description & Exam/Project Context
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mention specific condition or model requirements..."
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
            >
              Broadcast Need Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
