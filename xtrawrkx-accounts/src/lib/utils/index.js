export function fmtCurrency(n){ return (Number(n)||0).toFixed(2) }

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US');
}