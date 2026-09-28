export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatFlow(litresPerMin: number): string {
  return `${litresPerMin.toFixed(1)} L/min`;
}

export function formatLitres(litres: number): string {
  if (litres >= 1000000) {
    return `${(litres / 1000000).toFixed(2)} ML`;
  }
  if (litres >= 1000) {
    return `${formatNumber(litres)} L`;
  }
  return `${litres} L`;
}

export function formatPercentage(pct: number, includeSign = false): string {
  const sign = includeSign && pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}
