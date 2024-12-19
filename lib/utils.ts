import { PriceHistoryItem, Product } from "@/types";

export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();
    if(priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');
      let firstPrice;
      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      } 
      return firstPrice || cleanPrice;
    }
  }
  return '';
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

export function extractDescription($: any) {
  const selectors = [
    '#feature-bullets .a-list-item',
    '#productDescription p',
    '.aplus-v2 p'
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join('\n');
      return textContent;
    }
  }

  return '';
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0]?.price || 0;

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice) {
      highestPrice = priceList[i].price;
    }
  }

  return highestPrice;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0]?.price || 0;

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice) {
      lowestPrice = priceList[i].price;
    }
  }

  return lowestPrice;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;
  return averagePrice;
}

export function getEmailNotifType(
  scrapedProduct: Product,
  currentProduct: Product
) {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return "LOWEST_PRICE";
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return "CHANGE_OF_STOCK";
  }
  if (scrapedProduct.currentPrice < currentProduct.currentPrice) {
    return "THRESHOLD_MET";
  }

  return null;
} 