import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  Sparkles, 
  Loader2, 
  Building2, 
  Percent, 
  MapPin, 
  Calendar,
  Layers,
  Check,
  DollarSign
} from 'lucide-react';
import { evaluateValuation } from '../api';

export default function Valuation({ demoSamples, onValuationSaved }) {
  const [propertyLocation, setPropertyLocation] = useState('Bengaluru, Whitefield');
  const [propertyType, setPropertyType] = useState('Residential Apartment');
  const [builtUpArea, setBuiltUpArea] = useState(1650);
  const [buildingAge, setBuildingAge] = useState(2);
  const [qualityGrade, setQualityGrade] = useState('Premium');
  const [amenities, setAmenities] = useState([
    'Power Backup', 'Covered Parking', '24/7 Security', 'Clubhouse'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const availableAmenities = [
    'Power Backup', 'Covered Parking', '24/7 Security', 'Clubhouse',
    'Swimming Pool', 'Gymnasium', 'EV Charging Point', 'Rainwater Harvesting'
  ];

  const toggleAmenity = (name) => {
    if (amenities.includes(name)) {
      setAmenities(amenities.filter((a) => a !== name));
    } else {
      setAmenities([...amenities, name]);
    }
  };

  const loadDemo = () => {
    setPropertyLocation('Bengaluru, Indiranagar');
    setPropertyType('Residential Apartment');
    setBuiltUpArea(1850);
    setBuildingAge(3);
    setQualityGrade('Premium');
    setAmenities(['Power Backup', 'Covered Parking', '24/7 Security', 'Gymnasium', 'Swimming Pool']);
    setError('');
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError('');
    try {
      // Safe fallback defaults for partial inputs
      const payload = {
        property_location: propertyLocation.trim() || 'Metro City, Central Area',
        location_tier: 'Tier 1 Suburban',
        built_up_area_sqft: parseFloat(builtUpArea) > 0 ? parseFloat(builtUpArea) : 1200.0,
        building_age_years: parseInt(buildingAge) >= 0 ? parseInt(buildingAge) : 2,
        property_type: propertyType || 'Residential Apartment',
        quality_grade: qualityGrade || 'Standard',
        amenities: amenities.length > 0 ? amenities : ['Covered Parking'],
        currency: 'INR'
      };

      const data = await evaluateValuation(payload);
      setResult(data);
      if (onValuationSaved) onValuationSaved();
    } catch (err) {
      setError(err.message || 'Valuation evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Home className="w-7 h-7 text-emerald-400" />
            Real Estate Valuation & Investment Intelligence Engine
          </h2>
          <p className="text-sm text-slate-400">
            Algorithmic property valuation calculating fair market value ranges, price per sq.ft, monthly rental income, and 5-year capital appreciation in Indian Rupees (₹).
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Bengaluru Apartment Demo
        </button>
      </div>

      {/* Grid: Form vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Property Specifications & Parameters
            </h3>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Property Location / Neighborhood
              </label>
              <input
                type="text"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Whitefield / Mumbai, Bandra"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Property Asset Class
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Residential Apartment">Residential Apartment / Flat</option>
                <option value="Independent Villa">Independent Villa / Row House</option>
                <option value="Commercial Office Space">Commercial Office Space</option>
                <option value="Retail Space / Showroom">Retail Space / Showroom</option>
                <option value="Industrial Warehouse">Industrial Warehouse</option>
              </select>
            </div>

            {/* Built-up area & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Built-up Area (Sq.Ft)
                </label>
                <input
                  type="number"
                  min="200"
                  max="100000"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Building Age (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={buildingAge}
                  onChange={(e) => setBuildingAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Construction & Finish Quality
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="Economy">Economy / Standard Builder Spec</option>
                <option value="Standard">Standard Modern Finishes</option>
                <option value="Premium">Premium Grade-A Finishes</option>
                <option value="Luxury Ultra">Ultra Luxury / Imported Specifications</option>
              </select>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Amenities & Infrastructural Factors
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableAmenities.map((am) => {
                  const active = amenities.includes(am);
                  return (
                    <button
                      key={am}
                      type="button"
                      onClick={() => toggleAmenity(am)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      <span>{am}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Market Valuation...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Compute Real Estate Valuation (₹)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Valuation Results (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Primary Value Card (in INR ₹) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Estimated Fair Market Value (₹ INR)
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Investment Score: {result.investment_score}/100
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {formatINR(result.estimated_fair_value)}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">
                    (₹{Math.round(result.price_per_sqft || 0).toLocaleString()} / sq.ft)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                  <span>Valuation Range (Low — High):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {formatINR(result.valuation_range_low)} — {formatINR(result.valuation_range_high)}
                  </span>
                </div>

                {/* Rental & ROI metrics */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Gross Rental Yield (ROI)</span>
                    <span className="text-lg font-bold text-sky-400 font-mono mt-0.5 block">
                      {result.rental_yield_estimate_pct}% per annum
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 block">Estimated Monthly Rental</span>
                    <span className="text-lg font-bold text-amber-400 font-mono mt-0.5 block">
                      {formatINR(result.monthly_rental_estimate)} / mo
                    </span>
                  </div>
                </div>
              </div>

              {/* 5-Year Capital Appreciation Outlook */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  5-Year Capital Appreciation Forecast (₹)
                </h4>

                <div className="grid grid-cols-5 gap-2 text-center">
                  {result.appreciation_forecast?.map((item) => (
                    <div
                      key={item.year}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-slate-400">{item.year}</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono my-1">
                        {formatINR(item.projected_value)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{item.growth_rate_pct}% YoY
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Comps Table */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Local Market Comparables (Comps)
                  </h4>
                  <span className="text-xs text-slate-500">{result.property_location}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Comparable Property</th>
                        <th className="py-2.5 px-4 font-semibold">Distance</th>
                        <th className="py-2.5 px-4 font-semibold">Sale Price</th>
                        <th className="py-2.5 px-4 font-semibold">Rate / Sq.Ft</th>
                        <th className="py-2.5 px-4 font-semibold">Similarity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.comparable_sales?.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-medium text-slate-200">{comp.property_name}</td>
                          <td className="py-2.5 px-4 text-slate-400">{comp.distance_miles} mi</td>
                          <td className="py-2.5 px-4 text-emerald-400 font-mono font-semibold">
                            {formatINR(comp.sale_price)}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300 font-mono">₹{Math.round(comp.price_per_sqft || 0).toLocaleString()}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-400 border border-slate-700">
                              {comp.similarity_score}% Match
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategic SWOT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Strengths & Rental Drivers
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {result.swot_analysis?.Strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Market Risks & Considerations
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {result.swot_analysis?.Risks?.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <Home className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Valuation Parameters</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Input your property details or click 'Load Bengaluru Apartment Demo' to generate market values and ROI projections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
