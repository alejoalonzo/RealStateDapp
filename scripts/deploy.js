const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Add tokens helper function
const tokens = n => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  //SET UP ACCOUNT - Account #0 = seller, Account #1 = buyer
  [seller, buyer, inspector, lender] = await ethers.getSigners();

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
      nombre: "Luxury Villa in Miami",
      descripcion:
        "Beautiful oceanfront villa with 5 bedrooms, private pool, and stunning sea views. Modern amenities throughout.",
      foto: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
      habitaciones: 5,
      precio: "20 ETH",
      banos: 4,
      superficie: "4,500",
      anoConstructor: "2020",
      tipoPropiedad: "Villa",
      ubicacion: "Miami Beach, FL",
    },
    {
      nombre: "Modern Penthouse in NYC",
      descripcion:
        "Stunning penthouse in Manhattan with incredible city views, luxury finishes, and rooftop terrace.",
      foto: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      habitaciones: 3,
      precio: "15 ETH",
      banos: 3,
      superficie: "2,800",
      anoConstructor: "2018",
      tipoPropiedad: "Penthouse",
      ubicacion: "Manhattan, NY",
    },
    {
      nombre: "Country Estate in Texas",
      descripcion:
        "Historic mansion with 50 acres of land, horse stables, and panoramic countryside views.",
      foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500",
      habitaciones: 8,
      precio: "10 ETH",
      banos: 6,
      superficie: "8,200",
      anoConstructor: "1925",
      tipoPropiedad: "Estate",
      ubicacion: "Austin, TX",
    },
    {
      nombre: "Industrial Loft in Chicago",
      descripcion:
        "Spacious loft in the artistic district with exposed brick, high ceilings, and modern updates.",
      foto: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      habitaciones: 2,
      precio: "8 ETH",
      banos: 2,
      superficie: "1,800",
      anoConstructor: "2015",
      tipoPropiedad: "Loft",
      ubicacion: "Chicago, IL",
    },
    {
      nombre: "Colonial House in Boston",
      descripcion:
        "Elegant historic house in Beacon Hill with original hardwood floors and modern kitchen.",
      foto: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500",
      habitaciones: 4,
      precio: "12 ETH",
      banos: 3,
      superficie: "3,200",
      anoConstructor: "1890",
      tipoPropiedad: "Colonial",
      ubicacion: "Boston, MA",
    },
    {
      nombre: "Contemporary Condo in LA",
      descripcion:
        "Modern condo with panoramic views, luxury amenities, and prime location in downtown LA.",
      foto: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
      habitaciones: 3,
      precio: "18 ETH",
      banos: 3,
      superficie: "2,200",
      anoConstructor: "2019",
      tipoPropiedad: "Condo",
      ubicacion: "Los Angeles, CA",
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
        { trait_type: "Bedrooms", value: casas[i].habitaciones },
        { trait_type: "Bathrooms", value: casas[i].banos },
        { trait_type: "Price", value: casas[i].precio },
        { trait_type: "Square Feet", value: casas[i].superficie },
        { trait_type: "Year Built", value: casas[i].anoConstructor },
        { trait_type: "Property Type", value: casas[i].tipoPropiedad },
        { trait_type: "Location", value: casas[i].ubicacion },
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

  // Listar las 3 propiedades adicionales
  transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[3], buyer.address, tokens(8), tokens(2));
  await transaction.wait();
  transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[4], buyer.address, tokens(12), tokens(4));
  await transaction.wait();
  transaction = await escrow
    .connect(seller)
    .list(mintedTokenIds[5], buyer.address, tokens(18), tokens(6));
  await transaction.wait();

  console.log("Escrow deployed to:", await escrow.getAddress());
  console.log(
    `\n🏠 ${casas.length} propiedades listadas en el contrato Escrow`
  );
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
