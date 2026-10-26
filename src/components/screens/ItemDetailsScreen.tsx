import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemListing } from '../../types';
import { ProductImage } from '../common/ProductImage';
import {
  X,
  Shield,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Star,
  Sparkles,
  Share2,
  Flag,
  ArrowRight
} from 'lucide-react';

interface ItemDetailsScreenProps {
  item: ItemListing;
  onClose: () => void;
  onRequestBorrow: (item: ItemListing) => void;
}

export const ItemDetailsScreen: React.FC<ItemDetailsScreenProps> = ({
  item,
  onClose,
  onRequestBorrow
}) => {
  const { currentUser } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [reported, setReported] = useState(false);

  const rentalTotal = item.rentalFeePerDay * selectedDuration;
  const grandTotalDue = item.securityDeposit + rentalTotal;

  return (
    <div className="fixed inset-0 z-50 bg-[#28231F]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#DFD5C8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#DFD5C8] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#786D65]">
            <span className="font-semibold text-[#9E6E4F]">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Listing link copied to clipboard!');
              }}
              className="p-2 rounded-xl text-[#786D65] hover:bg-[#F7F3EC] hover:text-[#28231F] transition-colors cursor-pointer"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#786D65] hover:bg-neutral-100 hover:text-[#28231F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main 2-column or split layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#DFD5C8] relative bg-[#F7F3EC]">
                <ProductImage
                  src={item.images[0]}
                  alt={item.title}
                  category={item.category}
                  aspectRatio="4/3"
                  priority={true}
                />
                <div className="absolute bottom-3 left-3 z-20 bg-[#28231F]/85 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
                  Condition: {item.condition}
                </div>
              </div>

              {/* Security Deposit Highlights Box */}
              <div className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#9E6E4F]/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#28231F]">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>Lender-Selected Refundable Deposit</span>
                  </div>
                  <span className="text-lg font-bold text-[#28231F] tabular-nums">
                    ₹{item.securityDeposit}
                  </span>
                </div>
                <p className="text-[11px] text-[#786D65] leading-relaxed">
                  Lender chosen deposit (estimated item value is ₹{item.estimatedValue}). 100% refunded when returned on time without verified damage under Option B policy.
                </p>
              </div>
            </div>

            {/* Right: Specifications & Pricing Breakdown */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-[#28231F] leading-snug">
                  {item.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#786D65]">
                  <MapPin className="w-3.5 h-3.5 text-[#9E6E4F] shrink-0" />
                  <span className="font-medium text-[#28231F]">{item.pickupArea}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">Approx 2.4 km away</span>
                </div>
              </div>

              {/* Owner Card */}
              <div className="p-3 rounded-2xl border border-[#DFD5C8] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F7F3EC] border border-[#DFD5C8] flex items-center justify-center font-bold text-[#9E6E4F]">
                    {item.ownerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#28231F]">{item.ownerName}</h4>
                    <p className="text-[11px] text-[#786D65]">Verified Community Lender</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#28231F]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.ownerRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    {item.ownerTrustScore}% Trust Score
                  </span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="p-4 rounded-2xl border border-[#DFD5C8] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#28231F]">Borrowing Duration</span>
                  <span className="text-[#786D65]">Max {item.maxDurationDays} days</span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 5, 7].filter(d => d <= item.maxDurationDays).map(days => (
                    <button
                      key={days}
                      onClick={() => setSelectedDuration(days)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        selectedDuration === days
                          ? 'bg-[#28231F] text-white'
                          : 'bg-neutral-100 text-[#786D65] hover:bg-neutral-200'
                      }`}
                    >
                      {days} {days === 1 ? 'day' : 'days'}
                    </button>
                  ))}
                </div>

                {/* Pricing Line Items */}
                <div className="pt-3 border-t border-[#DFD5C8] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#786D65]">
                    <span>Security Deposit (100% Refundable)</span>
                    <span className="font-semibold text-[#28231F] tabular-nums">₹{item.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between text-[#786D65]">
                    <span>Rental Fee (₹{item.rentalFeePerDay} × {selectedDuration} days)</span>
                    <span className="font-semibold text-[#28231F] tabular-nums">₹{rentalTotal}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#DFD5C8] font-bold text-sm text-[#28231F]">
                    <span>Total Due Now</span>
                    <span className="text-[#9E6E4F] tabular-nums">₹{grandTotalDue}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 text-right">
                    Expected refund upon return: ₹{item.securityDeposit}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-[#28231F] mb-2">Item Description</h3>
            <p className="text-xs text-[#786D65] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Included Accessories Checklist */}
          <div>
            <h3 className="text-sm font-bold text-[#28231F] mb-2">Included Accessories & Handover Checklist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.includedAccessories.map((acc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-[#DFD5C8] text-xs text-[#28231F]">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{acc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Instructions & Return Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-[#DFD5C8] bg-white space-y-1.5">
              <h4 className="text-xs font-bold text-[#28231F] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#9E6E4F]" />
                <span>Usage & Handling Instructions</span>
              </h4>
              <p className="text-xs text-[#786D65] leading-relaxed">
                {item.usageInstructions}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#DFD5C8] bg-white space-y-1.5">
              <h4 className="text-xs font-bold text-[#28231F] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9E6E4F]" />
                <span>Return Verification Conditions</span>
              </h4>
              <p className="text-xs text-[#786D65] leading-relaxed">
                {item.returnConditions}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 px-6 border-t border-[#DFD5C8] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Option B Escrow Protected</span>
            </div>
            <button
              onClick={() => {
                setReported(true);
                alert('Listing flagged for Trust & Safety review. Thank you for keeping LendLoop secure.');
              }}
              className="text-[#786D65] hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Flag className="w-3 h-3" />
              <span>{reported ? 'Reported' : 'Report listing'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#DFD5C8] text-xs font-semibold text-[#28231F] hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onRequestBorrow(item)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request to Borrow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
