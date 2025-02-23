# 🚀 FNA-Backend - Blockchain Handler & NFT Creator

A **Node.js backend** for managing **blockchain interactions** and **NFT creation**. This project enables users to **mint, manage, and retrieve NFTs** securely via **smart contracts**.


## 🌟 Features  
✅ **NFT Creation** - Generate unique NFTs with metadata storage.  
✅ **Smart Contract Interaction** - Connects to Ethereum blockchain using Web3.js.  
✅ **Secure Environment** - Uses `.env` for storing sensitive credentials.  
✅ **JSON Metadata Handling** - Stores and retrieves NFT details in `MediaNFT.json`.  
✅ **Express.js API** - Provides REST endpoints for NFT operations.  

---

## 🏗 Project Structure  
📂 **node_modules/** - Dependencies managed by `npm`.  
📄 **.env** - Stores private blockchain credentials.  
📄 **MediaNFT.json** - Stores NFT metadata.  
📄 **index.js** - Main backend logic for handling requests.  
📄 **package.json** - Project dependencies and configurations.  
📄 **package-lock.json** - Ensures dependency consistency.  

---

## ⚙️ Installation & Setup  
### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/Priyank911/FNA-Backend.git
cd FNA-Backend
```
### 2️⃣ Install Dependencies  
```bash
npm install
```
### 3️⃣ Set Up Environment Variables  
Create a `.env` file and add your blockchain credentials:  
```env
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_deployed_smart_contract_address
```
### 4️⃣ Start the Server  
```bash
node index.js
```
### 5️⃣ Access API  
- Open **http://localhost:3000** (or the defined port).  

---

## 🔗 API Endpoints  
| **Method** | **Endpoint** | **Description** |
|------------|-------------|-----------------|
| `POST` | `/mint` | Mints a new NFT. |
| `GET` | `/nft/:id` | Retrieves metadata of a specific NFT. |
| `GET` | `/all-nfts` | Fetches all stored NFTs. |

---

## 📦 Deployment  
### 🚀 Deploy with PM2 (Process Manager)  
```bash
npm install -g pm2
pm2 start index.js --name "FNA-Backend"
```
### ☁️ Deploy on Vercel  
```bash
vercel --prod
```

---

## 🚀 Future Enhancements  
🔹 Multi-chain support (Polygon, Binance Smart Chain, etc.).  
🔹 IPFS integration for decentralized storage.  
🔹 Advanced NFT metadata enrichment.  

---

## 🤝 Contributions  
Contributions are welcome! Open a **PR** or raise an **issue**.  

---

## 📜 License  
Licensed under **MIT License**.  

---

🔗 **Stay Connected:** [GitHub Repository](https://github.com/Priyank911/FNA-Backend)  

💡 *"Empowering NFT creation with seamless blockchain integration!"* 🚀  
