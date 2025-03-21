import axios from "axios";
import { aptosClient, APTOS_ACCOUNT } from "./config";
import { TxnBuilderTypes } from "@aptos-labs/ts-sdk";

// Trading Settings
const MIN_APY = 10;
const MAX_LOSS = -5;
const TARGET_RATIO = { APT: 60, USDC: 40 };

// Get Best Yield
async function getBestYield() {
    const response = await axios.get("https://api.aave.com/v1/reserveData");
    return response.data.find(pool => pool.apy > MIN_APY) || null;
}

// Risk Management
async function checkRisk() {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd&include_24hr_change=true");
    const aptosPrice = response.data.aptos;
    
    if (aptosPrice.usd_24h_change < MAX_LOSS) {
        console.log("⚠️ Exiting position due to price drop!");
        await executeTrade("APT", "USDC", 50);
        return "SELL";
    }
}

// Portfolio Rebalancing
async function rebalancePortfolio() {
    const accountResource = await aptosClient.getAccountResource(APTOS_ACCOUNT, "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    const aptBalance = parseInt(accountResource.data.coin.value) / 1e8;
    
    if (aptBalance > TARGET_RATIO.APT) {
        console.log("Rebalancing: Selling APT for USDC...");
        await executeTrade("APT", "USDC", aptBalance - TARGET_RATIO.APT);
    }
}

// Execute a Swap
async function executeTrade(fromCoin: string, toCoin: string, amount: number) {
    const payload = new TxnBuilderTypes.TransactionPayloadEntryFunction(
        TxnBuilderTypes.EntryFunction.natural(
            "0x1::coin",
            "transfer",
            [fromCoin],
            [amount]
        )
    );

    console.log(`Executing trade: ${fromCoin} -> ${toCoin}, Amount: ${amount}`);
}

// Run Trading Agent
export async function runTradingAgent() {
    console.log("🔄 Running Trading Agent...");
    const bestYield = await getBestYield();
    if (bestYield) console.log(`📈 Best APY found: ${bestYield.apy}%`);
    
    const riskCheck = await checkRisk();
    if (riskCheck === "SELL") console.log("🔥 Sold assets due to risk alert");

    await rebalancePortfolio();
}
