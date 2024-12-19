export function formatNumber(num: number): string {
  return num?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
} 