import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function LiteYouTube({ videoId, title, className = '' }: LiteYouTubeProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Fallback pattern for maximum resolution vs standard high definition thumbnails
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : '';

  if (isPlaying && videoId) {
    return (
      <div className={`relative aspect-video w-full h-full bg-black rounded-lg overflow-hidden border border-outline-variant shadow-sm ${className}`}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      className={`relative aspect-video w-full h-full bg-surface-container-high rounded-lg overflow-hidden border border-outline-variant shadow-sm cursor-pointer group select-none ${className}`}
      onClick={() => setIsPlaying(true)}
    >
      {videoId ? (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            onError={(e) => {
              // Fallback to hqdefault in case maxresdefault is not available on YouTube
              (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
            referrerPolicy="no-referrer"
          />
          {/* Elegant overlay to enhance readability and visual depth */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-300"></div>
          
          {/* Centered clean play trigger icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/95 group-hover:bg-primary-container text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-lg border border-white/20">
              <Play className="w-6 h-6 fill-current text-white ml-1" />
            </div>
          </div>
          
          {/* Bottom badge displaying episode title */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-xs text-white p-3 rounded border border-white/10 text-xs font-sans font-medium line-clamp-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {title}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant p-6 text-center">
          <Play className="w-12 h-12 text-outline/50 mb-3" />
          <span className="font-semibold text-sm">No video content assigned</span>
        </div>
      )}
    </div>
  );
}
