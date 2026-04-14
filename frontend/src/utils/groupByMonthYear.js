export function groupByYearMonth(transactions) {
  const grouped = {};
  transactions.forEach((trx) => {
    const date = new Date(trx.transaction_date);
    const year = date.getFullYear();
    const month = date.toLocaleString('id-ID', { month: 'long' });
    const key = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][key]) {
      grouped[year][key] = { label: `${month} ${year}`, items: [] };
    }
    grouped[year][key].items.push(trx);
  });
  return grouped;
}

export const STATUS_MAP = { 0: 'SUCCESS', 1: 'FAILED' };