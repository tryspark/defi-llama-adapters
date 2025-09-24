import { FetchOptions, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getSolanaReceived, addTokensReceived } from "../../helpers/token";
import { fetchBuilderCodeRevenue } from "../../helpers/hyperliquid";

const TREASURY_ADDRESS_PER_CHAIN: { [chain: string]: string } = {
  [CHAIN.ETHEREUM]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.BSC]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.BASE]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.SOLANA]: "BMVjS5nQMgRoDxQ1fYfEFAvU6JzrPCtbTPxqDH1MJqEd",
  [CHAIN.HYPERLIQUID]: "0x761591E46a19e4e18b5a14bcc8565FeCa17f7278",
};

const EVM_CHAIN_TOKEN: { [chain: string]: string } = {
  [CHAIN.ETHEREUM]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [CHAIN.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  [CHAIN.BASE]: "0x4200000000000000000000000000000000000006",
};

const fetch = async (options: FetchOptions) => {
  const dailyFees = options.createBalances();
  if (options.chain === CHAIN.SOLANA) {
    await getSolanaReceived({
      options,
      balances: dailyFees,
      target: TREASURY_ADDRESS_PER_CHAIN[options.chain],
    });
  } else if (options.chain === CHAIN.HYPERLIQUID) {
    return fetchBuilderCodeRevenue({
      options,
      builder_address: TREASURY_ADDRESS_PER_CHAIN[options.chain],
    });
  } else {
    await addTokensReceived({
      options,
      balances: dailyFees,
      tokens: [EVM_CHAIN_TOKEN[options.chain]],
      targets: [TREASURY_ADDRESS_PER_CHAIN[options.chain]],
    });
  }

  return { dailyFees, dailyRevenue: dailyFees };
};

const methodology = {
  Fees: "All trading fees paid by users while using TrySpark bot.",
  Revenue: "Trading fees are collected by TrySpark protocol.",
  ProtocolRevenue: "Trading fees are collected by TrySpark protocol.",
};

// const adapter: SimpleAdapter = {
//   version: 2,
//   fetch,
//   chains: [
//     CHAIN.HYPERLIQUID,
//     // CHAIN.SOLANA,
//     CHAIN.BSC,
//     CHAIN.BASE,
//     CHAIN.ETHEREUM,
//   ],
//   start: "2025-07-20",
//   methodology,
// };

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.HYPERLIQUID]: { fetch, start: "2025-01-16" },
  },
  methodology,
  isExpensiveAdapter: true,
};

export default adapter;
