export * from './agora';

export enum IntlLocale {
  EN = 'en-US',
  UA = 'uk-UA',
}

export type AsyncActionState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type Dimensions = {
  width: number;
  height: number;
};
