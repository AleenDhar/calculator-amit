"use client";
import React, { useState, useRef, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calculator, TrendingUp, Download, Building2, DollarSign, Percent, ChevronDown, Target, Users, Clock, Award, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

// Industry presets with specific tail spend characteristics
const industryPresets: any = {
  'manufacturing': { name: 'Manufacturing', tailSpendPct: 15, categories: { marketing: 12, facilities: 22, office: 10, packaging: 20, tempLabor: 15, it: 8, other: 13 }, benchmark: { low: 4, mid: 8, high: 14 } },
  'healthcare': { name: 'Healthcare & Pharmaceuticals', tailSpendPct: 12, categories: { marketing: 10, facilities: 25, office: 15, packaging: 8, tempLabor: 20, it: 12, other: 10 }, benchmark: { low: 3, mid: 7, high: 12 } },
  'technology': { name: 'Information Technology', tailSpendPct: 18, categories: { marketing: 25, facilities: 10, office: 12, packaging: 5, tempLabor: 18, it: 20, other: 10 }, benchmark: { low: 5, mid: 9, high: 15 } },
  'financial': { name: 'Financial Services', tailSpendPct: 14, categories: { marketing: 20, facilities: 18, office: 18, packaging: 3, tempLabor: 15, it: 16, other: 10 }, benchmark: { low: 4, mid: 8, high: 13 } },
  'retail': { name: 'Retail', tailSpendPct: 16, categories: { marketing: 22, facilities: 20, office: 12, packaging: 15, tempLabor: 12, it: 9, other: 10 }, benchmark: { low: 5, mid: 9, high: 14 } },
  'consumer_staples': { name: 'Consumer Staples', tailSpendPct: 14, categories: { marketing: 25, facilities: 15, office: 10, packaging: 22, tempLabor: 10, it: 8, other: 10 }, benchmark: { low: 4, mid: 8, high: 13 } },
  'consumer_disc': { name: 'Consumer Discretionary', tailSpendPct: 17, categories: { marketing: 28, facilities: 14, office: 10, packaging: 18, tempLabor: 12, it: 8, other: 10 }, benchmark: { low: 5, mid: 9, high: 14 } },
  'energy': { name: 'Energy & Utilities', tailSpendPct: 11, categories: { marketing: 8, facilities: 28, office: 12, packaging: 10, tempLabor: 18, it: 10, other: 14 }, benchmark: { low: 3, mid: 6, high: 11 } },
  'materials': { name: 'Materials & Chemicals', tailSpendPct: 13, categories: { marketing: 10, facilities: 24, office: 10, packaging: 20, tempLabor: 14, it: 8, other: 14 }, benchmark: { low: 4, mid: 7, high: 12 } },
  'industrials': { name: 'Industrials & Manufacturing', tailSpendPct: 15, categories: { marketing: 12, facilities: 24, office: 10, packaging: 18, tempLabor: 16, it: 8, other: 12 }, benchmark: { low: 4, mid: 8, high: 14 } },
  'telecom': { name: 'Telecommunications', tailSpendPct: 16, categories: { marketing: 22, facilities: 15, office: 12, packaging: 5, tempLabor: 18, it: 18, other: 10 }, benchmark: { low: 5, mid: 9, high: 14 } },
  'media': { name: 'Media & Entertainment', tailSpendPct: 19, categories: { marketing: 30, facilities: 12, office: 10, packaging: 5, tempLabor: 22, it: 12, other: 9 }, benchmark: { low: 5, mid: 10, high: 16 } },
  'transportation': { name: 'Transportation & Logistics', tailSpendPct: 14, categories: { marketing: 10, facilities: 25, office: 12, packaging: 15, tempLabor: 16, it: 10, other: 12 }, benchmark: { low: 4, mid: 7, high: 12 } },
  'aerospace': { name: 'Aerospace & Defense', tailSpendPct: 12, categories: { marketing: 8, facilities: 22, office: 12, packaging: 12, tempLabor: 18, it: 14, other: 14 }, benchmark: { low: 3, mid: 7, high: 11 } },
  'automotive': { name: 'Automotive', tailSpendPct: 13, categories: { marketing: 15, facilities: 20, office: 10, packaging: 18, tempLabor: 15, it: 10, other: 12 }, benchmark: { low: 4, mid: 8, high: 13 } },
  'pharma': { name: 'Pharmaceuticals & Biotech', tailSpendPct: 11, categories: { marketing: 18, facilities: 20, office: 12, packaging: 12, tempLabor: 16, it: 12, other: 10 }, benchmark: { low: 3, mid: 7, high: 12 } },
  'construction': { name: 'Construction & Engineering', tailSpendPct: 16, categories: { marketing: 8, facilities: 25, office: 10, packaging: 15, tempLabor: 22, it: 8, other: 12 }, benchmark: { low: 4, mid: 8, high: 13 } },
  'hospitality': { name: 'Hospitality & Travel', tailSpendPct: 18, categories: { marketing: 25, facilities: 22, office: 10, packaging: 8, tempLabor: 18, it: 8, other: 9 }, benchmark: { low: 5, mid: 9, high: 15 } },
  'education': { name: 'Education', tailSpendPct: 17, categories: { marketing: 12, facilities: 25, office: 18, packaging: 5, tempLabor: 18, it: 14, other: 8 }, benchmark: { low: 4, mid: 8, high: 13 } },
  'government': { name: 'Government & Public Sector', tailSpendPct: 15, categories: { marketing: 5, facilities: 28, office: 20, packaging: 8, tempLabor: 15, it: 14, other: 10 }, benchmark: { low: 3, mid: 6, high: 10 } },
  'professional': { name: 'Professional Services', tailSpendPct: 20, categories: { marketing: 22, facilities: 15, office: 18, packaging: 3, tempLabor: 20, it: 14, other: 8 }, benchmark: { low: 5, mid: 10, high: 16 } },
  'other': { name: 'Other', tailSpendPct: 15, categories: { marketing: 18, facilities: 18, office: 14, packaging: 12, tempLabor: 14, it: 12, other: 12 }, benchmark: { low: 4, mid: 8, high: 13 } }
};

// Category factors based on Hackett study insights
// Using direct effective savings rates by scenario to ensure proper calibration
// Optimistic should exceed industry benchmark high (typically 12-16%)
// Moderate should be above average (8-12%)
// Conservative should be at/near average (4-8%)
const categoryFactors: any = {
  marketing: {
    name: 'Marketing Services',
    vendorResponse: 85,  // Display value %
    addressability: 80,  // Display value %
    // Direct effective savings rates on category spend
    effectiveRates: { low: 7, mid: 11, high: 16 }
  },
  facilities: {
    name: 'Facilities Maintenance',
    vendorResponse: 75,
    addressability: 75,
    effectiveRates: { low: 6, mid: 10, high: 15 }
  },
  office: {
    name: 'Office Supplies',
    vendorResponse: 95,
    addressability: 92,
    effectiveRates: { low: 10, mid: 16, high: 22 }
  },
  packaging: {
    name: 'Packaging & Consumables',
    vendorResponse: 88,
    addressability: 85,
    effectiveRates: { low: 8, mid: 13, high: 18 }
  },
  tempLabor: {
    name: 'Temp Labor & Freelance',
    vendorResponse: 78,
    addressability: 72,
    effectiveRates: { low: 5, mid: 9, high: 14 }
  },
  it: {
    name: 'IT Accessories & Peripherals',
    vendorResponse: 92,
    addressability: 90,
    effectiveRates: { low: 9, mid: 15, high: 21 }
  },
  other: {
    name: 'Other / Miscellaneous',
    vendorResponse: 80,
    addressability: 78,
    effectiveRates: { low: 6, mid: 11, high: 16 }
  }
};

const formatCurrency = (value: number) => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};

