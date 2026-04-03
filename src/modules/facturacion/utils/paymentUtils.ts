import type { PaymentMethod } from '../types/types';

export const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; currency?: string }> = [
  { value: "cash_usd", label: "Efectivo USD", currency: "USD" },
  { value: "cash_eur", label: "Efectivo EUR", currency: "EUR" },
  { value: "cash_cup", label: "Efectivo CUP", currency: "CUP" },
  { value: "transfer_mobile", label: "Transferencia móvil" },
  { value: "bizum", label: "Bizum" },
  { value: "zelle", label: "Zelle" },
  { value: "transfer_abroad", label: "Transferencia internacional" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
];

export const getBillDenominations = (paymentMethod: PaymentMethod): number[] => {
  if (paymentMethod === 'cash_eur') {
    return [5, 10, 20, 50, 100, 200, 500];
  }
  if (paymentMethod === 'cash_cup') {
    return [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000];
  }
  // USD and others
  return [1, 5, 10, 20, 50, 100];
};

export const getCurrency = (paymentMethod: PaymentMethod): 'USD' | 'EUR' | 'CUP' => {
  if (paymentMethod === 'cash_eur') return 'EUR';
  if (paymentMethod === 'cash_cup') return 'CUP';
  return 'USD';
};

export const isCashPayment = (paymentMethod: PaymentMethod): boolean => {
  return paymentMethod.startsWith('cash_');
};
