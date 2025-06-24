import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

const seg = '19866374';
function _phr() {
  // Should be the same as the plugin phrase in the server and using environment variables
  return 'recursica' + '_plugin_@' + seg;
}

export function encrypt(value: string): string {
  if (!value) {
    throw new Error('Invalid argument');
  }
  const encrypted = CryptoJS.AES.encrypt(value, _phr()).toString();
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
