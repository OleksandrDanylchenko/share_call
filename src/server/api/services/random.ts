import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
export const shortNanoid = customAlphabet(alphabet, 10);
