
# Stencil NFT Minting Service

Servicio de minting para NFTs de Stencil Limited desplegado en Vercel.

## Configuración

1. **Fork o clon** este repositorio
2. **Configura variables de entorno** en Vercel:
   - `CONTRACT_ADDRESS`: 0x55328Ef63593e82F1B8671D4491015F60cDA74fe
   - `POLYGON_RPC_URL`: https://polygon-rpc.com/
   - `PRIVATE_KEY`: Tu private key (sin 0x)
   - `MINT_AUTH_KEY`: Clave secreta para autorizar minting

3. **Deploy** en Vercel automáticamente

## API Endpoints

### GET /api/mint
Verificar estado del servicio
```
GET https://tu-servicio.vercel.app/api/mint
```

### POST /api/mint
Mintear un NFT
```json
{
  "walletAddress": "0x...",
  "orderId": 12345,
  "productName": "Camiseta Stencil #1",
  "tokenURI": "https://i.ytimg.com/vi/o3XBAImpX7I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDCCmJSdl_Zb6_S5CygSHhnmMgoSw",
  "authKey": "tu_clave_secreta"
}
```

## Respuesta exitosa
```json
{
  "success": true,
  "message": "NFT minteado exitosamente",
  "data": {
    "transactionHash": "0x...",
    "blockNumber": 75833913,
    "gasUsed": "84523",
    "tokenId": "0",
    "contractAddress": "0x55328Ef63593e82F1B8671D4491015F60cDA74fe",
    "to": "0x...",
    "orderId": 12345,
    "productName": "Camiseta Stencil #1",
    "tokenURI": "https://i.ytimg.com/vi/tAEAuNEuw20/maxresdefault.jpg",
    "explorerUrl": "https://polygonscan.com/tx/0x..."
  }
}
```