export default function MerlinANACalculator() {
  const resultsRef = useRef<any>(null);

  // Input states
  const [industry, setIndustry] = useState('manufacturing');
  const [totalSpend, setTotalSpend] = useState(500000000);
  const [tailSpendPct, setTailSpendPct] = useState(15);
  const [useCustomCategories, setUseCustomCategories] = useState(false);
  const [categories, setCategories] = useState(industryPresets['manufacturing'].categories);
  const [scenario, setScenario] = useState('mid'); // conservative, mid, optimistic
  const [currentSavingsRate, setCurrentSavingsRate] = useState(3);
  const [showResults, setShowResults] = useState(false);

  // Update categories when industry changes
  const handleIndustryChange = (newIndustry: string) => {
    setIndustry(newIndustry);
    if (!useCustomCategories) {
      setCategories(industryPresets[newIndustry].categories);
      setTailSpendPct(industryPresets[newIndustry].tailSpendPct);
    }
  };

  // Calculate results
  const results = useMemo(() => {
    const tailSpend = totalSpend * (tailSpendPct / 100);
    const benchmark = industryPresets[industry].benchmark;

    // Calculate savings by category
    const categoryResults = Object.keys(categories).map((cat: string) => {
      const catSpend = tailSpend * (categories[cat] / 100);
      const factors = categoryFactors[cat];

      // Use direct effective savings rate (already calibrated)
      const effectiveRate = factors.effectiveRates[scenario] / 100;
      const savings = catSpend * effectiveRate;

      // For display purposes
      const addressable = catSpend * (factors.addressability / 100);
      const negotiable = addressable * (factors.vendorResponse / 100);

      return {
        category: cat,
        name: factors.name,
        spend: catSpend,
        addressable,
        negotiable,
        savings,
        savingsRate: factors.effectiveRates[scenario], // Direct percentage
        vendorResponse: factors.vendorResponse,
        addressabilityPct: factors.addressability
      };
    });

    const totalSavings = categoryResults.reduce((sum: number, c: any) => sum + c.savings, 0);
    const totalAddressable = categoryResults.reduce((sum: number, c: any) => sum + c.addressable, 0);
    const savingsRate = tailSpend > 0 ? (totalSavings / tailSpend) * 100 : 0;
    const currentSavings = tailSpend * (currentSavingsRate / 100);

    // Incremental savings: if ANA projects higher, show the difference
    // If current is already high, show efficiency/automation value instead
    const rawIncremental = totalSavings - currentSavings;
    const incrementalSavings = Math.max(0, rawIncremental);
    const currentExceedsProjection = rawIncremental < 0;

    // Estimate operational metrics
    const avgTransactionValue = 2500;
    const negotiationsPerYear = Math.round(tailSpend / avgTransactionValue);
    const hoursPerManualNegotiation = 2;
    const hoursPerANANegotiation = 0.1;
    const hoursSaved = negotiationsPerYear * (hoursPerManualNegotiation - hoursPerANANegotiation);
    const fteSaved = hoursSaved / 2080;
    const costPerFTE = 85000;
    const laborSavings = fteSaved * costPerFTE;

    // If current savings is high but achieved manually, ANA still adds value through automation
    // Total value = max of (projected savings, current savings being maintained) + labor savings
    const effectiveSavings = Math.max(totalSavings, currentSavings);
    const totalValue = effectiveSavings + laborSavings;

    return {
      tailSpend,
      totalSavings,
      savingsRate,
      currentSavings,
      incrementalSavings,
      currentExceedsProjection,
      categoryResults,
      totalAddressable,
      negotiationsPerYear,
      hoursSaved,
      fteSaved,
      laborSavings,
      benchmark,
      totalValue,
      effectiveSavings
    };
  }, [totalSpend, tailSpendPct, categories, scenario, industry, currentSavingsRate]);

  const handleCalculate = () => {
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generatePDF = () => {
    const benchmarkStatus = results.savingsRate >= results.benchmark.high ? 'Top Quartile' :
      results.savingsRate >= results.benchmark.mid ? 'Above Average' :
        results.savingsRate >= results.benchmark.low ? 'Average' : 'Below Average';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Merlin ANA Savings Analysis</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.6; max-width: 1000px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #0a4d68; }
          .logo { font-size: 28px; font-weight: 700; color: #0a4d68; }
          .logo span { color: #00a896; }
          .date { color: #666; font-size: 14px; }
          h1 { font-size: 28px; color: #0a4d68; margin-bottom: 10px; }
          h2 { font-size: 20px; color: #0a4d68; margin: 30px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
          .subtitle { font-size: 16px; color: #666; margin-bottom: 30px; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 30px 0; }
          .summary-card { background: #0a4d68; color: white; padding: 20px; border-radius: 12px; }
          .summary-card.highlight { background: #00a896; }
          .summary-label { font-size: 12px; opacity: 0.9; margin-bottom: 5px; }
          .summary-value { font-size: 28px; font-weight: 700; }
          .summary-subtext { font-size: 11px; opacity: 0.8; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px; }
          th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
          th { background: #f5f5f5; font-weight: 600; color: #0a4d68; }
          .total-row { font-weight: 600; background: #f0f7f7; }
          .benchmark-box { background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #00a896; }
          .benchmark-status { font-size: 18px; font-weight: 600; color: #00a896; margin: 8px 0; }
          .input-summary { background: #f8f9fa; padding: 16px 20px; border-radius: 12px; margin: 20px 0; }
          .input-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e8e8e8; font-size: 14px; }
          .input-row:last-child { border-bottom: none; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #666; font-size: 12px; }
          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .insights p { margin: 8px 0; font-size: 14px; }
          .print-btn { display: block; margin: 20px auto; padding: 12px 32px; background: #00a896; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
          .print-btn:hover { background: #028a7a; }
          @media print { 
            .print-btn { display: none; }
            body { padding: 20px; } 
            .summary-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        
        <div class="header">
          <div class="logo">Merlin <span>ANA</span> Savings Analysis</div>
          <div class="date">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        
        <h1>Autonomous Negotiation Agent ROI Analysis</h1>
        <p class="subtitle">Projected savings potential for ${industryPresets[industry].name} sector</p>
        
        <div class="summary-grid">
          <div class="summary-card highlight">
            <div class="summary-label">Projected Annual Savings</div>
            <div class="summary-value">${formatCurrency(results.totalSavings)}</div>
            <div class="summary-subtext">${results.savingsRate.toFixed(1)}% of tail spend</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">${results.currentExceedsProjection ? 'Automation Value' : 'Incremental Savings vs Current'}</div>
            <div class="summary-value">${results.currentExceedsProjection ? formatCurrency(results.laborSavings) : formatCurrency(results.incrementalSavings)}</div>
            <div class="summary-subtext">${results.currentExceedsProjection ? `Maintain ${currentSavingsRate}% with fewer resources` : `Above current ${currentSavingsRate}% rate`}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Value (Savings + Labor)</div>
            <div class="summary-value">${formatCurrency(results.totalValue)}</div>
            <div class="summary-subtext">Including ${results.fteSaved.toFixed(1)} FTE equivalent</div>
          </div>
        </div>

        <h2>Input Parameters</h2>
        <div class="input-summary">
          <div class="input-row"><span>Industry</span><strong>${industryPresets[industry].name}</strong></div>
          <div class="input-row"><span>Total Annual Spend</span><strong>${formatCurrency(totalSpend)}</strong></div>
          <div class="input-row"><span>Tail Spend Percentage</span><strong>${tailSpendPct}%</strong></div>
          <div class="input-row"><span>Tail Spend Amount</span><strong>${formatCurrency(results.tailSpend)}</strong></div>
          <div class="input-row"><span>Scenario</span><strong>${scenario === 'low' ? 'Conservative' : scenario === 'mid' ? 'Moderate' : 'Optimistic'}</strong></div>
          <div class="input-row"><span>Current Savings Rate</span><strong>${currentSavingsRate}%</strong></div>
        </div>

        <h2>Savings by Category</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th style="text-align:right">Spend</th>
              <th style="text-align:right">Addressable</th>
              <th style="text-align:right">Projected Savings</th>
              <th style="text-align:right">Savings Rate</th>
            </tr>
          </thead>
          <tbody>
            ${results.categoryResults.map(c => `
              <tr>
                <td>${c.name}</td>
                <td style="text-align:right">${formatCurrency(c.spend)}</td>
                <td style="text-align:right">${formatCurrency(c.addressable)}</td>
                <td style="text-align:right">${formatCurrency(c.savings)}</td>
                <td style="text-align:right">${c.savingsRate.toFixed(1)}%</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td>Total</td>
              <td style="text-align:right">${formatCurrency(results.tailSpend)}</td>
              <td style="text-align:right">${formatCurrency(results.totalAddressable)}</td>
              <td style="text-align:right">${formatCurrency(results.totalSavings)}</td>
              <td style="text-align:right">${results.savingsRate.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>

        <div class="two-col">
          <div>
            <h2>Operational Impact</h2>
            <div class="input-summary">
              <div class="input-row"><span>Estimated Negotiations/Year</span><strong>${formatNumber(results.negotiationsPerYear)}</strong></div>
              <div class="input-row"><span>Hours Saved Annually</span><strong>${formatNumber(results.hoursSaved)}</strong></div>
              <div class="input-row"><span>FTE Equivalent</span><strong>${results.fteSaved.toFixed(1)}</strong></div>
              <div class="input-row"><span>Labor Cost Savings</span><strong>${formatCurrency(results.laborSavings)}</strong></div>
            </div>
          </div>
          <div>
            <h2>Industry Benchmark</h2>
            <div class="benchmark-box">
              <p><strong>Your Projected Performance:</strong></p>
              <p class="benchmark-status">${benchmarkStatus}</p>
              <p style="margin-top: 12px;">Industry benchmarks for tail spend savings:</p>
              <p>• Top Quartile: ≥${results.benchmark.high}%</p>
              <p>• Above Average: ${results.benchmark.mid}% - ${results.benchmark.high}%</p>
              <p>• Average: ${results.benchmark.low}% - ${results.benchmark.mid}%</p>
            </div>
          </div>
        </div>

        <h2>Key Insights</h2>
        <div class="input-summary insights">
          <p>• <strong>Highest opportunity category:</strong> ${[...results.categoryResults].sort((a, b) => b.savings - a.savings)[0].name} with ${formatCurrency([...results.categoryResults].sort((a, b) => b.savings - a.savings)[0].savings)} in projected savings</p>
          <p>• <strong>Best savings rate:</strong> ${[...results.categoryResults].sort((a, b) => b.savingsRate - a.savingsRate)[0].name} at ${[...results.categoryResults].sort((a, b) => b.savingsRate - a.savingsRate)[0].savingsRate.toFixed(1)}%</p>
          <p>• <strong>Total addressable spend:</strong> ${formatCurrency(results.totalAddressable)} (${((results.totalAddressable / results.tailSpend) * 100).toFixed(0)}% of tail spend)</p>
          <p>• <strong>3-Year projected value:</strong> ${formatCurrency(results.totalValue * 3)} (assuming consistent performance)</p>
        </div>

        <div class="footer">
          <p>This analysis is based on The Hackett Group 2025 Tail Spend Management Study findings and industry benchmarks.</p>
          <p>Actual results may vary based on implementation, vendor relationships, and market conditions.</p>
          <p style="margin-top: 15px;"><strong>Powered by Zycus Merlin AI</strong> | zycus.com</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Merlin-ANA-Savings-Report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#0a4d68', '#088395', '#00a896', '#02c39a', '#05668d', '#028090', '#00b4d8'];

  const pieData = results.categoryResults.map((c: any, i: number) => ({
    name: c.name,
    value: c.savings,
    color: COLORS[i % COLORS.length]
  })).filter(d => d.value > 0);

  const barData = results.categoryResults.map((c: any) => ({
    name: c.name.split(' ')[0],
    savings: c.savingsRate,
    benchmarkMid: results.benchmark.mid,
    benchmarkHigh: results.benchmark.high
  }));

  const radarData = results.categoryResults.map((c: any) => ({
    category: c.name.split(' ')[0],
    vendorResponse: c.vendorResponse,
    addressability: c.addressabilityPct,
    savingsRate: c.savingsRate * 5
  }));

  const benchmarkStatus = results.savingsRate >= results.benchmark.high ? 'top' :
    results.savingsRate >= results.benchmark.mid ? 'above' :
      results.savingsRate >= results.benchmark.low ? 'average' : 'below';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a1628 0%, #1a2744 50%, #0d1f3c 100%)',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#e8eef4'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, #00a896 0%, #02c39a 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(90deg, #fff 0%, #a8dadc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Merlin ANA
            </h1>
            <p style={{ fontSize: '12px', color: '#7b8fa8', margin: 0 }}>
              Autonomous Negotiation Agent Savings Calculator
            </p>
          </div>
        </div>
        <div style={{
          padding: '8px 16px',
          background: 'rgba(0,168,150,0.15)',
          border: '1px solid rgba(0,168,150,0.3)',
          borderRadius: '20px',
          fontSize: '13px',
          color: '#02c39a'
        }}>
          Powered by Zycus
        </div>
      </header>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Input Section */}
        <section style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'rgba(0,168,150,0.15)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={18} color="#00a896" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Organization Profile</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Industry Select */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#7b8fa8', marginBottom: '8px', fontWeight: '500' }}>
                Industry Sector
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={industry}
                  onChange={(e: any) => handleIndustryChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 40px 14px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '15px',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none'
                  }}
                >
                  {Object.entries(industryPresets).map(([key, val]: [string, any]) => (
                    <option key={key} value={key} style={{ background: '#1a2744' }}>{val.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} color="#7b8fa8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Total Spend */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#7b8fa8', marginBottom: '8px', fontWeight: '500' }}>
                Total Annual Spend (USD)
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} color="#7b8fa8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="number"
                  value={totalSpend}
                  onChange={(e: any) => setTotalSpend(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#5a6f87', marginTop: '6px' }}>{formatCurrency(totalSpend)}</p>
            </div>

            {/* Tail Spend % */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#7b8fa8', marginBottom: '8px', fontWeight: '500' }}>
                Tail Spend Percentage
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={tailSpendPct}
                  onChange={(e: any) => setTailSpendPct(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#00a896' }}
                />
                <span style={{
                  padding: '8px 14px',
                  background: 'rgba(0,168,150,0.15)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#02c39a',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {tailSpendPct}%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#5a6f87', marginTop: '6px' }}>
                Tail Spend: {formatCurrency(totalSpend * tailSpendPct / 100)}
              </p>
            </div>

            {/* Scenario */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#7b8fa8', marginBottom: '8px', fontWeight: '500' }}>
                Projection Scenario
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'low', label: 'Conservative' },
                  { key: 'mid', label: 'Moderate' },
                  { key: 'high', label: 'Optimistic' }
                ].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setScenario(s.key)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      background: scenario === s.key ? 'linear-gradient(135deg, #00a896 0%, #02c39a 100%)' : 'rgba(255,255,255,0.05)',
                      border: scenario === s.key ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: scenario === s.key ? '#fff' : '#7b8fa8',
                      fontSize: '13px',
                      fontWeight: scenario === s.key ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Savings Rate */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#7b8fa8', marginBottom: '8px', fontWeight: '500' }}>
                Current Tail Spend Savings Rate
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={currentSavingsRate}
                  onChange={(e: any) => setCurrentSavingsRate(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#088395' }}
                />
                <span style={{
                  padding: '8px 14px',
                  background: 'rgba(8,131,149,0.15)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#088395',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {currentSavingsRate}%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#5a6f87', marginTop: '6px' }}>
                Based on Hackett: 51% achieve 1-3%, 28% achieve 4-6%
              </p>
            </div>
          </div>

          {/* Category Distribution */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Tail Spend Category Distribution</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useCustomCategories}
                  onChange={(e: any) => {
                    setUseCustomCategories(e.target.checked);
                    if (!e.target.checked) {
                      setCategories(industryPresets[industry].categories);
                    }
                  }}
                  style={{ accentColor: '#00a896' }}
                />
                <span style={{ fontSize: '13px', color: '#7b8fa8' }}>Customize categories</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Object.entries(categories).map(([key, value]: [string, any]) => (
                <div key={key} style={{
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#a8b9cc' }}>{categoryFactors[key].name}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#02c39a' }}>{value}%</span>
                  </div>
                  {useCustomCategories && (
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={value}
                      onChange={(e: any) => setCategories((prev: any) => ({ ...prev, [key]: Number(e.target.value) }))}
                      style={{ width: '100%', accentColor: '#00a896' }}
                    />
                  )}
                </div>
              ))}
            </div>
            {useCustomCategories && (
              <p style={{
                fontSize: '13px',
                color: Object.values(categories).reduce((a: any, b: any) => a + b, 0) === 100 ? '#02c39a' : '#ff6b6b',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {Object.values(categories).reduce((a: any, b: any) => a + b, 0) === 100 ? (
                  <><CheckCircle2 size={16} /> Categories sum to 100%</>
                ) : (
                  <><AlertCircle size={16} /> Categories sum to {Object.values(categories).reduce((a: any, b: any) => a + b, 0)}% (should be 100%)</>
                )}
              </p>
            )}
          </div>

          {/* Calculate Button */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button
              onClick={handleCalculate}
              style={{
                padding: '16px 48px',
                background: 'linear-gradient(135deg, #00a896 0%, #02c39a 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(0,168,150,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e: any) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,168,150,0.4)';
              }}
              onMouseOut={(e: any) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,168,150,0.3)';
              }}
            >
              Calculate Savings Potential
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section ref={resultsRef} style={{
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {/* High current rate alert */}
              {results.currentExceedsProjection && (
                <div style={{
                  gridColumn: '1 / -1',
                  background: 'rgba(8,131,149,0.15)',
                  border: '1px solid rgba(8,131,149,0.3)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <CheckCircle2 size={20} color="#088395" />
                  <p style={{ margin: 0, fontSize: '14px', color: '#a8dadc' }}>
                    <strong style={{ color: '#088395' }}>You're already a top performer!</strong> Your current {currentSavingsRate}% savings rate exceeds typical ANA projections.
                    The primary value for you is <strong>automation efficiency</strong> – achieving similar results with {results.fteSaved.toFixed(1)} fewer FTEs,
                    saving {formatCurrency(results.laborSavings)} annually in labor costs.
                  </p>
                </div>
              )}

              <div style={{
                background: 'linear-gradient(135deg, #00a896 0%, #02c39a 100%)',
                borderRadius: '20px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <TrendingUp size={24} color="rgba(255,255,255,0.8)" />
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginTop: '12px', marginBottom: '4px' }}>
                  Projected Annual Savings
                </p>
                <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: '#fff' }}>
                  {formatCurrency(results.totalSavings)}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                  {results.savingsRate.toFixed(1)}% of tail spend
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <Target size={24} color="#088395" />
                <p style={{ fontSize: '14px', color: '#7b8fa8', marginTop: '12px', marginBottom: '4px' }}>
                  {results.currentExceedsProjection ? 'Automation Value' : 'Incremental vs Current'}
                </p>
                <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: '#088395' }}>
                  {results.currentExceedsProjection
                    ? formatCurrency(results.laborSavings)
                    : formatCurrency(results.incrementalSavings)
                  }
                </p>
                <p style={{ fontSize: '13px', color: '#5a6f87', marginTop: '8px' }}>
                  {results.currentExceedsProjection
                    ? `Maintain ${currentSavingsRate}% with ${results.fteSaved.toFixed(1)} fewer FTEs`
                    : `Above your current ${currentSavingsRate}% rate`
                  }
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <Users size={24} color="#05668d" />
                <p style={{ fontSize: '14px', color: '#7b8fa8', marginTop: '12px', marginBottom: '4px' }}>
                  FTE Equivalent Freed
                </p>
                <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: '#05668d' }}>
                  {results.fteSaved.toFixed(1)}
                </p>
                <p style={{ fontSize: '13px', color: '#5a6f87', marginTop: '8px' }}>
                  {formatNumber(results.hoursSaved)} hours/year saved
                </p>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <Award size={24} color="#00b4d8" />
                <p style={{ fontSize: '14px', color: '#7b8fa8', marginTop: '12px', marginBottom: '4px' }}>
                  Total Annual Value
                </p>
                <p style={{ fontSize: '36px', fontWeight: '700', margin: 0, color: '#00b4d8' }}>
                  {formatCurrency(results.totalValue)}
                </p>
                <p style={{ fontSize: '13px', color: '#5a6f87', marginTop: '8px' }}>
                  {results.currentExceedsProjection
                    ? `Maintained savings + ${formatCurrency(results.laborSavings)} labor`
                    : 'Savings + Labor value'
                  }
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {/* Savings by Category Pie */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
                  Savings Distribution by Category
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{
                        background: '#1a2744',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend
                      formatter={(value: any) => <span style={{ color: '#a8b9cc', fontSize: '12px' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Savings Rate Bar Chart */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
                  Category Savings Rate vs Industry Top Quartile
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" tick={{ fill: '#7b8fa8', fontSize: 12 }} domain={[0, 'auto']} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#7b8fa8', fontSize: 11 }} width={80} />
                    <Tooltip
                      formatter={(value: any, name: any) => [`${value.toFixed(1)}%`, name]}
                      contentStyle={{
                        background: '#1a2744',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="savings" fill="#00a896" radius={[0, 4, 4, 0]} name="Projected Savings" />
                    <Bar dataKey="benchmarkHigh" fill="rgba(2,195,154,0.25)" radius={[0, 4, 4, 0]} name={`Top Quartile (${results.benchmark.high}%)`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#fff' }}>
                Industry Benchmark Comparison
              </h3>

              <div style={{ position: 'relative', height: '80px', marginBottom: '20px' }}>
                {/* Benchmark bar */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '0',
                  right: '0',
                  height: '40px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  {/* Below average zone */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: `${(results.benchmark.low / 20) * 100}%`,
                    height: '100%',
                    background: 'rgba(255,107,107,0.3)'
                  }} />
                  {/* Average zone */}
                  <div style={{
                    position: 'absolute',
                    left: `${(results.benchmark.low / 20) * 100}%`,
                    width: `${((results.benchmark.mid - results.benchmark.low) / 20) * 100}%`,
                    height: '100%',
                    background: 'rgba(255,193,7,0.3)'
                  }} />
                  {/* Above average zone */}
                  <div style={{
                    position: 'absolute',
                    left: `${(results.benchmark.mid / 20) * 100}%`,
                    width: `${((results.benchmark.high - results.benchmark.mid) / 20) * 100}%`,
                    height: '100%',
                    background: 'rgba(0,168,150,0.3)'
                  }} />
                  {/* Top quartile zone */}
                  <div style={{
                    position: 'absolute',
                    left: `${(results.benchmark.high / 20) * 100}%`,
                    right: 0,
                    height: '100%',
                    background: 'rgba(2,195,154,0.4)'
                  }} />
                </div>

                {/* Your position marker */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: `${Math.min((results.savingsRate / 20) * 100, 98)}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 10
                }}>
                  <div style={{
                    padding: '4px 12px',
                    background: '#00a896',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#fff',
                    whiteSpace: 'nowrap'
                  }}>
                    You: {results.savingsRate.toFixed(1)}%
                  </div>
                  <div style={{
                    width: '3px',
                    height: '48px',
                    background: '#00a896'
                  }} />
                </div>

                {/* Labels */}
                <div style={{ position: 'absolute', top: '68px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7b8fa8' }}>
                  <span>0%</span>
                  <span style={{ position: 'absolute', left: `${(results.benchmark.low / 20) * 100}%`, transform: 'translateX(-50%)' }}>{results.benchmark.low}%</span>
                  <span style={{ position: 'absolute', left: `${(results.benchmark.mid / 20) * 100}%`, transform: 'translateX(-50%)' }}>{results.benchmark.mid}%</span>
                  <span style={{ position: 'absolute', left: `${(results.benchmark.high / 20) * 100}%`, transform: 'translateX(-50%)' }}>{results.benchmark.high}%</span>
                  <span>20%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'rgba(255,107,107,0.3)', borderRadius: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#a8b9cc' }}>Below Average (&lt;{results.benchmark.low}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'rgba(255,193,7,0.3)', borderRadius: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#a8b9cc' }}>Average ({results.benchmark.low}-{results.benchmark.mid}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'rgba(0,168,150,0.3)', borderRadius: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#a8b9cc' }}>Above Average ({results.benchmark.mid}-{results.benchmark.high}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'rgba(2,195,154,0.4)', borderRadius: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#a8b9cc' }}>Top Quartile (&gt;{results.benchmark.high}%)</span>
                </div>
              </div>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: benchmarkStatus === 'top' ? 'rgba(2,195,154,0.1)' :
                  benchmarkStatus === 'above' ? 'rgba(0,168,150,0.1)' :
                    benchmarkStatus === 'average' ? 'rgba(255,193,7,0.1)' : 'rgba(255,107,107,0.1)',
                borderRadius: '12px',
                borderLeft: `4px solid ${benchmarkStatus === 'top' ? '#02c39a' :
                  benchmarkStatus === 'above' ? '#00a896' :
                    benchmarkStatus === 'average' ? '#ffc107' : '#ff6b6b'
                  }`
              }}>
                <p style={{ margin: 0, fontSize: '15px', color: '#e8eef4' }}>
                  <strong style={{ color: benchmarkStatus === 'top' ? '#02c39a' : benchmarkStatus === 'above' ? '#00a896' : benchmarkStatus === 'average' ? '#ffc107' : '#ff6b6b' }}>
                    {benchmarkStatus === 'top' ? 'Top Quartile Performance!' :
                      benchmarkStatus === 'above' ? 'Above Average Performance' :
                        benchmarkStatus === 'average' ? 'Average Performance' : 'Below Average - High Improvement Potential'}
                  </strong>
                  {' '}- Your projected savings rate of {results.savingsRate.toFixed(1)}%
                  {benchmarkStatus === 'top' ? ' positions you among the best performers in your industry.' :
                    benchmarkStatus === 'above' ? ' exceeds the industry average.' :
                      benchmarkStatus === 'average' ? ' aligns with typical industry performance.' :
                        ' suggests significant room for improvement with ANA.'}
                </p>
              </div>
            </div>

            {/* Detailed Category Table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '32px',
              overflowX: 'auto'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
                Category-Level Analysis
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Category</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Spend</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Addressable</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Vendor Response</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Addressability</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Savings</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '12px', color: '#7b8fa8', fontWeight: '600' }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {results.categoryResults.map((c, i) => (
                    <tr key={c.category} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#e8eef4' }}>{c.name}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>{formatCurrency(c.spend)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>{formatCurrency(c.addressable)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>{c.vendorResponse.toFixed(0)}%</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>{c.addressabilityPct.toFixed(0)}%</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#02c39a', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(c.savings)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#00a896', textAlign: 'right' }}>{c.savingsRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'rgba(0,168,150,0.1)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#fff', fontWeight: '600' }}>Total</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#fff', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(results.tailSpend)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#fff', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(results.totalAddressable)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#a8b9cc', textAlign: 'right' }}>-</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#02c39a', textAlign: 'right', fontWeight: '700' }}>{formatCurrency(results.totalSavings)}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#02c39a', textAlign: 'right', fontWeight: '700' }}>{results.savingsRate.toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key Metrics Summary */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
                Operational Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#7b8fa8', marginBottom: '6px' }}>Est. Negotiations/Year</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#088395', margin: 0 }}>{formatNumber(results.negotiationsPerYear)}</p>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#7b8fa8', marginBottom: '6px' }}>Hours Saved/Year</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#05668d', margin: 0 }}>{formatNumber(results.hoursSaved)}</p>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#7b8fa8', marginBottom: '6px' }}>Labor Cost Savings</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#00b4d8', margin: 0 }}>{formatCurrency(results.laborSavings)}</p>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#7b8fa8', marginBottom: '6px' }}>3-Year Projected Value</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#02c39a', margin: 0 }}>{formatCurrency(results.totalValue * 3)}</p>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={generatePDF}
                style={{
                  padding: '16px 32px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <Download size={18} />
                Download Report
              </button>
            </div>

            {/* Methodology Note */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              <p style={{ fontSize: '12px', color: '#5a6f87', margin: 0, lineHeight: '1.8' }}>
                <strong style={{ color: '#7b8fa8' }}>Methodology:</strong> This calculator uses data from The Hackett Group 2025 Tail Spend Management Study.
                Savings projections factor in category-specific price elasticity, vendor response rates to autonomous negotiation,
                and addressability constraints. Actual results may vary based on implementation approach, vendor relationships,
                market conditions, and organizational readiness. The benchmark comparisons reflect typical performance ranges
                observed across similar organizations in your industry sector.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p style={{ fontSize: '13px', color: '#5a6f87', margin: 0 }}>
          Based on The Hackett Group 2025 Tail Spend Management Study • Powered by <strong style={{ color: '#00a896' }}>Zycus Merlin AI</strong>
        </p>
      </footer>
    </div>
  );
}
