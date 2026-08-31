import React, { useState } from 'react';
import {
  Thermometer,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Gauge,
  Snowflake,
  Wind,
  AlertTriangle,
  RotateCw,
  Sliders
} from 'lucide-react';
import { TransportJob } from '../../types';

interface ColdChainTelemetryCardProps {
  logistics: TransportJob;
  onUpdateTelemetry?: (temp: number, notes?: string) => void;
  canEdit?: boolean;
}

export const ColdChainTelemetryCard: React.FC<ColdChainTelemetryCardProps> = ({
  logistics,
  onUpdateTelemetry,
  canEdit = false,
}) => {
  const [sliderTemp, setSliderTemp] = useState<number>(logistics.temperatureCelsius || 11.2);
  const [isCompressorActive, setIsCompressorActive] = useState<boolean>(true);

  const history = logistics.temperatureHistory && logistics.temperatureHistory.length > 0
    ? logistics.temperatureHistory
    : [
        { time: '06:00 AM', tempC: 10.8, location: 'Kaduna Depot Loading' },
        { time: '08:30 AM', tempC: 11.4, location: 'Abuja Toll Bypass' },
        { time: '11:00 AM', tempC: 11.8, location: 'Lokoja Confluence Transit' },
        { time: '01:30 PM', tempC: 11.2, location: 'Ibadan Corridor Expressway' },
      ];

  const currentTemp = logistics.temperatureCelsius !== undefined ? logistics.temperatureCelsius : sliderTemp;

  // Safe range for fresh agricultural produce (Tomatoes/Produce) is 8°C - 14°C
  const minSafe = 8.0;
  const maxSafe = 14.0;
  const isSafe = currentTemp >= minSafe && currentTemp <= maxSafe;
  const isExcursion = currentTemp > maxSafe + 2 || currentTemp < minSafe - 2;

  // Chart coordinates mapping (Width 360, Height 100)
  const minTempChart = 5;
  const maxTempChart = 20;

  const points = history.map((pt, i) => {
    const x = history.length > 1 ? (i / (history.length - 1)) * 320 + 20 : 180;
    const y = 85 - ((pt.tempC - minTempChart) / (maxTempChart - minTempChart)) * 70;
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  const handleApplyTemp = () => {
    if (onUpdateTelemetry) {
      onUpdateTelemetry(sliderTemp, `Reefer temperature adjusted to ${sliderTemp}°C`);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
            <Snowflake className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>IoT Cold-Chain Telemetry</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isSafe
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              }`}>
                {isSafe ? 'OPTIMAL SAFE ZONE' : 'TEMP EXCURSION WARNING'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ThermoKing Reefer Unit #TK-8402 • Continuous sensor stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span className="text-[11px] font-mono text-teal-400">LIVE SENSORS SYNCED</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Cabin Temperature */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>Cargo Cabin</span>
            <Thermometer className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">
            {currentTemp.toFixed(1)}°C
          </div>
          <div className="text-[10px] text-slate-500">
            Target: 10.0°C – 12.0°C
          </div>
        </div>

        {/* Ambient Outside */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>Ambient Road</span>
            <Wind className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            31.4°C
          </div>
          <div className="text-[10px] text-slate-500">
            Delta: -{(31.4 - currentTemp).toFixed(1)}°C chill
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>Humidity (RH)</span>
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">
            {logistics.humidityPercent || 84}%
          </div>
          <div className="text-[10px] text-slate-500">
            Prevents Produce Desiccation
          </div>
        </div>

        {/* Compressor Power */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>Compressor</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            100% ECO
          </div>
          <div className="text-[10px] text-slate-500">
            Hybrid Diesel/Aux Battery
          </div>
        </div>
      </div>

      {/* Temperature Time-Series Graph */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            Temperature Log Over Journey (8h Transit Window)
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">0 Excursions Recorded</span>
        </div>

        {/* SVG Sparkline / Line Chart */}
        <div className="relative w-full h-28 bg-slate-900/60 rounded-xl p-2 flex items-center justify-center">
          {/* Safe Zone Background Band */}
          <div
            className="absolute left-2 right-2 bg-teal-500/10 border-y border-teal-500/20 pointer-events-none"
            style={{ top: '25%', height: '45%' }}
          >
            <span className="absolute right-2 top-1 text-[9px] font-mono text-teal-400/80">
              Safe Band (8°C - 14°C)
            </span>
          </div>

          <svg viewBox="0 0 360 100" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="20" y1="20" x2="340" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
            <line x1="20" y1="50" x2="340" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
            <line x1="20" y1="80" x2="340" y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

            {/* Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points with Tooltips */}
            {points.map((pt, idx) => (
              <g key={idx} className="cursor-pointer group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#0f172a"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="#2dd4bf"
                  opacity="0"
                  className="group-hover:opacity-30 transition-opacity"
                />
                {/* Text on point */}
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {pt.tempC}°C
                </text>
                <text
                  x={pt.x}
                  y="96"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="7"
                >
                  {pt.time}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Driver / Transporter Temperature Adjustment & Simulator */}
      {canEdit && (
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Reefer Temperature Regulator (Transporter Controls)
            </span>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700/50">
              Set Point: {sliderTemp.toFixed(1)}°C
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">4°C Chill</span>
            <input
              type="range"
              min="4"
              max="24"
              step="0.2"
              value={sliderTemp}
              onChange={(e) => setSliderTemp(parseFloat(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[11px] text-slate-400">24°C Ambient</span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleApplyTemp}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Sync Sensor to Cloud
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
