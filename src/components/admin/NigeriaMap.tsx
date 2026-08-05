import React, { useState } from 'react';

export interface StateData {
  state: string;
  visitors: number;
  percentage: number;
  uniqueVisitors: number;
  avgEngagement: string;
}

interface NigeriaMapProps {
  data: Record<string, StateData>;
  selectedState: string;
  onSelectState: (stateName: string) => void;
}

// Approximate SVG paths / positions for Nigeria's 36 states + FCT for an interactive map visual
const NIGERIA_STATE_BOUNDS: { id: string; name: string; path: string; labelX: number; labelY: number }[] = [
  { id: 'lagos', name: 'Lagos', path: 'M 100,340 L 140,340 L 135,360 L 95,360 Z', labelX: 115, labelY: 350 },
  { id: 'ogun', name: 'Ogun', path: 'M 95,300 L 160,300 L 150,335 L 90,335 Z', labelX: 125, labelY: 318 },
  { id: 'oyo', name: 'Oyo', path: 'M 90,230 L 155,230 L 160,295 L 95,295 Z', labelX: 125, labelY: 260 },
  { id: 'osun', name: 'Osun', path: 'M 160,265 L 205,265 L 200,295 L 155,295 Z', labelX: 180, labelY: 280 },
  { id: 'ondo', name: 'Ondo', path: 'M 165,295 L 220,295 L 205,340 L 150,340 Z', labelX: 185, labelY: 318 },
  { id: 'ekiti', name: 'Ekiti', path: 'M 205,255 L 245,255 L 240,285 L 200,285 Z', labelX: 222, labelY: 270 },
  { id: 'kwara', name: 'Kwara', path: 'M 140,175 L 235,175 L 225,235 L 145,235 Z', labelX: 185, labelY: 205 },
  { id: 'kogi', name: 'Kogi', path: 'M 230,225 L 320,225 L 310,285 L 210,285 Z', labelX: 265, labelY: 255 },
  { id: 'edo', name: 'Edo', path: 'M 205,300 L 265,300 L 255,345 L 195,345 Z', labelX: 230, labelY: 322 },
  { id: 'delta', name: 'Delta', path: 'M 195,345 L 260,345 L 240,390 L 180,390 Z', labelX: 215, labelY: 368 },
  { id: 'bayelsa', name: 'Bayelsa', path: 'M 220,390 L 270,390 L 255,420 L 205,420 Z', labelX: 238, labelY: 405 },
  { id: 'rivers', name: 'Rivers', path: 'M 270,380 L 325,380 L 310,420 L 255,420 Z', labelX: 290, labelY: 400 },
  { id: 'anambra', name: 'Anambra', path: 'M 265,320 L 300,320 L 295,345 L 260,345 Z', labelX: 280, labelY: 332 },
  { id: 'imo', name: 'Imo', path: 'M 265,345 L 305,345 L 300,375 L 260,375 Z', labelX: 282, labelY: 360 },
  { id: 'abia', name: 'Abia', path: 'M 305,335 L 340,335 L 335,375 L 300,375 Z', labelX: 320, labelY: 355 },
  { id: 'enugu', name: 'Enugu', path: 'M 290,290 L 345,290 L 340,325 L 285,325 Z', labelX: 315, labelY: 308 },
  { id: 'ebonyi', name: 'Ebonyi', path: 'M 345,295 L 380,295 L 375,340 L 340,340 Z', labelX: 360, labelY: 318 },
  { id: 'crossriver', name: 'Cross River', path: 'M 345,340 L 395,340 L 380,420 L 325,420 Z', labelX: 365, labelY: 380 },
  { id: 'akwaibom', name: 'Akwa Ibom', path: 'M 315,380 L 355,380 L 345,420 L 305,420 Z', labelX: 330, labelY: 400 },
  { id: 'benue', name: 'Benue', path: 'M 320,250 L 440,250 L 420,300 L 310,300 Z', labelX: 375, labelY: 275 },
  { id: 'taraba', name: 'Taraba', path: 'M 425,200 L 515,200 L 495,290 L 415,290 Z', labelX: 462, labelY: 245 },
  { id: 'adamawa', name: 'Adamawa', path: 'M 495,130 L 575,130 L 555,225 L 485,225 Z', labelX: 528, labelY: 178 },
  { id: 'borno', name: 'Borno', path: 'M 485,30 L 590,30 L 575,130 L 475,130 Z', labelX: 532, labelY: 80 },
  { id: 'yobe', name: 'Yobe', path: 'M 410,40 L 485,40 L 475,130 L 400,130 Z', labelX: 442, labelY: 85 },
  { id: 'gombe', name: 'Gombe', path: 'M 425,130 L 485,130 L 475,190 L 415,190 Z', labelX: 450, labelY: 160 },
  { id: 'bauchi', name: 'Bauchi', path: 'M 345,110 L 425,110 L 415,185 L 335,185 Z', labelX: 380, labelY: 148 },
  { id: 'plateau', name: 'Plateau', path: 'M 335,185 L 420,185 L 410,245 L 325,245 Z', labelX: 372, labelY: 215 },
  { id: 'nasarawa', name: 'Nasarawa', path: 'M 275,200 L 345,200 L 335,245 L 265,245 Z', labelX: 305, labelY: 222 },
  { id: 'fct', name: 'Abuja (FCT)', path: 'M 255,180 L 295,180 L 290,210 L 250,210 Z', labelX: 272, labelY: 195 },
  { id: 'niger', name: 'Niger', path: 'M 160,110 L 275,110 L 265,180 L 150,180 Z', labelX: 212, labelY: 145 },
  { id: 'kaduna', name: 'Kaduna', path: 'M 265,95 L 350,95 L 340,165 L 255,165 Z', labelX: 302, labelY: 130 },
  { id: 'kano', name: 'Kano', path: 'M 295,45 L 380,45 L 370,105 L 285,105 Z', labelX: 332, labelY: 75 },
  { id: 'jigawa', name: 'Jigawa', path: 'M 360,40 L 420,40 L 410,100 L 350,100 Z', labelX: 385, labelY: 70 },
  { id: 'katsina', name: 'Katsina', path: 'M 225,35 L 295,35 L 285,95 L 215,95 Z', labelX: 255, labelY: 65 },
  { id: 'zamfara', name: 'Zamfara', path: 'M 165,50 L 235,50 L 225,110 L 155,110 Z', labelX: 195, labelY: 80 },
  { id: 'sokoto', name: 'Sokoto', path: 'M 95,30 L 180,30 L 170,80 L 85,80 Z', labelX: 132, labelY: 55 },
  { id: 'kebbi', name: 'Kebbi', path: 'M 80,75 L 160,75 L 150,150 L 70,150 Z', labelX: 115, labelY: 112 }
];

