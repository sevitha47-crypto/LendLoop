import React, { useState } from 'react';
import {
  BookOpen,
  Camera,
  Wrench,
  Headphones,
  Tv,
  Briefcase,
  Activity,
  Package,
  Sparkles
} from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  aspectRatio?: '4/3' | '1/1' | '16/9' | 'auto';
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category = '',
  aspectRatio = '4/3',
  className = '',
  containerClassName = '',
  priority = false
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getCategoryIcon = () => {
    const catLower = category.toLowerCase();
    if (catLower.includes('book') || catLower.includes('education')) return <BookOpen className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('photo') || catLower.includes('camera') || catLower.includes('video')) return <Camera className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('tool') || catLower.includes('diy')) return <Wrench className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('headphone') || catLower.includes('audio') || catLower.includes('electronics')) return <Headphones className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('event') || catLower.includes('projector') || catLower.includes('presentation')) return <Tv className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('travel') || catLower.includes('camping') || catLower.includes('luggage')) return <Briefcase className="w-8 h-8 text-[#9E6E4F]" />;
    if (catLower.includes('sport') || catLower.includes('fitness')) return <Activity className="w-8 h-8 text-[#9E6E4F]" />;
    return <Package className="w-8 h-8 text-[#9E6E4F]" />;
  };

  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : '';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-[#F7F3EC]/60 flex items-center justify-center select-none ${containerClassName}`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-200/70 animate-pulse z-10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#9E6E4F]/30 border-t-[#9E6E4F] animate-spin" />
        </div>
      )}

      {/* Primary Image */}
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover block transition-all duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        /* Graceful Styled Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#F7F3EC] via-[#F2EBE1] to-[#F7F3EC] border border-[#DFD5C8]/60">
          <div className="w-14 h-14 rounded-2xl bg-white/90 border border-[#DFD5C8] flex items-center justify-center mb-2 shadow-sm">
            {getCategoryIcon()}
          </div>
          <span className="text-xs font-semibold text-[#28231F] line-clamp-1 max-w-[85%]">
            {alt}
          </span>
          <span className="text-[10px] text-[#786D65] mt-0.5 font-medium">
            {category || 'Verified Community Item'}
          </span>
        </div>
      )}
    </div>
  );
};
