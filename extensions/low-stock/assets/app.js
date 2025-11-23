const BASE_URL = "https://e339-59-153-102-133.ngrok-free.app/api/";

async function fetchXHR({ url, method = "POST", headers = { "Content-Type": "application/json" }, data = { shop: Shopify.shop } }, callback) {
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const result = await response.json();
        if (callback) callback(result);
        return result;
    } catch (error) {
        console.error(url + " Error fetching data:", error.message);
    }
}

console.log("Starting ------Shopify Low Stock------");

const getCurrentProductStock = async () => {
    const productId = __st.rid;
    const url = `${BASE_URL}product/${productId}/low-stock`;
    return await fetchXHR({ url });
};

const getSettings = async () => {
    const url = `${BASE_URL}settings/storefront`;
    return await fetchXHR({ url });
};

const showAlert = (totalStock, settings) => {
    console.log
    const quantityInput = document.querySelector('input[name="quantity"]');

    if (quantityInput) {
        const grandParent = quantityInput.parentElement?.parentElement?.parentElement;

        if (grandParent) {
            const newElement = document.createElement('div');

            const alertText = settings?.alertText || '🚨 Low stock alert! Only {stock} left';
            const backgroundColor = settings?.alertBackgroundColor || '#ffffff';
            const textColor = settings?.alertTextColor || '#000000';

            newElement.textContent = alertText.replace("{stock}", totalStock);
            newElement.style.color = textColor;
            newElement.style.backgroundColor = backgroundColor;
            newElement.style.marginTop = '10px';
            newElement.style.padding = '8px';
            newElement.style.borderRadius = '6px';

            grandParent.appendChild(newElement);
        }
    }
};

(async function () {
    try {
        const settings = await getSettings();
        const stockData = await getCurrentProductStock();
        const totalStock = stockData?.totalInventory;

        if (totalStock !== undefined && totalStock !== null && totalStock < 2) {
            showAlert(totalStock, settings);
        }
    } catch (e) {
        console.error("Error during initialization:", e);
    }
})();