export default function NigeriaMap({ data, selectedState, onSelectState }: NigeriaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Find max visitors to compute color intensity
  const maxVisitors = Math.max(...Object.values(data).map(d => d.visitors), 1);

  const getFillColor = (stateName: string) => {
    const isSelected = selectedState === stateName;
    const isHovered = hoveredState === stateName;
    const stateStat = data[stateName];

    if (!stateStat || stateStat.visitors === 0) {
      if (isSelected) return '#10b981';
      if (isHovered) return '#cbd5e1';
      return '#f1f5f9';
    }

    const ratio = Math.min(1, stateStat.visitors / maxVisitors);
    
    if (isSelected) return '#059669'; // High contrast green accent for active state
    if (isHovered) return '#0284c7'; // Active sky blue hover

    // Dynamic blue intensity gradient
    if (ratio > 0.6) return '#0f172a'; // Heavy navy
    if (ratio > 0.3) return '#1e40af'; // Solid royal blue
    if (ratio > 0.1) return '#3b82f6'; // Bright blue
    return '#93c5fd'; // Soft blue
  };

  const activeHoverData = hoveredState ? data[hoveredState] : null;

  return (
    <div className="relative bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <span>🇳🇬</span> Audience Geographic Map (Nigeria)
          </h3>
          <p className="text-xs text-gray-500">Interactive intensity distribution by visitor state</p>
        </div>
        {selectedState !== 'All' && (
          <button
            onClick={() => onSelectState('All')}
            className="text-xs text-primary font-semibold hover:underline bg-primary/5 px-2.5 py-1 rounded"
          >
            Reset Filter ({selectedState})
          </button>
        )}
      </div>

      <div className="relative w-full aspect-[4/3] max-h-[420px] flex items-center justify-center bg-surface-container-lowest rounded-lg border border-dashed border-gray-200 overflow-hidden">
        <svg viewBox="0 0 650 460" className="w-full h-full">
          <defs>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Ocean & surrounding vector background */}
          <rect width="650" height="460" fill="#f8fafc" />

          {/* Map paths */}
          <g filter="url(#shadow)">
            {NIGERIA_STATE_BOUNDS.map((st) => {
              const stat = data[st.name];
              const isSelected = selectedState === st.name;

              return (
                <g key={st.id} className="cursor-pointer transition-all duration-200">
                  <path
                    d={st.path}
                    fill={getFillColor(st.name)}
                    stroke={isSelected ? '#ffffff' : '#ffffff'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    className="hover:opacity-90 transition-all"
                    onMouseEnter={() => setHoveredState(st.name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => onSelectState(selectedState === st.name ? 'All' : st.name)}
                  />
                  <text
                    x={st.labelX}
                    y={st.labelY}
                    fill={stat && stat.visitors > 0 ? '#ffffff' : '#64748b'}
                    fontSize={st.name === 'Lagos' || st.name === 'Abuja (FCT)' ? '10' : '9'}
                    fontWeight={isSelected ? '800' : '600'}
                    textAnchor="middle"
                    pointerEvents="none"
                    className="select-none font-sans"
                  >
                    {st.name === 'Abuja (FCT)' ? 'FCT' : st.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-primary text-white p-3 rounded-lg shadow-lg border border-white/20 text-xs z-10 max-w-[200px] animate-fade-in pointer-events-none">
            <p className="font-bold text-secondary-container">{hoveredState}</p>
            {activeHoverData ? (
              <div className="mt-1 space-y-0.5 font-mono text-[11px]">
                <p>Visitors: <span className="text-white font-bold">{activeHoverData.visitors.toLocaleString()}</span></p>
                <p>Share: <span className="text-white font-bold">{activeHoverData.percentage.toFixed(1)}%</span></p>
                <p>Uniques: <span className="text-white font-bold">{activeHoverData.uniqueVisitors.toLocaleString()}</span></p>
                <p>Avg Time: <span className="text-white font-bold">{activeHoverData.avgEngagement}</span></p>
              </div>
            ) : (
              <p className="text-white/60 text-[10px] mt-1">No traffic recorded yet for this state</p>
            )}
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2 rounded border border-gray-200 text-[10px] font-mono flex items-center gap-2">
          <span className="font-bold text-gray-700">Traffic Density:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#f1f5f9] border border-gray-300 inline-block" title="0 visitors"></span>
            <span>0</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#93c5fd] inline-block" title="Low"></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#3b82f6] inline-block" title="Moderate"></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#0f172a] inline-block" title="High"></span>
            <span>Max ({maxVisitors})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
