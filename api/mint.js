const { ethers } = require('ethers');

// ABI del contrato
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "uri", "type": "string" },
      { "internalType": "uint256", "name": "orderId", "type": "uint256" },
      { "internalType": "string", "name": "productName", "type": "string" }
    ],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ 
      status: 'ok', 
      message: 'Stencil NFT Minting Service funcionando',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Parse manual del body si es necesario
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'JSON inválido' });
      }
    }

    const { 
      walletAddress, 
      orderId, 
      productName, 
      tokenURI,
      authKey 
    } = body;

    // Verificar parámetros requeridos
    if (!walletAddress || !orderId || !productName || !tokenURI || !authKey) {
      return res.status(400).json({ 
        error: 'Faltan parámetros requeridos',
        required: ['walletAddress', 'orderId', 'productName', 'tokenURI', 'authKey']
      });
    }

    // Verificar clave de autorización
    if (authKey !== process.env.AUTH_KEY) {
      return res.status(401).json({ error: 'Clave de autorización inválida' });
    }

    // Validar dirección de wallet
    if (!ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Dirección de wallet inválida' });
    }

    // Configurar proveedor y wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Conectar al contrato
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS, 
      CONTRACT_ABI, 
      wallet
    );

    // Mintear el NFT
    const tx = await contract.mintNFT(
      walletAddress,
      tokenURI,
      parseInt(orderId),
      productName
    );

    // Esperar confirmación
    const receipt = await tx.wait();
    
    return res.json({
      success: true,
      message: 'NFT minteado exitosamente',
      data: {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: process.env.CONTRACT_ADDRESS,
        to: walletAddress,
        orderId: orderId,
        productName: productName,
        tokenURI: tokenURI,
        explorerUrl: `https://polygonscan.com/tx/${receipt.transactionHash}`
      }
    });

  } catch (error) {
    console.error('Error minteando NFT:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Fondos insuficientes en la wallet';
      statusCode = 402;
    } else if (error.reason) {
      errorMessage = error.reason;
      statusCode = 400;
    }

    return res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message
    });
  }
};
