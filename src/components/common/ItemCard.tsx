import React from 'react';
import { ItemListing } from '../../types';
import { ProductImage } from './ProductImage';
import { MapPin, Shield, Star } from 'lucide-react';

interface ItemCardProps {
  item: ItemListing;
  onClick: (item: ItemListing) => void;
  featured?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, featured = false }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className="group cursor-pointer bg-white rounded-2xl border border-[#DFD5C8] overflow-hidden hover:border-[#9E6E4F]/50 hover:shadow-md transition-all duration-200 flex flex-col w-full"
    >
      {/* Product Image Frame */}
      <div className="relative w-full overflow-hidden">
        <ProductImage
          src={item.images[0]}
          alt={item.title}
          category={item.category}
          aspectRatio="4/3"
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges Row (Non-overlapping responsive flex container) */}
        <div className="absolute top-0 left-0 right-0 z-20 p-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {/* Condition Ribbon */}
          <div className="bg-[#28231F]/85 backdrop-blur-sm text-[#F7F3EC] px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium tracking-tight truncate max-w-[50%] shadow-sm">
            {item.condition}
          </div>

          {/* Availability Marker */}
          <div className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium text-[#28231F] flex items-center gap-1 shadow-sm shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                item.isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            />
            <span>{item.isAvailable ? 'Available' : 'Reserved'}</span>
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-[#786D65] mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-medium text-[#9E6E4F] shrink-0">{item.category}</span>
            <span aria-hidden="true" className="shrink-0">·</span>
            <span className="truncate">{item.subcategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-[#28231F] line-clamp-2 leading-snug group-hover:text-[#9E6E4F] transition-colors mb-2">
            {item.title}
          </h3>

          {/* Location Area */}
          <div className="flex items-center gap-1 text-xs text-[#786D65] mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#9E6E4F] shrink-0" />
            <span className="truncate">{item.pickupArea}</span>
          </div>
        </div>

        {/* Financial Details: Clearly separating Security Deposit from Rental Fee */}
        <div className="pt-3 border-t border-[#DFD5C8] flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] text-[#786D65] mb-0.5">
              <Shield className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="truncate">Refundable Deposit</span>
            </div>
            <div className="text-base font-bold text-[#28231F] tabular-nums">
              ₹{item.securityDeposit}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[11px] text-[#786D65] mb-0.5">Rent / day</div>
            <div className="text-xs font-semibold text-[#9E6E4F] tabular-nums">
              ₹{item.rentalFeePerDay}
            </div>
          </div>
        </div>

        {/* Lender trust endorsement */}
        <div className="mt-2.5 pt-2 border-t border-dashed border-[#DFD5C8]/70 flex items-center justify-between text-[11px] text-[#786D65] gap-2">
          <span className="truncate">{item.ownerName}</span>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="font-medium text-[#28231F]">{item.ownerRating.toFixed(1)}</span>
            <span className="text-[#786D65]">({item.ownerTrustScore}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
