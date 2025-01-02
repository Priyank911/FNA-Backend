// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const { ethers } = require("ethers");
// const { Blob } = require("buffer");
// const FormData = require("form-data"); // Ensure FormData is imported

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "50mb" }));

// const port = process.env.PORT || 3001;
// const pinataApiKey = process.env.PINATA_API_KEY;
// const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
// const privateKey = process.env.PRIVATE_KEY;

// if (!pinataApiKey || !pinataSecretApiKey || !privateKey) {
//   console.error("Missing required environment variables. Ensure .env is configured properly.");
//   process.exit(1);
// }

// // Configure the provider for Polygon Amoy
// const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
// const wallet = new ethers.Wallet(privateKey, provider);

// // Contract address on Amoy, replace if needed
// const contractAddress = "0x7ee1c920fde22ed3b40affe533dc9d0d49e077ea";
// const contractABI = require("./MediaNFT.json").abi;
// const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// console.log("Wallet address: ", wallet.address);

// // Track the last used ID
// let projectIdCounter = 0;

// // Helper function to upload files to Pinata
// async function uploadToPinata(fileBuffer, isJSON = false, fileName = "file") {
//   const url = isJSON
//     ? "https://api.pinata.cloud/pinning/pinJSONToIPFS"
//     : "https://api.pinata.cloud/pinning/pinFileToIPFS";

//   const headers = {
//     pinata_api_key: pinataApiKey,
//     pinata_secret_api_key: pinataSecretApiKey,
//   };

//   let data;

//   if (isJSON) {
//     data = {
//       pinataContent: fileBuffer,
//     };
//   } else {
//     // Convert Buffer to Blob for file uploads
//     const formData = new FormData();
//     formData.append("file", fileBuffer, fileName); // Pass the filename
//     data = formData;
//   }

//   try {
//     const response = await axios.post(url, data, {
//       headers: {
//         ...headers,
//         ...(isJSON ? { "Content-Type": "application/json" } : data.getHeaders()), // Get headers from FormData
//       },
//     });
//     return response.data.IpfsHash;
//   } catch (error) {
//     console.error("Failed to upload to Pinata:", error.response?.data || error.message);
//     throw new Error("Pinata upload failed.");
//   }
// }

// app.post("/upload", async (req, res) => {
//   try {
//     const { mediaFile, metadata } = req.body;

//     if (!mediaFile || !metadata) {
//       return res.status(400).send({ error: "Missing media file or metadata." });
//     }

//     // Decode media file (base64 to buffer)
//     const mediaBuffer = Buffer.from(mediaFile.split(",")[1], "base64");

//     // Increment and get the next project ID
//     projectIdCounter++;
//     const uniqueId = projectIdCounter;
//     const mediaFileName = `media_${uniqueId}.png`; // Add file extension for clarity
//     const metadataFileName = `metadata_${uniqueId}.json`;

//     console.log("Uploading media to Pinata...");
//     const mediaHash = await uploadToPinata(mediaBuffer, false, mediaFileName);
//     console.log("Media uploaded to Pinata with hash:", mediaHash);

//     const structuredMetadata = {
//         name: metadataFileName,
//         [`${uniqueId}Metadata`]: {
//           ID: uniqueId,
//           data: metadata,
//         },
//       };
      
//       console.log("Uploading metadata to Pinata...");
//       const metadataHash = await uploadToPinata(structuredMetadata, true, metadataFileName);
//       console.log("Metadata uploaded to Pinata with hash:", metadataHash);

//     console.log("Minting NFT on blockchain...");
//     const tx = await contract.safeMint(
//       wallet.address,
//       `ipfs://${metadataHash}`,
//       `ipfs://${mediaHash}`
//     );
//     console.log("Transaction sent, waiting for confirmation...");
//     await tx.wait();

//     res.send({
//       message: "Successfully uploaded to the blockchain!",
//       metadataURL: `ipfs://${metadataHash}`,
//       mediaURL: `ipfs://${mediaHash}`,
//       txHash: tx.hash,
//     });
//   } catch (error) {
//     console.error("Error during Pinata upload or smart contract call:", error);
//     res.status(500).send({
//       error: "Failed to upload to Pinata or blockchain.",
//       details: error.message,
//     });
//   }
// });
// app.get("/getNFTInfo/:tokenId", async (req, res) => {
//   try {
//     const tokenId = parseInt(req.params.tokenId);

