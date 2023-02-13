export * from './agora';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

/**
 * Expresses a price as a number or range
 * The default currency is USD
 */
export type CarPrice = number | { min: number; max: number };

export enum IntlLocale {
  EN = 'en-US',
  UA = 'uk-UA',
}
