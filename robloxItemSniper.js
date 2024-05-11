const config = {
    items: new Set([16952003705]),
    minPrice: 50,
    maxPrice: 1000,
    purchaseAmount: 10,
    delayPerPurchase: 2000
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
    let purchaseCounter = 0;
    for (const itemId of config.items) {
        if (purchaseCounter >= config.purchaseAmount) break;

        try {
            const itemDetails = await fetchItemDetails(itemId);
            if (itemDetails.isPurchasable && itemDetails.price >= config.minPrice && itemDetails.price <= config.maxPrice) {
                console.log(`${itemDetails.name} has been put on sale for ${itemDetails.price} R$, attempting purchase..`);
                try {
                    const purchaseAttempt = await purchaseProduct(itemDetails.productId, 1, itemDetails.price, itemDetails.creatorTargetId);
                    if (purchaseAttempt.purchased) {
                        console.log(`Successfully purchased ${itemDetails.name} for ${itemDetails.price} R$!`);
                        config.items.delete(itemId);
                        purchaseCounter++;
                        if (purchaseCounter < config.purchaseAmount) {
                            await new Promise(resolve => setTimeout(resolve, config.delayPerPurchase)); // Delay next purchase
                        }
                    }
                } catch (purchaseError) {
                    console.error(`Error attempting to purchase ${itemDetails.name}:`, purchaseError);
                }
            } else {
                console.log(`${itemDetails.name} is not within the price range of ${config.minPrice} R$ to ${config.maxPrice} R$ or is not purchasable.`);
            }
        } catch (detailsError) {
            console.error(`Error fetching details for item ${itemId}:`, detailsError);
        }
    }
    setTimeout(checkItems, 5000);
}

checkItems();