//     if (isNaN(tokenId)) {
//       return res.status(400).send({ error: "Invalid token ID." });
//     }

//     const metadataURI = await contract.tokenURI(tokenId);
//     const mediaHash = await contract.getMediaHash(tokenId);

//     res.send({
//       metadataURI,
//       mediaHash,
//     });
//   } catch (error) {
//     console.error("Error fetching NFT information:", error);
//     res.status(500).send({
//       error: "Failed to fetch NFT information.",
//       details: error.message,
//     });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { ethers } = require("ethers");
const FormData = require("form-data");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const port = process.env.PORT || 3001;
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

if (!pinataApiKey || !pinataSecretApiKey || !privateKey) {
  console.error("Missing required environment variables. Ensure .env is configured properly.");
  process.exit(1);
}


const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = "0x7ee1c920fde22ed3b40affe533dc9d0d49e077ea";
const contractABI = require("./MediaNFT.json").abi;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

console.log("Wallet address: ", wallet.address);

let projectIdCounter = 0;

async function uploadToPinata(fileBuffer, isJSON = false, fileName = "file") {
  const url = isJSON
    ? "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    : "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const headers = {
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  let data;

  if (isJSON) {
    data = {
      pinataMetadata: { name: fileName }, 
      pinataContent: fileBuffer,
    };
  } else {
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName); 
    data = formData;
  }

  try {
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        ...(isJSON ? { "Content-Type": "application/json" } : data.getHeaders()), 
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Failed to upload to Pinata:", error.response?.data || error.message);
    throw new Error("Pinata upload failed.");
  }
}

app.post("/upload", async (req, res) => {
  try {
    const { mediaFile, metadata } = req.body;

    if (!mediaFile || !metadata) {
      return res.status(400).send({ error: "Missing media file or metadata." });
    }

    
    const mediaBuffer = Buffer.from(mediaFile.split(",")[1], "base64");

   
    projectIdCounter++;
    const uniqueId = projectIdCounter;
    const mediaFileName = `media_${uniqueId}.data`; 
    const metadataFileName = `metadata_${uniqueId}.json`;

    console.log("Uploading media to Pinata...");
    const mediaHash = await uploadToPinata(mediaBuffer, false, mediaFileName);
    console.log("Media uploaded to Pinata with hash:", mediaHash);

    const structuredMetadata = {
      name: metadataFileName,
      [`${uniqueId}Metadata`]: {
        ID: uniqueId,
        data: metadata,
      },
    };

    console.log("Uploading metadata to Pinata...");
    const metadataHash = await uploadToPinata(structuredMetadata, true, metadataFileName);
    console.log("Metadata uploaded to Pinata with hash:", metadataHash);

    console.log("Minting NFT on blockchain...");
    const tx = await contract.safeMint(
      wallet.address,
      `ipfs://${metadataHash}`,
      `ipfs://${mediaHash}`
    );
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();

    res.send({
      message: "Successfully uploaded to the blockchain!",
      metadataURL: `ipfs://${metadataHash}`,
      mediaURL: `ipfs://${mediaHash}`,
      txHash: tx.hash,
    });
  } catch (error) {
    console.error("Error during Pinata upload or smart contract call:", error);
    res.status(500).send({
      error: "Failed to upload to Pinata or blockchain.",
      details: error.message,
    });
  }
});

app.get("/getNFTInfo/:tokenId", async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId);

    if (isNaN(tokenId)) {
      return res.status(400).send({ error: "Invalid token ID." });
    }

    const metadataURI = await contract.tokenURI(tokenId);
    const mediaHash = await contract.getMediaHash(tokenId);

    res.send({
      metadataURI,
      mediaHash,
    });
  } catch (error) {
    console.error("Error fetching NFT information:", error);
    res.status(500).send({
      error: "Failed to fetch NFT information.",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
