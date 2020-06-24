import SHA256 from 'crypto-js/sha256';

export const toSha256 = (value: string): string => {
  return SHA256(value).toString();
};
