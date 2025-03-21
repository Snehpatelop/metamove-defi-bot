import axios from "axios";
import { APTOS_API, DEX_API, PORTFOLIO_API } from "./config";

const MIN_APY = 10;  // Min acceptable yield %
const MAX_LOSS = -5; // Max loss before selling
const TARGET_RATIO = { APT: 60, USDC: 40 }; // Ideal balance

async function getBestYield() {
    const { data } = await axios.get(DEX_API);
    return data.pairs.find(pool => pool.apy > MIN_APY); 
}

async function checkRisk() {
    const { data } = await axios.get(DEX_API);
    const asset = data.pairs.find(asset => asset.symbol === "APT");

    if (asset.price_change_24h < MAX_LOSS) { 
        console.log("⚠️ Exiting position to prevent further loss!");
        return "SELL";
    }
}

async function rebalancePortfolio() {
    const { data } = await axios.get(PORTFOLIO_API);
    
    const total = data.total_value;
    const aptPercentage = (data.APT / total) * 100;
    const usdcPercentage = (data.USDC / total) * 100;

    if (aptPercentage > TARGET_RATIO.APT) {
        console.log("Rebalancing: Selling APT, Buying USDC...");
        return "REBALANCE";
    } else if (usdcPercentage > TARGET_RATIO.USDC) {
        console.log("Rebalancing: Selling USDC, Buying APT...");
        return "REBALANCE";
    }
}

export async function runTradingAgent() {
    console.log("🔄 Fetching DeFi market data...");
    
    const bestYield = await getBestYield();
    if (bestYield) console.log(`📈 Moving assets to ${bestYield.name}`);

    const riskCheck = await checkRisk();
    if (riskCheck === "SELL") console.log("🔥 Selling to prevent loss");

    await rebalancePortfolio();
}
