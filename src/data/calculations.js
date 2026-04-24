import { RATIO_TABLE } from './constants';

export function getRatioForWeight(weight) {
  const numWeight = parseFloat(weight);
  if (isNaN(numWeight) || numWeight <= 0) return null;
  
  if (numWeight <= RATIO_TABLE[0].weight) {
    return RATIO_TABLE[0].ratio;
  }
  
  if (numWeight >= RATIO_TABLE[RATIO_TABLE.length - 1].weight) {
    return RATIO_TABLE[RATIO_TABLE.length - 1].ratio;
  }
  
  let closest = RATIO_TABLE[0];
  let minDiff = Math.abs(numWeight - closest.weight);
  
  for (let i = 1; i < RATIO_TABLE.length; i++) {
    const diff = Math.abs(numWeight - RATIO_TABLE[i].weight);
    if (diff < minDiff) {
      minDiff = diff;
      closest = RATIO_TABLE[i];
    }
  }
  
  return closest.ratio;
}

export function calculateMinPrice(weight, currentPrice) {
  const w = parseFloat(weight);
  const p = parseFloat(currentPrice);
  if (isNaN(w) || isNaN(p) || w <= 0 || p <= 0) return 0;
  return w * 0.58 * p;
}

export function calculateMaxPrice(weight, currentPrice) {
  const w = parseFloat(weight);
  const p = parseFloat(currentPrice);
  if (isNaN(w) || isNaN(p) || w <= 0 || p <= 0) return 0;
  const ratio = getRatioForWeight(w);
  if (!ratio) return 0;
  return w * ratio * p;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateAmortization(minPrice, maxPrice, currentPrice, gcaa, dailyExpense) {
  const p = parseFloat(currentPrice);
  const add = parseFloat(gcaa);
  const exp = parseFloat(dailyExpense);
  
  if (!p || !add || isNaN(exp) || p <= 0 || add <= 0) return null;
  
  const dailyMeatAdded = add * 0.58;
  const grossDailyProfit = dailyMeatAdded * p;
  const netDailyProfit = grossDailyProfit - exp;
  
  if (netDailyProfit <= 0) return Infinity; // It will never amortize
  
  const gap = maxPrice - minPrice;
  if (gap <= 0) return 0;
  
  return Math.ceil(gap / netDailyProfit);
}
