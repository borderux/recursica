import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const PLUGIN_PHRASE = import.meta.env.VITE_PLUGIN_PHRASE;

export function encrypt(value: string): string {
  if (!value) {
    throw new Error('Invalid argument');
  }
  const encrypted = CryptoJS.AES.encrypt(value, PLUGIN_PHRASE).toString();
  const words = Utf8.parse(encrypted);
  return Base64.stringify(words);
}

export function pluginTokenToCode(token: string): string {
  if (!token) {
    return '';
  }
  const response = {
    token,
    date: Date.now(),
  };
  return encrypt(JSON.stringify(response));
}
