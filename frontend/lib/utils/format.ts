export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN');
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-IN');
}

export function formatOrderId(id: string): string {
  return id.substring(id.length - 8).toUpperCase();
}
