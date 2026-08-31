import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, MapPin, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MarketIntelView: React.FC = () => {
  const { marketPrices } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Nigerian Commodity Price Intelligence</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time physical terminal market prices, regional price variances, and 7-day volatility trends across Nigeria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(marketPrices || []).map(item => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{item.commodity}</h3>
                <span className="text-xs text-slate-400">Unit: {item.unit}</span>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-slate-900">
                  ₦{(item.nationalAvgPriceNGN || 0).toLocaleString()}
                </div>
                <div
                  className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                    (item.change7DaysPercent || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {(item.change7DaysPercent || 0) >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {(item.change7DaysPercent || 0) >= 0 ? '+' : ''}
                    {item.change7DaysPercent || 0}% (7d)
                  </span>
                </div>
              </div>
            </div>

            {/* Regional Terminal Breakdown */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Regional Terminal Benchmarks:
              </div>
              <div className="space-y-1 text-slate-600">
                {Object.entries(item.regionalPricesNGN || {}).map(([region, price]) => (
                  <div key={region} className="flex justify-between items-center">
                    <span className="capitalize">{region} Corridor:</span>
                    <span className="font-semibold text-slate-900">₦{(Number(price) || 0).toLocaleString()} NGN</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Source: Mile 12, Dawanau & Bodija Terminals</span>
              <span>Updated Today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
