const Page = require('./page');

/**
 * Modal Page Object
 * Represents modal dialog interactions
 */
class ModalPage extends Page {
    /**
     * Define page elements
     */
    get modal() {
        return $('[role="dialog"], .modal');
    }

    get backdrop() {
        return $('.modal-backdrop, [data-backdrop]');
    }

    get closeButton() {
        return $('[data-dismiss="modal"], button.close, button[aria-label="Close"]');
    }

    /**
     * Open modal by ID
     * @param {string} modalId - Modal identifier
     */
    async openModal(modalId) {
        const trigger = await $(`button[data-modal="${modalId}"], button[data-target="#${modalId}"]`);
        await this.clickElement(trigger);
        await browser.pause(500); // Wait for modal animation
    }

    /**
     * Close modal
     */
    async closeModal() {
        await this.clickElement(this.closeButton);
        await browser.pause(500); // Wait for close animation
    }

    /**
     * Check if modal is open
     * @returns {Promise<boolean>} True if modal is displayed
     */
    async isModalOpen() {
        return await this.modal.isDisplayed();
    }

    /**
     * Get modal title
     * @returns {Promise<string>} Modal title text
     */
    async getModalTitle() {
        const title = await this.modal.$('h1, h2, h3, [class*="title"]');
        return await title.getText();
    }

    /**
     * Get modal content
     * @returns {Promise<string>} Modal content text
     */
    async getModalContent() {
        const content = await this.modal.$('.modal-body, [class*="content"]');
        return await content.getText();
    }

    /**
     * Click modal action button
     * @param {string} action - Action button identifier (e.g., 'confirm', 'cancel')
     */
    async clickModalAction(action) {
        const button = await this.modal.$(`button[data-action="${action}"]`);
        await this.clickElement(button);
    }
}

module.exports = new ModalPage();
