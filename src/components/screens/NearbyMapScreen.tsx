import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItemListing } from '../../types';
import { ProductImage } from '../common/ProductImage';
import {
  MapPin,
  Shield,
  Layers,
  Navigation,
  Star,
  Sparkles,
  ArrowRight,
  List,
  Map as MapIcon,
  Info
} from 'lucide-react';
import { ALL_CATEGORIES } from '../../data/mockData';

export const NearbyMapScreen: React.FC = () => {
  const { listings, setSelectedItem } = useApp();
  const [selectedPinItem, setSelectedPinItem] = useState<ItemListing>(listings[0]);
  const [selectedMapCategory, setSelectedMapCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [maxDistanceRadius, setMaxDistanceRadius] = useState<number>(8);

  const filteredMapListings = listings.filter(item => {
    return selectedMapCategory === 'All' || item.category === selectedMapCategory;
  });

  // Bengaluru campus coordinates mock offsets
  const mapCenter = { lat: 12.95, lng: 77.63 };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD5C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#9E6E4F]" />
            <h1 className="text-base font-bold text-[#28231F]">Nearby Community Discovery</h1>
          </div>
          <p className="text-xs text-[#786D65]">
            Approximate pickup hubs in Bengaluru. Exact handover meeting points shared upon deposit confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* List vs Map View Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-[#28231F] shadow-sm' : 'text-[#786D65]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#28231F] shadow-sm' : 'text-[#786D65]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedMapCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedMapCategory === 'All'
              ? 'bg-[#28231F] text-white'
              : 'bg-white border border-[#DFD5C8] text-[#786D65] hover:border-[#9E6E4F]'
          }`}
        >
          All Categories
        </button>
        {ALL_CATEGORIES.slice(0, 8).map(c => (
          <button
            key={c}
            onClick={() => setSelectedMapCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedMapCategory === c
                ? 'bg-[#9E6E4F] text-white'
                : 'bg-white border border-[#DFD5C8] text-[#786D65] hover:border-[#9E6E4F]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main Map Canvas or List View */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-[520px] rounded-3xl bg-[#EFE9E0] border border-[#DFD5C8] overflow-hidden shadow-inner flex flex-col justify-between">
          {/* Simulated Stylized Map Canvas with Neighborhood Grids & Pins */}
          <div className="absolute inset-0 bg-[#E8E1D5] overflow-hidden">
            {/* Soft grid & street patterns */}
            <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1C7B8" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Arterial roads */}
              <path d="M 0 150 Q 300 200 800 120" stroke="#FFFFFF" strokeWidth="12" fill="none" />
              <path d="M 120 0 Q 250 400 350 700" stroke="#FFFFFF" strokeWidth="10" fill="none" />
              <path d="M 400 50 Q 550 350 700 650" stroke="#FFFFFF" strokeWidth="8" fill="none" />
              {/* Green campus park area */}
              <circle cx="280" cy="220" r="140" fill="#D9EAD3" opacity="0.6" />
              <text x="250" y="225" fill="#4A7043" fontSize="12" fontWeight="bold">Koramangala Valley</text>
              <text x="520" y="140" fill="#786D65" fontSize="12" fontWeight="bold">Indiranagar 100ft Hub</text>
              <text x="360" y="440" fill="#786D65" fontSize="12" fontWeight="bold">HSR Layout Sector 2</text>
            </svg>

            {/* Approximate Radius Overlay around user */}
            <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-[#9E6E4F]/30 bg-[#9E6E4F]/5 pointer-events-none flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#9E6E4F] ring-4 ring-white shadow-md animate-pulse" />
            </div>

            {/* Render Item Pins */}
            {filteredMapListings.map((item, idx) => {
              // Deterministic spatial placement on mock map
              const xOffsets = [58, 62, 38, 42, 65, 34, 55, 30];
              const yOffsets = [28, 33, 62, 68, 22, 65, 29, 58];
              const leftPercent = xOffsets[idx % xOffsets.length];
              const topPercent = yOffsets[idx % yOffsets.length];
              const isSelected = selectedPinItem.id === item.id;

              return (
                <div
                  key={item.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  onClick={() => setSelectedPinItem(item)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 z-30 ${
                    isSelected ? 'scale-110 z-40' : 'hover:scale-105'
                  }`}
                >
                  <div className={`p-1.5 pl-2.5 pr-3 rounded-full shadow-lg flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-[#28231F] text-white border-white ring-2 ring-[#9E6E4F]'
                      : 'bg-white text-[#28231F] border-[#DFD5C8]'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-[#9E6E4F] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      ₹
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[11px] font-bold truncate max-w-[90px]">{item.title}</p>
                      <p className="text-[9px] text-[#9E6E4F] font-semibold mt-0.5">₹{item.securityDeposit} Dep</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy Note Overlay */}
          <div className="relative m-4 self-start bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#DFD5C8] text-[11px] text-[#786D65] shadow-sm flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#9E6E4F]" />
            <span>Privacy Guard Active: Handover happens at public metro stations or campus gates.</span>
          </div>

          {/* Bottom Card Preview of Selected Pin */}
          {selectedPinItem && (
            <div className="relative m-4 p-4 rounded-2xl bg-white border border-[#DFD5C8] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#DFD5C8] shrink-0 bg-[#F7F3EC]">
                  <ProductImage
                    src={selectedPinItem.images[0]}
                    alt={selectedPinItem.title}
                    category={selectedPinItem.category}
                    aspectRatio="1/1"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#786D65]">
                    <span className="font-semibold text-[#9E6E4F]">{selectedPinItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedPinItem.condition}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#28231F] mt-0.5">
                    {selectedPinItem.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#786D65] mt-1">
                    <MapPin className="w-3 h-3 text-[#9E6E4F]" />
                    <span>{selectedPinItem.pickupArea}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 border-[#DFD5C8]">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-[#786D65]">Deposit (Refundable)</span>
                  <p className="text-sm font-bold text-[#28231F] tabular-nums">
                    ₹{selectedPinItem.securityDeposit}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(selectedPinItem)}
                  className="px-4 py-2 bg-[#9E6E4F] hover:bg-[#855739] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List Mode View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMapListings.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-4 rounded-2xl bg-white border border-[#DFD5C8] hover:border-[#9E6E4F] transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
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
                  <p className="text-[11px] text-[#786D65] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#9E6E4F]" />
                    <span className="truncate max-w-[160px]">{item.pickupArea}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ₹{item.securityDeposit} Refundable Deposit
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#786D65]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
