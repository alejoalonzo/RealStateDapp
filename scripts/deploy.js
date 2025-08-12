const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Add tokens helper function
const tokens = n => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  //SET UP ACCOUNT
  [buyer, seller, inspector, lender] = await ethers.getSigners();

  // Get the contract factory we want to deploy
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");

  // Deploy the contract
  const realEstate = await RealEstate.deploy();

  // Wait for the deployment to be confirmed (new syntax)
  await realEstate.waitForDeployment();

  console.log("RealEstate deployed to:", await realEstate.getAddress());

  //🏠 Información de casas reales (de prueba)
  const casas = [
    {
      nombre: "Villa de Lujo en Miami",
      descripcion: "Hermosa villa frente al mar con 5 habitaciones",
      foto: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
      habitaciones: 5,
      precio: "$2,500,000",
    },
    {
      nombre: "Apartamento Moderno en NYC",
      descripcion: "Penthouse en Manhattan con vista increíble",
      foto: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      habitaciones: 3,
      precio: "$3,200,000",
    },
    {
      nombre: "Casa de Campo en Texas",
      descripcion: "Mansión histórica con 50 acres de terreno",
      foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
      habitaciones: 8,
      precio: "$1,800,000",
    },
  ];

  //🏠 Mint (crear) los NFTs
  console.log("🏠 Creando archivos JSON y NFTs...");

  // PASO 1: Crear carpeta para metadata
  const metadataFolder = path.join(__dirname, "..", "metadata");

  // Asegurarnos de que la carpeta existe
  if (!fs.existsSync(metadataFolder)) {
    fs.mkdirSync(metadataFolder);
  }

  const mintedTokenIds = [];

  for (let i = 0; i < casas.length; i++) {
    // PASO 2: Crear el JSON para cada casa
    const metadata = {
      name: casas[i].nombre,
      description: casas[i].descripcion,
      image: casas[i].foto,
      attributes: [
        { trait_type: "Habitaciones", value: casas[i].habitaciones },
        { trait_type: "Precio", value: casas[i].precio },
        {
          trait_type: "Ubicación",
          value: casas[i].nombre.includes("Miami")
            ? "Miami"
            : casas[i].nombre.includes("NYC")
            ? "Nueva York"
            : "Texas",
        },
      ],
    };

    // PASO 3: Guardar el archivo JSON
    const fileName = `${i}.json`;
    const filePath = path.join(metadataFolder, fileName);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    console.log(`📄 Archivo creado: metadata/${fileName}`);

    // PASO 4: Por ahora, usar una URL placeholder (después subiremos a internet)
    const urlMetadata = `https://mi-futuro-servidor.com/metadata/${i}.json`;

    const transaction = await realEstate.connect(seller).mint(urlMetadata);
    const receipt = await transaction.wait();

    // Get the token ID from the Transfer event
    const transferEvent = receipt.logs.find(
      log => log.fragment && log.fragment.name === "Transfer"
    );
    const tokenId = transferEvent ? transferEvent.args[2] : i + 1; // fallback to i + 1

    mintedTokenIds.push(tokenId);
    console.log(`✅ NFT ${tokenId} creado: ${casas[i].nombre}`);
  }

  console.log(`\n🎉 ¡Completado!`);
  console.log(`📂 Archivos JSON creados en: ${metadataFolder}`);
  console.log(`🏠 ${casas.length} NFTs mintados`);
  console.log(`🔢 Token IDs mintados: ${mintedTokenIds.join(", ")}`);

  //Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    await realEstate.getAddress(),
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.waitForDeployment();

  // Approve each minted NFT using the actual token IDs
  for (let i = 0; i < mintedTokenIds.length; i++) {
    const tokenId = mintedTokenIds[i];
    const transaction = await realEstate
      .connect(seller)
      .approve(await escrow.getAddress(), tokenId);
    await transaction.wait();
    console.log(`✅ Oferta creada para NFT ${tokenId}: ${casas[i].nombre}`);
  }

  //Listing properties - use the actual token IDs
  let transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[0], buyer.address, tokens(20), tokens(10));
  await transaction.wait();
  transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[1], buyer.address, tokens(15), tokens(5));
  await transaction.wait();
  transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[2], buyer.address, tokens(10), tokens(3));
  await transaction.wait();

  console.log("Escrow deployed to:", await escrow.getAddress());
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
