import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES } from '../../data/mockData';
import { ItemCondition } from '../../types';
import {
  PlusSquare,
  Shield,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const AddItemScreen: React.FC = () => {
  const { addListing, setActiveTab, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [subcategory, setSubcategory] = useState('Study Tools & Exam Gear');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [estimatedValue, setEstimatedValue] = useState<number>(350);
  const [securityDeposit, setSecurityDeposit] = useState<number>(80);
  const [rentalFeePerDay, setRentalFeePerDay] = useState<number>(15);
  const [pickupArea, setPickupArea] = useState('Indiranagar Metro Station (Gate 2)');
  const [maxDurationDays, setMaxDurationDays] = useState<number>(7);
  const [includedAccessories, setIncludedAccessories] = useState<string>('Protective Slide Case, User Manual');
  const [usageInstructions, setUsageInstructions] = useState('Keep in protective casing when not in active use.');
  const [returnConditions, setReturnConditions] = useState('Return with original hard cover and intact screen display.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please enter a title and description.');
      return;
    }

    if (securityDeposit <= 0) {
      setErrorMsg('Security deposit must be a positive valid amount in INR.');
      return;
    }

    const accessoriesList = includedAccessories
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    addListing({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory,
      condition,
      estimatedValue,
      securityDeposit,
      rentalFeePerDay,
      pickupArea: pickupArea.trim(),
      coordinates: { lat: 12.9784, lng: 77.6408 },
      maxDurationDays,
      includedAccessories: accessoriesList.length > 0 ? accessoriesList : ['Standard Unit'],
      usageInstructions,
      returnConditions,
      images: [imageUrl],
      isAvailable: true,
      status: 'active'
    });

    setSubmitted(true);
    setTimeout(() => {
      setActiveTab('activity');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#28231F] rounded-3xl p-6 sm:p-8 text-[#F7F3EC] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#9E6E4F] uppercase tracking-wider mb-2">
          <PlusSquare className="w-4 h-4" />
          <span>Lender Listing Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          List an Item for Community Sharing
        </h1>
        <p className="text-xs sm:text-sm text-[#DFD5C8]/80">
          Set your own refundable security deposit and daily rental fee. Borrowers pay upon reservation and receive 100% refund when returned without damage.
        </p>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Listing successfully published! Redirecting to your lender dashboard...</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#DFD5C8] p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Section 1: Item Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#28231F] border-b border-[#DFD5C8] pb-2">
            1. Basic Item Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#28231F] mb-1">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Casio fx-991EX ClassWiz Scientific Calculator"
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
              <label className="block text-xs font-semibold text-[#28231F] mb-1">Condition *</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ItemCondition)}
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28231F] mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe condition, specifications, battery life, included case, etc."
              className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
            />
          </div>
        </div>

        {/* Section 2: Security Deposit & Pricing Strategy */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#DFD5C8] pb-2">
            <h3 className="text-sm font-bold text-[#28231F]">
              2. Security Deposit & Daily Rent
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Option B Protected</span>
            </span>
          </div>

          {/* Key Principle Notice */}
          <div className="p-3.5 rounded-2xl bg-[#F7F3EC] border border-[#9E6E4F]/30 text-xs text-[#28231F] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#9E6E4F] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#28231F]">Lender-Selected Refundable Deposit Rule</p>
              <p className="text-[11px] text-[#786D65] mt-0.5">
                LendLoop allows you to choose any reasonable deposit amount for your item (e.g. ₹80 deposit on a ₹350 calculator). It is not locked to a fixed percentage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Estimated Item Value (INR)
              </label>
              <input
                type="number"
                min={1}
                value={estimatedValue}
                onChange={e => setEstimatedValue(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
              <span className="text-[10px] text-[#786D65]">Replacement market cost</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Refundable Deposit (INR) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={securityDeposit}
                onChange={e => setSecurityDeposit(Number(e.target.value))}
                className="w-full text-xs font-bold text-[#9E6E4F] p-3 rounded-xl border border-[#9E6E4F]/50 bg-white outline-none focus:border-[#9E6E4F]"
              />
              <span className="text-[10px] text-[#786D65]">100% refunded to borrower upon undamaged return</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Rent Fee per Day (INR)
              </label>
              <input
                type="number"
                min={0}
                value={rentalFeePerDay}
                onChange={e => setRentalFeePerDay(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
              <span className="text-[10px] text-[#786D65]">Separate from security deposit</span>
            </div>
          </div>
        </div>

        {/* Section 3: Handover Logistics & Verification Conditions */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#28231F] border-b border-[#DFD5C8] pb-2">
            3. Handover & Verification Conditions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Public Pickup Area *
              </label>
              <input
                type="text"
                required
                value={pickupArea}
                onChange={e => setPickupArea(e.target.value)}
                placeholder="e.g. Indiranagar Metro Station Gate 2"
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
              <span className="text-[10px] text-[#786D65]">Never list your private home address publicly</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Maximum Duration (Days)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={maxDurationDays}
                onChange={e => setMaxDurationDays(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#28231F] mb-1">
              Included Accessories (Comma separated)
            </label>
            <input
              type="text"
              value={includedAccessories}
              onChange={e => setIncludedAccessories(e.target.value)}
              placeholder="e.g., Hard cover, User Guide, Extra battery"
              className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Handling & Usage Instructions
              </label>
              <textarea
                rows={2}
                value={usageInstructions}
                onChange={e => setUsageInstructions(e.target.value)}
                placeholder="Keep away from water, avoid forceful drops..."
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#28231F] mb-1">
                Return Inspection Conditions
              </label>
              <textarea
                rows={2}
                value={returnConditions}
                onChange={e => setReturnConditions(e.target.value)}
                placeholder="Must return with screen intact and all accessories..."
                className="w-full text-xs p-3 rounded-xl border border-[#DFD5C8] bg-white outline-none focus:border-[#9E6E4F]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
        >
          Publish Community Listing
        </button>
      </form>
    </div>
  );
};
