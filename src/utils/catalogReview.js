export const catalogReview = products => {
    const counts = new Map();
    const sku = product => String(product.sku || '').trim().toLowerCase();
    products.forEach(product => { const key = sku(product); if (key) counts.set(key, (counts.get(key) || 0) + 1); });
    return products.map(product => ({ product, issues: [
        ...(!sku(product) ? ['Missing SKU'] : []),
        ...(counts.get(sku(product)) > 1 ? ['Duplicate SKU'] : []),
        ...(!String(product.unit || '').trim() ? ['Missing unit'] : []),
        ...(!String(product.category || '').trim() ? ['Missing category'] : []),
    ] }));
};
