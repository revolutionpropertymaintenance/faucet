import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";

const RPC_URL = "https://testnet-rpc.acrypto.cloud";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

function App() {
  const [inputAddress, setInputAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const [txInfo, setTxInfo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFaucet = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    setTxHash("");
    if (!ethers.utils.isAddress(inputAddress)) {
      setError("Invalid wallet address.");
      return;
    }
    try {
      const res = await fetch("/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: inputAddress }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setSuccess("Tokens sent successfully!");
      setTxHash(data.txHash);
    } catch (err) {
      setError(err.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTxData = async () => {
      if (!txHash) return;
      try {
        const receipt = await provider.getTransactionReceipt(txHash);
        const tx = await provider.getTransaction(txHash);
        const block = await provider.getBlock(receipt.blockNumber);
        setTxInfo({
          from: tx.from,
          to: tx.to,
          value: ethers.utils.formatEther(tx.value),
          gasUsed: receipt.gasUsed.toString(),
          status: receipt.status === 1 ? "Success" : "Failed",
          timestamp: new Date(block.timestamp * 1000).toLocaleString(),
        });
      } catch (err) {
        setError(err.message || "Failed to fetch transaction data");
      }
    };
    fetchTxData();
  }, [txHash]);

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">
              <img src="/logo.png" />
            </h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center"></div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <div className="hero-content">
              <div className="spinning-globe"></div>
              <h1 className="main-title">Estar Faucet</h1>
              <p className="subtitle">Fast and reliable. Collect 10 Free ESR tokens an hour.</p>
            </div>
            <div className="mt-5">
              {error && <div className="withdraw-error">{error}</div>}
              }
              {success && (
                <div className="withdraw-success">{success}</div>
              )}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    value={inputAddress}
                    disabled={isLoading}
                    onChange={(e) => {
                      setInputAddress(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-medium"
                    onClick={handleFaucet}
                    disabled={!inputAddress.trim() || isLoading}
                  >
                    {isLoading ? "Loading..." : "GET TOKENS"}
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  {txHash ? (
                    <div className="tx-info">
                      <p>
                        <strong>Tx Hash:</strong> {txHash}
                      </p>
                      {txInfo ? (
                        <ul>
                          <li>
                            <strong>Status:</strong> {txInfo.status}
                          </li>
                          <li>
                            <strong>From:</strong> {txInfo.from}
                          </li>
                          <li>
                            <strong>To:</strong> {txInfo.to}
                          </li>
                          <li>
                            <strong>Gas Used:</strong> {txInfo.gasUsed}
                          </li>
                          <li>
                            <strong>Timestamp:</strong> {txInfo.timestamp}
                          </li>
                        </ul>
                      ) : (
                        <p>Loading transaction data...</p>
                      )}
                    </div>
                  ) : (
                    <p>--</p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
