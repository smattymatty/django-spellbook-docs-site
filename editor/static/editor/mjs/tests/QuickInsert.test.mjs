// Test file for Quick Insert functionality
// Tests the ability to track last used SpellBlocks and quickly re-insert them

import { ButtonStateManager } from '../button_bar/ButtonStateManager.mjs';
import { EventCoordinator } from '../button_bar/EventCoordinator.mjs';

// Mock dependencies for testing
class MockRenderer {
    constructor() {
        this.buttonElements = new Map();
        this.mockButton = this.createMockButton();
        this.buttonElements.set('insert-spellblock-btn', this.mockButton);
    }

    createMockButton() {
        const button = document.createElement('button');
        button.id = 'insert-spellblock-btn';
        button.innerHTML = `
            <span class="button-content">
                <span class="button-icon">✨</span>
                <span class="button-text">Insert SpellBlock</span>
            </span>
        `;
        return button;
    }

    getButtonElement(buttonId) {
        return this.buttonElements.get(buttonId);
    }

    setButtonActive() {}
    clearAllActiveStates() {}
}

class MockCursorTracker {
    addChangeCallback() {}
    removeChangeCallback() {}
    getFormattingContext() {
        return { isSpellBlock: false };
    }
}

class MockNotificationService {
    success() {}
    error() {}
}

// Test suite for Quick Insert functionality
export function runQuickInsertTests() {
    const results = [];

    // Test 1: Initial state - no last used SpellBlock
    results.push(testInitialState());

    // Test 2: Set last used SpellBlock
    results.push(testSetLastUsedSpellBlock());

    // Test 3: Button text updates correctly
    results.push(testButtonTextUpdate());

    // Test 4: Quick Insert mode detection
    results.push(testQuickInsertModeDetection());

    // Test 5: Clear last used SpellBlock
    results.push(testClearLastUsedSpellBlock());

    // Test 6: Multiple SpellBlock selections
    results.push(testMultipleSelections());

    return results;
}

function testInitialState() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Initially, there should be no last used SpellBlock
        const lastUsed = stateManager.getLastUsedSpellBlock();
        const isQuickInsertMode = stateManager.isQuickInsertMode();

        if (lastUsed !== null) {
            return { test: 'Initial State', passed: false, error: 'Expected null, got: ' + JSON.stringify(lastUsed) };
        }

        if (isQuickInsertMode !== false) {
            return { test: 'Initial State', passed: false, error: 'Expected false for Quick Insert mode, got: ' + isQuickInsertMode };
        }

        return { test: 'Initial State', passed: true };
    } catch (error) {
        return { test: 'Initial State', passed: false, error: error.message };
    }
}

function testSetLastUsedSpellBlock() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Set a last used SpellBlock
        stateManager.setLastUsedSpellBlock('card', 'Card');

        const lastUsed = stateManager.getLastUsedSpellBlock();

        if (!lastUsed) {
            return { test: 'Set Last Used SpellBlock', passed: false, error: 'Expected object, got null' };
        }

        if (lastUsed.blockName !== 'card' || lastUsed.displayName !== 'Card') {
            return { test: 'Set Last Used SpellBlock', passed: false, error: 'Incorrect values: ' + JSON.stringify(lastUsed) };
        }

        return { test: 'Set Last Used SpellBlock', passed: true };
    } catch (error) {
        return { test: 'Set Last Used SpellBlock', passed: false, error: error.message };
    }
}

function testButtonTextUpdate() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Append the mock button to the document so we can test DOM manipulation
        document.body.appendChild(mockRenderer.mockButton);

        // Set a last used SpellBlock
        stateManager.setLastUsedSpellBlock('alert', 'Alert');

        const buttonText = mockRenderer.mockButton.querySelector('.button-text');
        
        if (!buttonText) {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Button Text Update', passed: false, error: 'Button text element not found' };
        }

        if (buttonText.textContent !== 'Insert Alert') {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Button Text Update', passed: false, error: 'Expected "Insert Alert", got: ' + buttonText.textContent };
        }

        // Check if Quick Insert mode class is added
        if (!mockRenderer.mockButton.classList.contains('quick-insert-mode')) {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Button Text Update', passed: false, error: 'Quick Insert mode class not added' };
        }

        document.body.removeChild(mockRenderer.mockButton);
        return { test: 'Button Text Update', passed: true };
    } catch (error) {
        return { test: 'Button Text Update', passed: false, error: error.message };
    }
}

