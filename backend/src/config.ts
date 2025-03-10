import { AptosClient } from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";

dotenv.config();

export const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com";
export const aptosClient = new AptosClient(APTOS_NODE_URL);
export const APTOS_ACCOUNT = process.env.APTOS_ACCOUNT || "";
