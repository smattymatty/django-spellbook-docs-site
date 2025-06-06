// editor/static/editor/mjs/tests/SpellBlockDropdown.test.mjs

import { SpellBlockDropdown } from '../button_bar/SpellBlockDropdown.mjs';
import { spellBlockRegistry } from '../button_bar/SpellBlockRegistry.mjs';

/**
 * Test suite for SpellBlockDropdown component
 * Tests the dropdown UI and functionality without server-side dependencies
 */
class SpellBlockDropdownTest {
    constructor() {
        this.testResults = [];
        this.mockDropdown = null;
        this.mockButton = null;
        this.mockNotificationService = null;
        this.originalFetch = null;
        this.setupMocks();
    }

    /**
     * Set up mock dependencies
     */
    setupMocks() {
        // Mock notification service
        this.mockNotificationService = {
            success: (message) => console.log('SUCCESS: ' + message),
            error: (message) => console.log('ERROR: ' + message),
            info: (message) => console.log('INFO: ' + message),
            warning: (message) => console.log('WARNING: ' + message)
        };

        // Create mock button element
        this.mockButton = document.createElement('button');
        this.mockButton.id = 'test-spellblock-dropdown-btn';
        this.mockButton.textContent = 'Test Button';
        this.mockButton.style.position = 'absolute';
        this.mockButton.style.top = '100px';
        this.mockButton.style.left = '100px';
        document.body.appendChild(this.mockButton);

        // Mock fetch for API calls
        this.originalFetch = window.fetch;
        window.fetch = this.createMockFetch();
    }

    /**
     * Create mock fetch function with realistic SpellBlock data
     */
    createMockFetch() {
        return async (url) => {
            if (url.includes('spellblock-registry')) {
                return {
                    ok: true,
                    json: async () => ({
                        blocks: [
                            {
                                name: 'card',
                                class_name: 'CardBlock',
                                description: 'A card block for displaying content with optional title and footer',
                                parameters: {
                                    title: { default: '', type: 'str', required: false },
                                    footer: { default: '', type: 'str', required: false },
                                    class: { default: '', type: 'str', required: false }
                                }
                            },
                            {
                                name: 'alert',
                                class_name: 'AlertBlock',
                                description: 'Display alert messages with different types',
                                parameters: {
                                    type: { default: 'info', type: 'str', required: false }
                                }
                            },
                            {
                                name: 'quote',
                                class_name: 'QuoteBlock',
                                description: 'Display quotes with author attribution',
                                parameters: {
                                    author: { default: '', type: 'str', required: false },
                                    source: { default: '', type: 'str', required: false }
                                }
                            }
                        ],
                        count: 3
                    })
                };
            }
            throw new Error('Mock fetch: URL not found');
        };
    }

    /**
     * Clean up after tests
     */
    cleanup() {
        if (this.mockDropdown) {
            this.mockDropdown.destroy();
            this.mockDropdown = null;
        }
        if (this.mockButton && this.mockButton.parentNode) {
            this.mockButton.parentNode.removeChild(this.mockButton);
        }
        
        // Restore original fetch
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }

        // Clear any remaining dropdown elements
        document.querySelectorAll('.spellblock-dropdown').forEach(el => el.remove());
        
