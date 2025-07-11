require("dotenv").config();
const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const { JsonRpcProvider, Wallet, isAddress, parseEther } = require("ethers");

const app = express();
app.use(express.json());

// Create DB connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Setup provider and contract
const provider = new JsonRpcProvider(process.env.RPC_URL);
// Create wallet object from the faucet's private key
const faucetWallet = new Wallet(process.env.PRIVATE_KEY, provider);

// React App
app.use("/", express.static(path.join(__dirname, "public")));

// Faucet logic
app.post("/faucet", async (req, res) => {
  const { walletAddress } = req.body;

  if (!isAddress(walletAddress)) {
    return res.status(400).json({ error: "Invalid wallet address." });
  }

  try {
    const [rows] = await db.query(
      "SELECT last_claim_at FROM faucet_claims WHERE wallet_address = ?",
      [walletAddress]
    );

    const now = new Date();

    if (rows.length > 0) {
      const lastClaim = rows[0].last_claim_at;
      const lastClaimDate = new Date(lastClaim);
      const diff = (now - lastClaimDate) / (1000 * 60); // minutes

      if (diff < 60) {
        return res
          .status(429)
          .json({ error: "You can only claim tokens once every hour." });
      }
    }

    // Send 10 tokens (10 * 10^18)
    const tx = await faucetWallet.sendTransaction({
      to: walletAddress,
      value: parseEther("10"),
    });
    await tx.wait();

    // Upsert the record
    await db.query(
      `INSERT INTO faucet_claims (wallet_address, last_claim_at)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE last_claim_at = ?`,
      [walletAddress, now, now]
    );

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Faucet server running on port ${PORT}`);
});
