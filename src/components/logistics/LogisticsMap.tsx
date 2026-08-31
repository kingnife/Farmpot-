import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Truck,
  Layers,
  Thermometer,
  ShieldCheck,
  Zap,
  Clock,
  Compass,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { TransportJob, LogisticsCheckpoint } from '../../types';

interface LogisticsMapProps {
  logistics: TransportJob;
  onSelectCheckpoint?: (chk: LogisticsCheckpoint) => void;
  selectedCheckpointId?: string | null;
}

export const LogisticsMap: React.FC<LogisticsMapProps> = ({
  logistics,
  onSelectCheckpoint,
  selectedCheckpointId,
}) => {
  const [mapMode, setMapMode] = useState<'STANDARD' | 'SATELLITE' | 'COLD_CHAIN'>('STANDARD');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Map projection helpers for Nigerian geographical boundaries
  // Lat: 4.2°N to 13.8°N, Lng: 2.7°E to 14.2°E
  const projectCoordinates = (lat: number, lng: number) => {
    const minLng = 2.6;
    const maxLng = 14.4;
    const minLat = 4.2;
    const maxLat = 13.8;

    const x = ((lng - minLng) / (maxLng - minLng)) * 760 + 20;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 460 + 30;

    return { x: Math.max(20, Math.min(780, x)), y: Math.max(25, Math.min(495, y)) };
  };

  // Pre-defined key Nigerian transport hubs
  const majorHubs = [
    { name: 'Kano (Dawanau)', lat: 12.0022, lng: 8.592, region: 'NORTH' },
    { name: 'Zaria (Agro Hub)', lat: 11.0855, lng: 7.7199, region: 'NORTH' },
    { name: 'Kaduna Central', lat: 10.5105, lng: 7.4165, region: 'NORTH' },
    { name: 'Jos Cold Plateau', lat: 9.8965, lng: 8.8583, region: 'MIDDLE' },
    { name: 'Abuja FCT', lat: 9.0765, lng: 7.3986, region: 'MIDDLE' },
    { name: 'Lokoja Confluence', lat: 7.8023, lng: 6.743, region: 'MIDDLE' },
    { name: 'Makurdi (Benue)', lat: 7.7322, lng: 8.5391, region: 'MIDDLE' },
    { name: 'Ibadan Agro Plaza', lat: 7.3775, lng: 3.947, region: 'SOUTH' },
    { name: 'Ogun / Sagamu', lat: 6.8333, lng: 3.65, region: 'SOUTH' },
    { name: 'Lagos (Mile 12/Ikeja)', lat: 6.5244, lng: 3.3792, region: 'SOUTH' },
    { name: 'Port Harcourt Hub', lat: 4.8156, lng: 7.0498, region: 'SOUTH' },
    { name: 'Enugu 9th Mile', lat: 6.4584, lng: 7.5464, region: 'SOUTH' },
  ];

  // Route checkpoints from current logistics job
  const checkpoints = logistics.checkpoints || [
    {
      id: 'chk-1',
      name: logistics.pickupLocation || 'Origin Farm Depot',
      state: logistics.pickupState || 'Kaduna',
      status: 'COMPLETED' as const,
      lat: logistics.originCoordinates?.lat || 11.0855,
      lng: logistics.originCoordinates?.lng || 7.7199,
      timestamp: '06:15 AM',
      temperatureC: logistics.temperatureCelsius || 11.2,
      notes: 'Dispatched & Sealed'
    },
    {
      id: 'chk-2',
      name: logistics.currentLocation || 'Transit Waypoint',
      state: 'Kogi',
      status: 'IN_PROGRESS' as const,
      lat: logistics.currentCoordinates?.lat || 7.8023,
      lng: logistics.currentCoordinates?.lng || 6.743,
      timestamp: 'Active Now',
      temperatureC: logistics.temperatureCelsius || 11.2,
      notes: 'Moving on A2 Corridor'
    },
    {
      id: 'chk-3',
      name: logistics.deliveryLocation || 'Destination Terminal',
      state: logistics.deliveryState || 'Lagos',
      status: 'PENDING' as const,
      lat: logistics.destinationCoordinates?.lat || 6.5244,
      lng: logistics.destinationCoordinates?.lng || 3.3792,
      notes: 'Final Offloading Dock'
    }
  ];

  // Calculate coordinates for route
  const projectedCheckpoints = checkpoints.map(chk => {
    const coords = projectCoordinates(chk.lat || 8.0, chk.lng || 6.5);
    return { ...chk, projectedX: coords.x, projectedY: coords.y };
  });

  // Current active truck position
  const activeCheckpoint = projectedCheckpoints.find(c => c.status === 'IN_PROGRESS') || projectedCheckpoints[Math.min(1, projectedCheckpoints.length - 1)];
  const currentPos = logistics.currentCoordinates
    ? projectCoordinates(logistics.currentCoordinates.lat, logistics.currentCoordinates.lng)
    : { x: activeCheckpoint?.projectedX || 400, y: activeCheckpoint?.projectedY || 260 };

  // Generate SVG path for route
  const routePathD = projectedCheckpoints.reduce((acc, pt, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${pt.projectedX} ${pt.projectedY}`;
  }, '');

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 text-white overflow-hidden shadow-2xl relative">
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                Corridor: {logistics.pickupState} → {logistics.deliveryState}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live GPS Radar
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Current: <strong className="text-slate-200">{logistics.currentLocation || 'In Transit'}</strong></span>
              <span>•</span>
              <span className="text-blue-300">Speed: {logistics.speedKmH || 64} km/h</span>
            </div>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMapMode('STANDARD')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mapMode === 'STANDARD'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arterial Routes
          </button>
          <button
            type="button"
            onClick={() => setMapMode('COLD_CHAIN')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'COLD_CHAIN'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-teal-300'
            }`}
          >
            <Thermometer className="w-3 h-3" />
            <span>Thermal Band</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('SATELLITE')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mapMode === 'SATELLITE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Topographic
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-2">
        {/* Background Grid & Compass Watermark */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Compass Rose */}
        <div className="absolute bottom-4 right-4 text-slate-700/60 pointer-events-none flex flex-col items-center">
          <Compass className="w-12 h-12 stroke-1" />
          <span className="text-[9px] font-mono tracking-widest mt-1">NIGERIA AGRO CORRIDORS</span>
        </div>

        {/* Live Telemetry Float Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md shadow-xl text-xs space-y-2 max-w-[220px]">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            <span>Reefer Telemetry</span>
            <span className="text-emerald-400">Connected</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-slate-300">Cabin Temp:</span>
            <span className="text-base font-black text-emerald-400">
              {logistics.temperatureCelsius || 11.2}°C
            </span>
          </div>

          <div className="flex items-baseline justify-between text-[11px]">
            <span className="text-slate-400">Cargo Humidity:</span>
            <span className="font-semibold text-slate-200">{logistics.humidityPercent || 82}% RH</span>
          </div>

          <div className="flex items-baseline justify-between text-[11px]">
            <span className="text-slate-400">Digital Seal:</span>
            <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {logistics.cargoSealNumber || 'SEAL-OK'}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            ETA: <strong className="text-blue-300">{logistics.estimatedTimeOfArrival || '5h 30m'}</strong>
          </div>
        </div>

        {/* SVG Drawing */}
        <svg
          viewBox="0 0 800 520"
          className="w-full h-full max-w-full max-h-full drop-shadow-md select-none"
        >
          <defs>
            {/* Gradient for Route Line */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulse animation for active position */}
            <radialGradient id="pulseGlow">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Stylized Nigeria National Boundaries Outline */}
          <path
            d="M 120 440 
               C 80 430, 40 400, 35 340 
               C 30 280, 50 200, 110 130 
               C 160 80, 260 50, 390 45 
               C 520 40, 680 70, 750 140 
               C 780 180, 770 260, 740 310 
               C 700 370, 660 410, 600 440 
               C 520 470, 430 480, 330 475 
               C 240 470, 160 460, 120 440 Z"
            fill={mapMode === 'SATELLITE' ? '#0f172a' : '#090d16'}
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Stylized Rivers: River Niger & River Benue Confluence at Lokoja */}
          {/* River Niger entering NW down to Lokoja and south to Niger Delta */}
          <path
            d="M 160 140 Q 280 220 380 290 Q 420 360 400 455"
            fill="none"
            stroke="#0369a1"
            strokeWidth="3.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          {/* River Benue entering NE down to Lokoja */}
          <path
            d="M 720 220 Q 560 270 380 290"
            fill="none"
            stroke="#0369a1"
            strokeWidth="3.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          <text x="390" y="285" fill="#38bdf8" fontSize="9" opacity="0.6" fontStyle="italic">
            Lokoja Confluence
          </text>

          {/* Regional Agro Corridor Arteries (Background Highway Grid) */}
          <g opacity="0.25" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3">
            {/* North-South Trunk A2 */}
            <path d="M 460 70 L 415 155 L 400 230 L 380 290 L 250 370 L 220 425" />
            {/* Jos to Abuja */}
            <path d="M 470 200 L 400 230" />
            {/* Benue to East-West */}
            <path d="M 460 300 L 430 380 L 420 450" />
            {/* Lagos to Ibadan */}
            <path d="M 220 425 L 250 370" />
          </g>

          {/* Major National Transit Hub Markers */}
          {majorHubs.map(hub => {
            const pos = projectCoordinates(hub.lat, hub.lng);
            const isHovered = hoveredNode === hub.name;
            return (
              <g
                key={hub.name}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredNode(hub.name)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 5 : 3.5}
                  fill={hub.region === 'NORTH' ? '#38bdf8' : hub.region === 'MIDDLE' ? '#10b981' : '#f59e0b'}
                  opacity={isHovered ? 0.9 : 0.4}
                />
                <text
                  x={pos.x + 6}
                  y={pos.y + 3}
                  fill="#94a3b8"
                  fontSize="8.5"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  opacity={isHovered ? 1 : 0.55}
                >
                  {hub.name}
                </text>
              </g>
            );
          })}

          {/* Active Freight Route Path (Glow + Line) */}
          <path
            d={routePathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            filter="url(#glow)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={routePathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Checkpoint Nodes on Route */}
          {projectedCheckpoints.map((pt, idx) => {
            const isPassed = pt.status === 'COMPLETED';
            const isCurrent = pt.status === 'IN_PROGRESS';
            const isSelected = selectedCheckpointId === pt.id;

            return (
              <g
                key={pt.id}
                id={`checkpoint-node-${pt.id}`}
                className="cursor-pointer"
                onClick={() => onSelectCheckpoint && onSelectCheckpoint(pt)}
              >
                {/* Outer Target Circle */}
                <circle
                  cx={pt.projectedX}
                  cy={pt.projectedY}
                  r={isSelected ? 14 : 10}
                  fill={isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#334155'}
                  opacity={isCurrent ? 0.3 : 0.2}
                  className={isCurrent ? 'animate-pulse' : ''}
                />

                {/* Node Center Pin */}
                <circle
                  cx={pt.projectedX}
                  cy={pt.projectedY}
                  r={isSelected ? 6.5 : 5}
                  fill={isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Checkpoint Label Pill */}
                <rect
                  x={pt.projectedX - 45}
                  y={pt.projectedY - 24}
                  width="90"
                  height="16"
                  rx="8"
                  fill="#0f172a"
                  stroke={isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#475569'}
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x={pt.projectedX}
                  y={pt.projectedY - 13}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  {pt.name.length > 15 ? `${pt.name.substring(0, 13)}...` : pt.name}
                </text>
              </g>
            );
          })}

          {/* Active Truck Animated Vehicle Marker */}
          <g transform={`translate(${currentPos.x}, ${currentPos.y})`}>
            {/* Radar Wave Pulse */}
            <circle r="22" fill="url(#pulseGlow)" className="animate-ping" opacity="0.75" />
            <circle r="14" fill="#0284c7" opacity="0.4" />
            
            {/* Truck Pin Shield */}
            <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            
            {/* Vehicle Icon representation */}
            <path
              d="M -4 -2 L 2 -2 L 4 0 L 4 3 L -4 3 Z"
              fill="#ffffff"
            />
            <circle cx="-2" cy="3.5" r="1" fill="#0f172a" />
            <circle cx="2.5" cy="3.5" r="1" fill="#0f172a" />

            {/* Vehicle Heading Speed Flag */}
            <g transform="translate(12, -10)">
              <rect x="0" y="0" width="70" height="20" rx="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
              <text x="35" y="10" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                {logistics.vehiclePlate || 'TRUCK-REEFER'}
              </text>
              <text x="35" y="17" textAnchor="middle" fill="#bae6fd" fontSize="6.5">
                {logistics.speedKmH || 64} km/h • {logistics.temperatureCelsius || 11.2}°C
              </text>
            </g>
          </g>
        </svg>

        {/* Bottom Legend Bar */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Completed Milestone
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              Active Telemetry (In-Transit)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              Upcoming Gate
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300">
              Distance: <strong className="text-white">{logistics.distanceCoveredKm || 460} km</strong> / {logistics.distanceTotalKm || 780} km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
