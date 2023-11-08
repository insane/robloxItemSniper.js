const config = {
    items: new Set([12109151762, 15028653255, 15260879321, 15260882635, 15260902601, 15266946314])
};

let csrfToken = "";

async function setXCsrfToken() {
    try {
        const response = await fetch("https://accountsettings.roblox.com/v1/email", {
            method: "POST",
            credentials: 'include'
        });
        csrfToken = response.headers.get("x-csrf-token");
    } catch (error) {
        console.error("Error getting CSRF token:", error);
    }
}

async function fetchItemDetails(itemId) {
    const response = await fetch(`https://catalog.roblox.com/v1/catalog/items/${itemId}/details?itemType=Asset`, {
        method: "GET",
        credentials: 'include'
    });
    return response.json();
}

async function purchaseProduct(productId, expectedCurrency, expectedPrice, expectedSellerId) {
    if (!csrfToken) await setXCsrfToken();
    const response = await fetch(`https://economy.roblox.com/v1/purchases/products/${productId}`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify({
            expectedCurrency: expectedCurrency,
            expectedPrice: expectedPrice,
            expectedSellerId: expectedSellerId
        })
    });
    return response.json();
}

async function checkItems() {
    for (const itemId of config.items) {
        const itemDetails = await fetchItemDetails(itemId);
        console.log(itemDetails.name + " isn't purchasable, retrying..");
        if (itemDetails.isPurchasable) {
            const expectedPrice = itemDetails.premiumPricing?.premiumPriceInRobux || itemDetails.price;
            console.log(`${itemDetails.name} has been put on sale for ${expectedPrice} R$, attempting purchase..`);
            const purchaseAttempt = await purchaseProduct(itemDetails.productId, 1, expectedPrice, itemDetails.creatorTargetId);
            if (purchaseAttempt.purchased) {
                console.log(`Successfully purchased ${itemDetails.name} for ${expectedPrice} R$!`);
                config.items.delete(itemId);
            }
        }
    }
    setTimeout(checkItems, 15000);
}


checkItems();
