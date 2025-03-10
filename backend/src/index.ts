import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AptosClient, Account as AptosAccount, Provider } from "@aptos-labs/ts-sdk";

import { initMetaMove } from "./metamove.js"; // Ensure metamove.js or metamove.ts exists

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get APTOS_NODE_URL from environment variables
const APTOS_NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";

// Initialize Aptos SDK
const aptosProvider = new Provider({ fullnode: APTOS_NODE_URL });
const aptosClient = new AptosClient(APTOS_NODE_URL);

// MetaMove setup (Ensure metamove.ts exists)
initMetaMove();

app.get("/", (req, res) => {
    res.send("MetaMove DeFi Bot Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
