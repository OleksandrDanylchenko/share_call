import { Currency, IntlLocale } from '@/types/index';

export const toCurrencyString = (
  num: number,
  currency: Currency = Currency.USD,
  locale: IntlLocale = IntlLocale.EN,
): string =>
  num.toLocaleString(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  });
