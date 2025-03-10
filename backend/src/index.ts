import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AptosClient } from "@aptos-labs/ts-sdk";
import { initMetaMove, executeTrade } from "./metamove.js"; // Ensure this file exists

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Aptos SDK
const APTOS_NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const aptosClient = new AptosClient(APTOS_NODE_URL);

// Initialize MetaMove AI Agent
initMetaMove();

app.get("/", (req, res) => {
    res.send("MetaMove DeFi Bot Backend is Running!");
});

// Example API endpoint to execute a trade
app.post("/trade", async (req, res) => {
    try {
        const tradeResult = await executeTrade(req.body);
        res.json({ success: true, data: tradeResult });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
