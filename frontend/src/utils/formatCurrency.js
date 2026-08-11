/**
 * Centralized currency formatter for the entire app.
 * The database stores plain numeric prices — this is the ONLY place
 * that should turn a number into a displayed price string.
 *
 * Usage: formatCurrency(1600) -> "Rs. 1,600"
 *        formatCurrency(1600.5) -> "Rs. 1,600.50"
 */
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;

  const formatted = value.toLocaleString('en-PK', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `Rs. ${formatted}`;
};

export default formatCurrency;
