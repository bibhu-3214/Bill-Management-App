import { catalogReview } from './catalogReview';
test('catalog review distinguishes missing optional metadata from duplicate normalized SKUs', () => {
    const rows = catalogReview([{ _id: 'a', sku: ' box-1 ', unit: 'BOX', category: 'Packaging' }, { _id: 'b', sku: 'BOX-1' }, { _id: 'c', sku: '' }]);
    expect(rows[0].issues).toEqual(['Duplicate SKU']);
    expect(rows[1].issues).toEqual(['Duplicate SKU', 'Missing unit', 'Missing category']);
    expect(rows[2].issues).toEqual(['Missing SKU', 'Missing unit', 'Missing category']);
    expect(catalogReview([])).toEqual([]);
});
