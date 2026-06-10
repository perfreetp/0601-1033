export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
