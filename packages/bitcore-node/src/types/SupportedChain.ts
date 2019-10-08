export const SupportedChainSet = {
  BTC: true,
  BCH: true,
  DFC: true,
};

export type SupportedChain = keyof typeof SupportedChainSet;

export function isChainSupported(chain: string): chain is SupportedChain {
  return SupportedChainSet.hasOwnProperty(chain);
}
