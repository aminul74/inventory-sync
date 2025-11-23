/*
    Price Showing Formatter
    For Example:
        USD 123.00
        USD 123.00 - USD 150.00
        USD 123.00 - USD 150.00
*/

export function formatPriceRange(minPrice: number, maxPrice: number, currencyCode: string): string {
    const min = Number(minPrice);
    const max = Number(maxPrice);

    const formattedMin = `${currencyCode} ${min.toFixed(2)}`;
    const formattedMax = `${currencyCode} ${max.toFixed(2)}`;

    if (minPrice === maxPrice) {
        return formattedMin;
    } else {
        return `${formattedMin} - ${formattedMax}`;
    }
}

export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  