function testQuickInsertModeDetection() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Initially should not be in Quick Insert mode
        if (stateManager.isQuickInsertMode()) {
            return { test: 'Quick Insert Mode Detection', passed: false, error: 'Should not be in Quick Insert mode initially' };
        }

        // Set a last used SpellBlock
        stateManager.setLastUsedSpellBlock('table', 'Table');

        // Now should be in Quick Insert mode
        if (!stateManager.isQuickInsertMode()) {
            return { test: 'Quick Insert Mode Detection', passed: false, error: 'Should be in Quick Insert mode after setting last used block' };
        }

        return { test: 'Quick Insert Mode Detection', passed: true };
    } catch (error) {
        return { test: 'Quick Insert Mode Detection', passed: false, error: error.message };
    }
}

function testClearLastUsedSpellBlock() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Append the mock button to the document
        document.body.appendChild(mockRenderer.mockButton);

        // Set a last used SpellBlock
        stateManager.setLastUsedSpellBlock('accordion', 'Accordion');

        // Verify it's set
        if (!stateManager.isQuickInsertMode()) {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Clear Last Used SpellBlock', passed: false, error: 'Should be in Quick Insert mode' };
        }

        // Clear the last used SpellBlock
        stateManager.clearLastUsedSpellBlock();

        // Verify it's cleared
        if (stateManager.isQuickInsertMode()) {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Clear Last Used SpellBlock', passed: false, error: 'Should not be in Quick Insert mode after clearing' };
        }

        if (stateManager.getLastUsedSpellBlock() !== null) {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Clear Last Used SpellBlock', passed: false, error: 'Last used SpellBlock should be null after clearing' };
        }

        // Check button text reverted
        const buttonText = mockRenderer.mockButton.querySelector('.button-text');
        if (buttonText.textContent !== 'Insert SpellBlock') {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Clear Last Used SpellBlock', passed: false, error: 'Button text should revert to default' };
        }

        document.body.removeChild(mockRenderer.mockButton);
        return { test: 'Clear Last Used SpellBlock', passed: true };
    } catch (error) {
        return { test: 'Clear Last Used SpellBlock', passed: false, error: error.message };
    }
}

function testMultipleSelections() {
    try {
        const mockRenderer = new MockRenderer();
        const mockCursorTracker = new MockCursorTracker();
        const stateManager = new ButtonStateManager(mockRenderer, mockCursorTracker);

        // Append the mock button to the document
        document.body.appendChild(mockRenderer.mockButton);

        // Set first SpellBlock
        stateManager.setLastUsedSpellBlock('card', 'Card');
        let lastUsed = stateManager.getLastUsedSpellBlock();
        
        if (lastUsed.blockName !== 'card') {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Multiple Selections', passed: false, error: 'First selection not stored correctly' };
        }

        // Set second SpellBlock - should override the first
        stateManager.setLastUsedSpellBlock('alert', 'Alert');
        lastUsed = stateManager.getLastUsedSpellBlock();
        
        if (lastUsed.blockName !== 'alert') {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Multiple Selections', passed: false, error: 'Second selection not stored correctly' };
        }

        // Check button text updated
        const buttonText = mockRenderer.mockButton.querySelector('.button-text');
        if (buttonText.textContent !== 'Insert Alert') {
            document.body.removeChild(mockRenderer.mockButton);
            return { test: 'Multiple Selections', passed: false, error: 'Button text not updated for second selection' };
        }

        document.body.removeChild(mockRenderer.mockButton);
        return { test: 'Multiple Selections', passed: true };
    } catch (error) {
        return { test: 'Multiple Selections', passed: false, error: error.message };
    }
}

// Run tests when module is loaded
if (typeof window !== 'undefined') {
    // Browser environment - can run tests immediately
    window.addEventListener('DOMContentLoaded', () => {
        console.log('Running Quick Insert Tests...');
        const results = runQuickInsertTests();
        
        console.log('\n=== Quick Insert Test Results ===');
        results.forEach(result => {
            if (result.passed) {
                console.log(`✓ ${result.test}`);
            } else {
                console.error(`✗ ${result.test}: ${result.error}`);
            }
        });
        
        const passedCount = results.filter(r => r.passed).length;
        const totalCount = results.length;
        console.log(`\nPassed: ${passedCount}/${totalCount} tests`);
    });
}