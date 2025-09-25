import { FetchOptions, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getSolanaReceived, getETHReceived } from "../../helpers/token";
import { fetchBuilderCodeRevenue } from "../../helpers/hyperliquid";

const TREASURY_ADDRESS_PER_CHAIN: { [chain: string]: string } = {
  [CHAIN.ETHEREUM]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.BSC]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.BASE]: "0x2baF303aa7b9798c7C89338Bdea2e53B72868E42",
  [CHAIN.SOLANA]: "BMVjS5nQMgRoDxQ1fYfEFAvU6JzrPCtbTPxqDH1MJqEd",
  [CHAIN.HYPERLIQUID]: "0x761591e46a19e4e18b5a14bcc8565feca17f7278",
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
    await getETHReceived({
      options,
      balances: dailyFees,
      target: TREASURY_ADDRESS_PER_CHAIN[options.chain],
    });
  }

  return { dailyFees, dailyRevenue: dailyFees };
};

const methodology = {
  Fees: "All trading fees paid by users while using TrySpark bot.",
  Revenue: "Trading fees are collected by TrySpark protocol.",
  ProtocolRevenue: "Trading fees are collected by TrySpark protocol.",
};

const adapter: SimpleAdapter = {
  version: 2,
  adapter: {
    [CHAIN.SOLANA]: { fetch, start: "2025-02-26" },
    [CHAIN.HYPERLIQUID]: { fetch, start: "2025-02-27" },
    [CHAIN.BSC]: { fetch, start: "2025-08-21" },
    [CHAIN.ETHEREUM]: { fetch, start: "2025-08-21" },
    [CHAIN.BASE]: { fetch, start: "2025-07-28" },
  },
  methodology,
};

export default adapter;
