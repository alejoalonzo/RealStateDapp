// Utilidades para conversión de precios a criptomonedas
// Precios aproximados (en una app real, estos vendrían de una API como CoinGecko)
const CRYPTO_PRICES = {
  ETH: 3200, // USD por ETH
  BTC: 65000, // USD por BTC
};

/**
 * Extrae el valor numérico de un string de precio
 * @param {string} priceString - Precio en formato "$450,000" o similar
 * @returns {number} - Valor numérico
 */
export const extractPriceValue = priceString => {
  if (!priceString || typeof priceString !== "string") return 0;

  // Remover todo excepto números, puntos y comas
  const cleanPrice = priceString.replace(/[^\d.,]/g, "");

  // Remover comas y convertir a número
  const numericValue = parseFloat(cleanPrice.replace(/,/g, ""));

  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Convierte USD a Ethereum
 * @param {number} usdAmount - Cantidad en USD
 * @returns {string} - Cantidad formateada en ETH
 */
export const convertToETH = usdAmount => {
  const ethAmount = usdAmount / CRYPTO_PRICES.ETH;
  return ethAmount.toFixed(2);
};

/**
 * Convierte USD a Bitcoin
 * @param {number} usdAmount - Cantidad en USD
 * @returns {string} - Cantidad formateada en BTC
 */
export const convertToBTC = usdAmount => {
  const btcAmount = usdAmount / CRYPTO_PRICES.BTC;
  return btcAmount.toFixed(4);
};

/**
 * Formatea un precio mostrando crypto y USD
 * @param {string} priceString - Precio original en string
 * @param {string} cryptoType - 'ETH' o 'BTC'
 * @returns {object} - Objeto con precios formateados
 */
export const formatCryptoPrice = (priceString, cryptoType = "ETH") => {
  const usdValue = extractPriceValue(priceString);

  if (usdValue === 0) {
    return {
      crypto: `0 ${cryptoType}`,
      usd: priceString,
      cryptoValue: 0,
      usdValue: 0,
    };
  }

  let cryptoAmount;
  let cryptoFormatted;

  if (cryptoType === "BTC") {
    cryptoAmount = convertToBTC(usdValue);
    cryptoFormatted = `${cryptoAmount} BTC`;
  } else {
    cryptoAmount = convertToETH(usdValue);
    cryptoFormatted = `${cryptoAmount} ETH`;
  }

  return {
    crypto: cryptoFormatted,
    usd: priceString,
    cryptoValue: parseFloat(cryptoAmount),
    usdValue: usdValue,
  };
};

/**
 * Componente de precio que muestra crypto y USD
 * @param {string} priceString - Precio original
 * @param {string} cryptoType - 'ETH' o 'BTC'
 * @param {string} cryptoSize - Tamaño del texto crypto
 * @param {string} usdSize - Tamaño del texto USD
 */
export const PriceDisplay = ({
  priceString,
  cryptoType = "ETH",
  cryptoSize = "text-2xl",
  usdSize = "text-sm",
  cryptoColor = "text-green-600",
  usdColor = "text-gray-500",
}) => {
  const formattedPrice = formatCryptoPrice(priceString, cryptoType);

  return (
    <div className="space-y-1">
      <div className={`${cryptoSize} font-bold ${cryptoColor}`}>
        {formattedPrice.crypto}
      </div>
      <div className={`${usdSize} ${usdColor}`}>{formattedPrice.usd}</div>
    </div>
  );
};

export default {
  extractPriceValue,
  convertToETH,
  convertToBTC,
  formatCryptoPrice,
  PriceDisplay,
  CRYPTO_PRICES,
};
