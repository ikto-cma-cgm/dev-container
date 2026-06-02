/**
 * Product Creation - API + E2E Integration Tests
 * Tests complete scenarios combining API calls and UI verification
 * Project: ${{ values.projectName }}
 */

const ProductPage = require('../../pageobjects/product.page');
const apiHelper = require('../../helpers/api-helper');
const testData = require('../../helpers/test-data');

describe('Product Creation - API + E2E Integration', () => {
    let createdProductId;
    let authToken;

    before(async () => {
        // Login via API to get auth token
        authToken = await apiHelper.login(
            testData.users.admin.username,
            testData.users.admin.password
        );
    });

    afterEach(async () => {
        // Cleanup: Delete created products
        if (createdProductId) {
            await apiHelper.deleteProduct(createdProductId, authToken);
            createdProductId = null;
        }
    });

    it('should create product via API and verify in UI', async () => {
        // Step 1: Create product via API
        const newProduct = {
            name: `Test Product ${Date.now()}`,
            price: 99.99,
            category: 'Electronics',
            description: 'E2E Test Product'
        };

        const response = await apiHelper.createProduct(newProduct, authToken);
        createdProductId = response.id;

        expect(response.id).toBeDefined();
        expect(response.name).toBe(newProduct.name);

        // Step 2: Verify product appears in UI
        await ProductPage.open();
        await ProductPage.searchProduct(newProduct.name);

        const productCard = await ProductPage.getProductByName(newProduct.name);
        await expect(productCard).toBeDisplayed();

        // Step 3: Verify product details
        await productCard.click();
        const displayedName = await ProductPage.productTitle.getText();
        const displayedPrice = await ProductPage.productPrice.getText();

        expect(displayedName).toBe(newProduct.name);
        expect(displayedPrice).toContain('99.99');
    });

    it('should update product via API and see changes in UI', async () => {
        // Create product
        const product = await apiHelper.createProduct({
            name: 'Original Name',
            price: 50.00
        }, authToken);
        createdProductId = product.id;

        // Update via API
        const updated = await apiHelper.updateProduct(product.id, {
            name: 'Updated Name',
            price: 75.00
        }, authToken);

        // Verify in UI
        await ProductPage.open();
        await ProductPage.searchProduct('Updated Name');

        const productCard = await ProductPage.getProductByName('Updated Name');
        await expect(productCard).toBeDisplayed();
    });

    it('should delete product via API and verify removal from UI', async () => {
        // Create product
        const product = await apiHelper.createProduct({
            name: 'To Be Deleted',
            price: 25.00
        }, authToken);

        // Verify it exists
        await ProductPage.open();
        await ProductPage.searchProduct('To Be Deleted');
        let productCard = await ProductPage.getProductByName('To Be Deleted');
        await expect(productCard).toBeDisplayed();

        // Delete via API
        await apiHelper.deleteProduct(product.id, authToken);

        // Verify removal in UI
        await browser.refresh();
        await ProductPage.searchProduct('To Be Deleted');
        productCard = await ProductPage.getProductByName('To Be Deleted');
        await expect(productCard).not.toBeExisting();
    });

    it('should handle concurrent API operations and UI updates', async () => {
        // Create multiple products concurrently
        const products = await Promise.all([
            apiHelper.createProduct({ name: 'Product 1', price: 10 }, authToken),
            apiHelper.createProduct({ name: 'Product 2', price: 20 }, authToken),
            apiHelper.createProduct({ name: 'Product 3', price: 30 }, authToken)
        ]);

        // Store IDs for cleanup
        products.forEach(p => createdProductId = p.id);

        // Verify all appear in UI
        await ProductPage.open();

        for (const product of products) {
            await ProductPage.searchProduct(product.name);
            const card = await ProductPage.getProductByName(product.name);
            await expect(card).toBeDisplayed();
        }

        // Cleanup
        await Promise.all(
            products.map(p => apiHelper.deleteProduct(p.id, authToken))
        );
    });

    it('should validate business rules via API then UI', async () => {
        // Test: Cannot create product with negative price
        try {
            await apiHelper.createProduct({
                name: 'Invalid Product',
                price: -10
            }, authToken);

            // Should not reach here
            expect(true).toBe(false);
        } catch (error) {
            expect(error.status).toBe(400);
            expect(error.message).toMatch(/price/i);
        }

        // Verify UI also prevents this
        await ProductPage.openCreateForm();
        await ProductPage.fillProductForm({
            name: 'Invalid Product',
            price: '-10'
        });
        await ProductPage.submitForm();

        const errorMsg = await ProductPage.getPriceError();
        expect(errorMsg).toMatch(/positive|greater than/i);
    });
});
