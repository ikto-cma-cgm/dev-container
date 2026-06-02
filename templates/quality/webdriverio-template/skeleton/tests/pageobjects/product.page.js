const Page = require('./page');

/**
 * Product Page Object
 * Represents product-related pages and operations
 */
class ProductPage extends Page {
    /**
     * Define page elements
     */
    get searchInput() {
        return $('input[name="search"], input[placeholder*="Search"]');
    }

    get searchButton() {
        return $('button[type="submit"]');
    }

    get productTitle() {
        return $('h1.product-title, h1[data-testid="product-title"]');
    }

    get productPrice() {
        return $('.product-price, [data-testid="product-price"]');
    }

    get addToCartBtn() {
        return $('button[data-action="add-to-cart"]');
    }

    /**
     * Open products page
     */
    async open() {
        await super.open('/products');
    }

    /**
     * Search for a product
     * @param {string} productName - Product name to search
     */
    async searchProduct(productName) {
        await this.setValue(this.searchInput, productName);
        await this.clickElement(this.searchButton);
        await browser.pause(1000); // Wait for search results
    }

    /**
     * Get product card by name
     * @param {string} name - Product name
     * @returns {Promise<WebdriverIO.Element>} Product card element
     */
    async getProductByName(name) {
        return await $(`//*[contains(@class, "product-card")]//*[contains(text(), "${name}")]`);
    }

    /**
     * Open product creation form
     */
    async openCreateForm() {
        await this.open();
        const createBtn = await $('button[data-action="create-product"]');
        await this.clickElement(createBtn);
    }

    /**
     * Fill product form
     * @param {Object} productData - Product data
     * @param {string} productData.name - Product name
     * @param {number} productData.price - Product price
     * @param {string} productData.description - Product description
     */
    async fillProductForm(productData) {
        if (productData.name) {
            await this.setValue($('input[name="name"]'), productData.name);
        }
        if (productData.price) {
            await this.setValue($('input[name="price"]'), productData.price.toString());
        }
        if (productData.description) {
            await this.setValue($('textarea[name="description"]'), productData.description);
        }
    }

    /**
     * Submit form
     */
    async submitForm() {
        await this.clickElement($('button[type="submit"]'));
    }

    /**
     * Get price error message
     * @returns {Promise<string>} Price error text
     */
    async getPriceError() {
        const error = await $('input[name="price"] + .error, .price-error');
        return await error.getText();
    }
}

module.exports = new ProductPage();