        // Reset registry cache
        spellBlockRegistry.invalidateCache();
    }

    /**
     * Assert utility
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error('Assertion failed: ' + message);
        }
    }

    /**
     * Test runner utility
     */
    async runTest(testName, testFunction) {
        try {
            console.log('Running test: ' + testName);
            await testFunction();
            this.testResults.push({ name: testName, status: "PASS" });
            console.log('✅ ' + testName + ': PASS');
        } catch (error) {
            this.testResults.push({
                name: testName,
                status: "FAIL",
                error: error.message,
            });
            console.error('❌ ' + testName + ': FAIL - ' + error.message);
        }
    }

    /**
     * Test dropdown creation and initialization
     */
    async testDropdownCreation() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        this.assert(this.mockDropdown !== null, "Dropdown should be created");
        this.assert(this.mockDropdown.targetElement === this.mockButton, "Target element should be set");
        this.assert(this.mockDropdown.notificationService === this.mockNotificationService, "Notification service should be set");
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should start closed");
        this.assert(this.mockDropdown.dropdownElement !== null, "Dropdown DOM element should be created");
        
        // Check if dropdown is added to DOM but hidden
        const dropdownInDOM = document.querySelector('.spellblock-dropdown');
        this.assert(dropdownInDOM !== null, "Dropdown should be added to DOM");
        this.assert(!dropdownInDOM.classList.contains('visible'), "Dropdown should start hidden");
    }

    /**
     * Test dropdown show/hide functionality
     */
    async testDropdownShowHide() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        // Test show
        await this.mockDropdown.show();
        this.assert(this.mockDropdown.isOpen === true, "Dropdown should be open after show()");
        
        const dropdownEl = document.querySelector('.spellblock-dropdown');
        this.assert(dropdownEl.classList.contains('visible'), "Dropdown should have 'visible' class");
        
        // Test hide
        this.mockDropdown.hide();
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should be closed after hide()");
        this.assert(!dropdownEl.classList.contains('visible'), "Dropdown should not have 'visible' class");
    }

    /**
     * Test dropdown positioning
     */
    async testDropdownPositioning() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        
        const dropdownEl = document.querySelector('.spellblock-dropdown');
        const computedStyle = window.getComputedStyle(dropdownEl);
        
        this.assert(computedStyle.position === 'fixed', "Dropdown should be positioned fixed");
        this.assert(computedStyle.zIndex === '9999', "Dropdown should have high z-index");
        
        // Position should be calculated relative to button
        const top = parseInt(computedStyle.top);
        const left = parseInt(computedStyle.left);
        
        this.assert(top > 0, "Dropdown should have positive top position");
        this.assert(left >= 0, "Dropdown should have non-negative left position");
    }

    /**
     * Test SpellBlock registry integration
     */
    async testRegistryIntegration() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        
        // Wait for blocks to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const blocksList = document.querySelector('.spellblock-blocks-list');
        this.assert(blocksList !== null, "Blocks list should be rendered");
        
        const blockItems = blocksList.querySelectorAll('.spellblock-item');
        this.assert(blockItems.length === 3, "Should display 3 mock blocks");
        
        // Check block content - find card block
        let cardBlock = null;
        for (let i = 0; i < blockItems.length; i++) {
            const codeEl = blockItems[i].querySelector('.spellblock-item-code');
            if (codeEl && codeEl.textContent === 'card') {
                cardBlock = blockItems[i];
                break;
            }
        }
        
        this.assert(cardBlock !== null, "Card block should be displayed");
        
        const nameEl = cardBlock.querySelector('.spellblock-item-name');
        this.assert(nameEl.textContent === 'Card', "Block display name should be formatted");
    }

    /**
     * Test search functionality
     */
    async testSearchFunctionality() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const searchInput = document.querySelector('.spellblock-search-input');
        this.assert(searchInput !== null, "Search input should exist");
        
        // Test initial state
        let blockItems = document.querySelectorAll('.spellblock-item');
        this.assert(blockItems.length === 3, "Should show all blocks initially");
        
        // Test search filtering
        searchInput.value = 'card';
        searchInput.dispatchEvent(new Event('input'));
        
        // Wait for search to process
        await new Promise(resolve => setTimeout(resolve, 50));
        
        blockItems = document.querySelectorAll('.spellblock-item');
        this.assert(blockItems.length === 1, "Should show only matching blocks");
        
        const remainingBlock = blockItems[0].querySelector('.spellblock-item-code').textContent;
        this.assert(remainingBlock === 'card', "Should show only card block");
        
        // Test clearing search
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        await new Promise(resolve => setTimeout(resolve, 50));
        
        blockItems = document.querySelectorAll('.spellblock-item');
        this.assert(blockItems.length === 3, "Should show all blocks when search is cleared");
    }

    /**
     * Test keyboard navigation
     */
    async testKeyboardNavigation() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const searchInput = document.querySelector('.spellblock-search-input');
        
        // Test arrow down navigation
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        this.assert(this.mockDropdown.selectedIndex === 0, "Should select first item");
        
        const firstItem = document.querySelectorAll('.spellblock-item')[0];
        this.assert(firstItem.classList.contains('selected'), "First item should have selected class");
        
        // Test arrow down again
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        this.assert(this.mockDropdown.selectedIndex === 1, "Should select second item");
        
        const secondItem = document.querySelectorAll('.spellblock-item')[1];
        this.assert(secondItem.classList.contains('selected'), "Second item should have selected class");
        this.assert(!firstItem.classList.contains('selected'), "First item should not be selected");
        
        // Test arrow up navigation
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        this.assert(this.mockDropdown.selectedIndex === 0, "Should go back to first item");
        
        // Test wrap-around at end
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        this.assert(this.mockDropdown.selectedIndex === 2, "Should wrap to last item");
    }

    /**
     * Test block selection
     */
    async testBlockSelection() {
        let selectedBlock = null;
        
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        this.mockDropdown.setOnBlockSelect((block) => {
            selectedBlock = block;
        });
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test clicking on a block - find card block
        const blockItems = document.querySelectorAll('.spellblock-item');
        let cardBlock = null;
        
        for (let i = 0; i < blockItems.length; i++) {
            const codeEl = blockItems[i].querySelector('.spellblock-item-code');
            if (codeEl && codeEl.textContent === 'card') {
                cardBlock = blockItems[i];
                break;
            }
        }
        
        if (cardBlock) {
            cardBlock.click();
            
            this.assert(selectedBlock !== null, "Block should be selected");
            this.assert(selectedBlock.name === 'card', "Selected block should be card");
            this.assert(this.mockDropdown.isOpen === false, "Dropdown should close after selection");
        }
    }

    /**
     * Test Enter key selection
     */
    async testEnterKeySelection() {
        let selectedBlock = null;
        
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        this.mockDropdown.setOnBlockSelect((block) => {
            selectedBlock = block;
        });
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const searchInput = document.querySelector('.spellblock-search-input');
        
        // Navigate to first item and select with Enter
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        
        this.assert(selectedBlock !== null, "Block should be selected with Enter key");
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should close after Enter selection");
    }

    /**
     * Test Escape key closing
     */
    async testEscapeKeyClosing() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        this.assert(this.mockDropdown.isOpen === true, "Dropdown should be open");
        
        // Test Escape key
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should close with Escape key");
    }

    /**
     * Test click outside to close
     */
    async testClickOutsideToClose() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        this.assert(this.mockDropdown.isOpen === true, "Dropdown should be open");
        
        // Click outside the dropdown
        document.body.click();
        
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should close when clicking outside");
    }

    /**
     * Test close button functionality
     */
    async testCloseButton() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        
        const closeButton = document.querySelector('.spellblock-dropdown-close');
        this.assert(closeButton !== null, "Close button should exist");
        
        closeButton.click();
        this.assert(this.mockDropdown.isOpen === false, "Dropdown should close when close button is clicked");
    }

    /**
     * Test toggle functionality
     */
    async testToggleFunctionality() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        // Test toggle open
        this.mockDropdown.toggle();
        await new Promise(resolve => setTimeout(resolve, 100));
        this.assert(this.mockDropdown.isOpen === true, "Toggle should open closed dropdown");
        
        // Test toggle close
        this.mockDropdown.toggle();
        this.assert(this.mockDropdown.isOpen === false, "Toggle should close open dropdown");
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        // Mock fetch to return error
        window.fetch = async () => {
            throw new Error('Network error');
        };
        
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const errorEl = document.querySelector('.spellblock-error');
        this.assert(errorEl !== null, "Error message should be displayed on API failure");
        
        const errorMessage = errorEl.querySelector('.error-message');
        this.assert(errorMessage !== null, "Error message element should exist");
        this.assert(errorMessage.textContent.includes('Failed to load'), "Error message should mention loading failure");
    }

    /**
     * Test destroy functionality
     */
    async testDestroy() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        
        const dropdownEl = document.querySelector('.spellblock-dropdown');
        this.assert(dropdownEl !== null, "Dropdown element should exist before destroy");
        
        this.mockDropdown.destroy();
        
        const dropdownElAfter = document.querySelector('.spellblock-dropdown');
        this.assert(dropdownElAfter === null, "Dropdown element should be removed after destroy");
        
        this.assert(this.mockDropdown.dropdownElement === null, "Internal dropdown reference should be null");
        this.assert(this.mockDropdown.isOpen === false, "isOpen should be false after destroy");
    }

    /**
     * Test count display
     */
    async testCountDisplay() {
        this.mockDropdown = new SpellBlockDropdown(this.mockButton, this.mockNotificationService);
        
        await this.mockDropdown.show();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const countEl = document.querySelector('.spellblock-count');
        this.assert(countEl !== null, "Count element should exist");
        this.assert(countEl.textContent.includes('3 blocks'), "Count should show 3 blocks");
        
        // Test count after search
        const searchInput = document.querySelector('.spellblock-search-input');
        searchInput.value = 'alert';
        searchInput.dispatchEvent(new Event('input'));
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        this.assert(countEl.textContent.includes('1 of 3'), "Count should show filtered results");
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log("🧪 Starting SpellBlockDropdown Tests...");

        // Reset before each test suite
        this.testResults = [];

        await this.runTest("Dropdown Creation", () => this.testDropdownCreation());
        await this.runTest("Show/Hide Functionality", () => this.testDropdownShowHide());
        await this.runTest("Positioning", () => this.testDropdownPositioning());
        await this.runTest("Registry Integration", () => this.testRegistryIntegration());
        await this.runTest("Search Functionality", () => this.testSearchFunctionality());
        await this.runTest("Keyboard Navigation", () => this.testKeyboardNavigation());
        await this.runTest("Block Selection", () => this.testBlockSelection());
        await this.runTest("Enter Key Selection", () => this.testEnterKeySelection());
        await this.runTest("Escape Key Closing", () => this.testEscapeKeyClosing());
        await this.runTest("Click Outside to Close", () => this.testClickOutsideToClose());
        await this.runTest("Close Button", () => this.testCloseButton());
        await this.runTest("Toggle Functionality", () => this.testToggleFunctionality());
        await this.runTest("Error Handling", () => this.testErrorHandling());
        await this.runTest("Destroy Functionality", () => this.testDestroy());
        await this.runTest("Count Display", () => this.testCountDisplay());

        // Clean up after all tests
        this.cleanup();

        // Report results
        const passed = this.testResults.filter((r) => r.status === "PASS").length;
        const failed = this.testResults.filter((r) => r.status === "FAIL").length;

        console.log('\n📊 SpellBlockDropdown Test Results: ' + passed + ' passed, ' + failed + ' failed');

        if (failed > 0) {
            console.log("\n❌ Failed tests:");
            this.testResults
                .filter((r) => r.status === "FAIL")
                .forEach((r) => console.log('  - ' + r.name + ': ' + r.error));
        }

        return { passed, failed, total: this.testResults.length };
    }
}

export default SpellBlockDropdownTest;