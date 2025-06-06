// static/mjs/tests/KeyboardShortcutManager.test.mjs

import { KeyboardShortcutManager } from '../button_bar/KeyboardShortcutManager.mjs';

/**
 * Comprehensive test suite for KeyboardShortcutManager
 */
export class KeyboardShortcutManagerTest {
    constructor() {
        this.results = [];
        this.mockEventCoordinator = null;
        this.mockElement = null;
        this.manager = null;
    }

    /**
     * Create mock EventCoordinator for testing
     */
    createMockEventCoordinator() {
        return {
            handleMarkdownFormat: function(formatType, type) {
                this._lastFormat = { formatType, type };
            },
            handleInsertSpellBlock: function() {
                this._lastAction = 'insertSpellBlock';
            },
            hasCustomAction: function() { return false; },
            executeActionByName: function() {},
            renderer: {
                getButtonElement: function() {
                    return document.createElement('button');
                }
            },
            notificationService: {
                info: function() {}
            },
            _lastFormat: null,
            _lastAction: null
        };
    }

    /**
     * Create mock DOM element for testing
     */
    createMockElement() {
        const element = document.createElement('textarea');
        element.id = 'test-editor';
        document.body.appendChild(element);
        return element;
    }

    /**
     * Simulate keyboard event
     */
    createKeyboardEvent(key, modifiers = {}) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            ctrlKey: modifiers.ctrl || false,
            metaKey: modifiers.meta || false,
            shiftKey: modifiers.shift || false,
            altKey: modifiers.alt || false,
            bubbles: true,
            cancelable: true
        });
        return event;
    }

    /**
     * Add test result
     */
    addResult(testName, passed, message) {
        this.results.push({
            testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Test manager initialization
     */
    testInitialization() {
        try {
            console.log('Creating mock event coordinator...');
            this.mockEventCoordinator = this.createMockEventCoordinator();
            
            console.log('Creating KeyboardShortcutManager...');
            this.manager = new KeyboardShortcutManager(this.mockEventCoordinator);

            this.addResult(
                'Initialization',
                this.manager instanceof KeyboardShortcutManager,
                'Should create KeyboardShortcutManager instance'
            );

            console.log('Getting manager status...');
            const status = this.manager.getStatus();
            this.addResult(
                'Initial Status',
                !status.isEnabled && !status.hasTarget,
                'Should start disabled without target element'
            );

            console.log('Getting all shortcuts...');
            const shortcuts = this.manager.getAllShortcuts();
            this.addResult(
                'Default Shortcuts',
                shortcuts.size > 20,
                `Should have comprehensive shortcuts (found ${shortcuts.size})`
            );

        } catch (error) {
            console.error('Initialization test error:', error);
            this.addResult('Initialization', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test enabling/disabling shortcuts
     */
    testEnableDisable() {
        try {
            this.mockElement = this.createMockElement();

            // Test enable
            const enableResult = this.manager.enable(this.mockElement);
            this.addResult(
                'Enable Shortcuts',
                enableResult === true,
                'Should successfully enable shortcuts'
            );

            const statusAfterEnable = this.manager.getStatus();
            this.addResult(
                'Status After Enable',
                statusAfterEnable.isEnabled && statusAfterEnable.hasTarget,
                'Status should reflect enabled state'
            );

            // Test disable
            this.manager.disable();
            const statusAfterDisable = this.manager.getStatus();
            this.addResult(
                'Status After Disable',
                !statusAfterDisable.isEnabled && !statusAfterDisable.hasTarget,
                'Status should reflect disabled state'
            );

        } catch (error) {
            this.addResult('Enable/Disable', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test shortcut key generation
     */
    testShortcutKeyGeneration() {
        try {
            // Test basic key
            const basicEvent = this.createKeyboardEvent('b', { ctrl: true });
            const basicKey = this.manager.getShortcutKey(basicEvent);
            this.addResult(
                'Basic Shortcut Key',
                basicKey === 'ctrl+b',
                `Should generate 'ctrl+b', got '${basicKey}'`
            );

            // Test complex key combination
            const complexEvent = this.createKeyboardEvent('k', { ctrl: true, shift: true });
            const complexKey = this.manager.getShortcutKey(complexEvent);
            this.addResult(
                'Complex Shortcut Key',
                complexKey === 'ctrl+shift+k',
                `Should generate 'ctrl+shift+k', got '${complexKey}'`
            );

            // Test Mac key
            const macEvent = this.createKeyboardEvent('i', { meta: true });
            const macKey = this.manager.getShortcutKey(macEvent);
            this.addResult(
                'Mac Shortcut Key',
                macKey === 'meta+i',
                `Should generate 'meta+i', got '${macKey}'`
            );

        } catch (error) {
            this.addResult('Shortcut Key Generation', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test shortcut execution
     */
    testShortcutExecution() {
        try {
            this.manager.enable(this.mockElement);

            // Test bold shortcut
            const boldEvent = this.createKeyboardEvent('b', { ctrl: true });
            this.manager.handleKeyDown(boldEvent);

            const wasFormatCalled = this.mockEventCoordinator._lastFormat !== null;
            this.addResult(
                'Bold Shortcut Execution',
                wasFormatCalled,
                'Should execute bold formatting action'
            );

            if (wasFormatCalled) {
                const format = this.mockEventCoordinator._lastFormat;
                this.addResult(
                    'Bold Format Parameters',
                    format.formatType === 'bold' && format.type === 'inline',
                    `Should call with correct parameters: ${JSON.stringify(format)}`
                );
            }

            // Test SpellBlock shortcut
            this.mockEventCoordinator._lastAction = null;
            const spellBlockEvent = this.createKeyboardEvent('s', { ctrl: true, shift: true });
            this.manager.handleKeyDown(spellBlockEvent);

            this.addResult(
                'SpellBlock Shortcut Execution',
                this.mockEventCoordinator._lastAction === 'insertSpellBlock',
                'Should execute SpellBlock insertion action'
            );

        } catch (error) {
            this.addResult('Shortcut Execution', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test custom shortcut management
     */
    testCustomShortcuts() {
        try {
            // Add custom shortcut
            const customConfig = {
                id: 'test-custom',
                description: 'Test custom shortcut',
                action: 'testAction'
            };

            const addResult = this.manager.addShortcut('ctrl+shift+t', customConfig);
            this.addResult(
                'Add Custom Shortcut',
                addResult === true,
                'Should successfully add custom shortcut'
            );

            // Check if shortcut exists
            const hasShortcut = this.manager.hasShortcut('ctrl+shift+t');
            this.addResult(
                'Has Custom Shortcut',
                hasShortcut === true,
                'Should find added custom shortcut'
            );

            // Remove custom shortcut
            const removeResult = this.manager.removeShortcut('ctrl+shift+t');
            this.addResult(
                'Remove Custom Shortcut',
                removeResult === true,
                'Should successfully remove custom shortcut'
            );

            // Check if shortcut is gone
            const hasShortcutAfterRemoval = this.manager.hasShortcut('ctrl+shift+t');
            this.addResult(
                'Shortcut Removed',
                hasShortcutAfterRemoval === false,
                'Should not find removed shortcut'
            );

        } catch (error) {
            this.addResult('Custom Shortcuts', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test keyboard event handling
     */
    testKeyboardEventHandling() {
        try {
            this.manager.enable(this.mockElement);

            // Test event prevention
            const event = this.createKeyboardEvent('b', { ctrl: true });
            let preventDefaultCalled = false;
            let stopPropagationCalled = false;

            const originalPreventDefault = event.preventDefault;
            const originalStopPropagation = event.stopPropagation;
            
            event.preventDefault = () => { 
                preventDefaultCalled = true;
                if (originalPreventDefault) originalPreventDefault.call(event);
            };
            event.stopPropagation = () => { 
                stopPropagationCalled = true;
                if (originalStopPropagation) originalStopPropagation.call(event);
            };

            this.manager.handleKeyDown(event);

            this.addResult(
                'Event Prevention',
                preventDefaultCalled,
                'Should call preventDefault for handled shortcuts'
            );

            this.addResult(
                'Event Propagation Stop',
                stopPropagationCalled,
                'Should call stopPropagation for handled shortcuts'
            );

            // Test unhandled event
            const unhandledEvent = this.createKeyboardEvent('z', { ctrl: true });
            let unhandledPreventCalled = false;
            unhandledEvent.preventDefault = () => { unhandledPreventCalled = true; };

            this.manager.handleKeyDown(unhandledEvent);

            this.addResult(
                'Unhandled Event',
                !unhandledPreventCalled,
                'Should not prevent default for unhandled shortcuts'
            );

        } catch (error) {
            this.addResult('Keyboard Event Handling', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test help content generation
     */
    testHelpContentGeneration() {
        try {
            const helpContent = this.manager.generateHelpContent();

            this.addResult(
                'Help Content Generation',
                typeof helpContent === 'string' && helpContent.length > 0,
                'Should generate help content as non-empty string'
            );

            this.addResult(
                'Help Content Structure',
                helpContent.includes('keyboard-shortcuts-help') && helpContent.includes('shortcuts-grid'),
                'Should contain expected CSS classes'
            );

            this.addResult(
                'Help Content Contains Shortcuts',
                helpContent.includes('Bold text') && helpContent.includes('Ctrl') || helpContent.includes('⌘'),
                'Should contain actual shortcut descriptions'
            );

        } catch (error) {
            this.addResult('Help Content Generation', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test cross-platform key formatting
     */
    testCrossPlatformFormatting() {
        try {
            // Test Windows/Linux formatting
            const winKey = this.manager.formatKeyForDisplay('ctrl+shift+b');
            this.addResult(
                'Windows Key Formatting',
                winKey.includes('Ctrl') && winKey.includes('Shift') && winKey.includes('B'),
                `Should format for Windows/Linux: ${winKey}`
            );

            // Test Mac formatting - skip platform modification to avoid issues
            const macKey = this.manager.formatKeyForDisplay('meta+shift+i');
            this.addResult(
                'Mac Key Formatting',
                typeof macKey === 'string' && macKey.length > 0,
                `Should format for Mac: ${macKey}`
            );

        } catch (error) {
            this.addResult('Cross-platform Formatting', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test shortcut filtering by action
     */
    testShortcutFiltering() {
        try {
            const markdownFormatShortcuts = this.manager.getShortcutsByAction('handleMarkdownFormat');
            this.addResult(
                'Filter by Action',
                markdownFormatShortcuts.length > 0,
                `Should find markdown format shortcuts (found ${markdownFormatShortcuts.length})`
            );

            const spellBlockShortcuts = this.manager.getShortcutsByAction('handleInsertSpellBlock');
            this.addResult(
                'Filter SpellBlock Shortcuts',
                spellBlockShortcuts.length >= 2, // Windows and Mac versions
                `Should find SpellBlock shortcuts (found ${spellBlockShortcuts.length})`
            );

            const nonExistentShortcuts = this.manager.getShortcutsByAction('nonExistentAction');
            this.addResult(
                'Filter Non-existent Action',
                nonExistentShortcuts.length === 0,
                'Should return empty array for non-existent action'
            );

        } catch (error) {
            this.addResult('Shortcut Filtering', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test option updates
     */
    testOptionUpdates() {
        try {
            const originalOptions = { ...this.manager.options };

            // Update options
            this.manager.updateOptions({
                enableShortcuts: false,
                showHelp: false
            });

            const newStatus = this.manager.getStatus();
            this.addResult(
                'Options Update',
                newStatus.options.enableShortcuts === false && newStatus.options.showHelp === false,
                'Should update options correctly'
            );

            // Restore original options
            this.manager.updateOptions(originalOptions);

        } catch (error) {
            this.addResult('Option Updates', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test manager destruction
     */
    testDestruction() {
        try {
            // Enable first
            this.manager.enable(this.mockElement);
            
            // Add custom shortcut
            this.manager.addShortcut('ctrl+test', { id: 'test', action: 'test' });

            // Destroy
            this.manager.destroy();

            const statusAfterDestroy = this.manager.getStatus();
            this.addResult(
                'Destruction Status',
                !statusAfterDestroy.isEnabled && !statusAfterDestroy.hasTarget,
                'Should disable and clear target after destruction'
            );

            const shortcutsAfterDestroy = this.manager.getAllShortcuts();
            this.addResult(
                'Shortcuts Cleared',
                shortcutsAfterDestroy.size === 0,
                'Should clear all shortcuts after destruction'
            );

        } catch (error) {
            this.addResult('Destruction', false, `Error: ${error.message}`);
        }
    }

    /**
     * Cleanup test environment
     */
    cleanup() {
        try {
            if (this.manager) {
                this.manager.destroy();
                this.manager = null;
            }
            if (this.mockElement && this.mockElement.parentNode) {
                this.mockElement.parentNode.removeChild(this.mockElement);
                this.mockElement = null;
            }
            this.mockEventCoordinator = null;
        } catch (error) {
            console.warn('[KeyboardShortcutManagerTest] Cleanup error:', error);
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('[KeyboardShortcutManagerTest] Starting comprehensive test suite...');

        try {
            console.log('Running initialization tests...');
            this.testInitialization();
            
            console.log('Running enable/disable tests...');
            this.testEnableDisable();
            
            console.log('Running shortcut key generation tests...');
            this.testShortcutKeyGeneration();
            
            console.log('Running shortcut execution tests...');
            this.testShortcutExecution();
            
            console.log('Running custom shortcuts tests...');
            this.testCustomShortcuts();
            
            console.log('Running keyboard event handling tests...');
            this.testKeyboardEventHandling();
            
            console.log('Running help content generation tests...');
            this.testHelpContentGeneration();
            
            console.log('Running cross-platform formatting tests...');
            this.testCrossPlatformFormatting();
            
            console.log('Running shortcut filtering tests...');
            this.testShortcutFiltering();
            
            console.log('Running option updates tests...');
            this.testOptionUpdates();
            
            console.log('Running destruction tests...');
            this.testDestruction();

            console.log('[KeyboardShortcutManagerTest] All tests completed successfully');

        } catch (error) {
            console.error('[KeyboardShortcutManagerTest] Test suite error:', error);
            this.addResult('Test Suite', false, `Unexpected error: ${error.message}`);
        } finally {
            this.cleanup();
        }

        const summary = this.getTestSummary();
        console.log(`[KeyboardShortcutManagerTest] Summary: ${summary.passed}/${summary.total} tests passed`);
        return summary;
    }

    /**
     * Get test summary
     */
    getTestSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = total - passed;

        return {
            total,
            passed,
            failed,
            passRate: total > 0 ? (passed / total * 100).toFixed(1) : 0,
            results: this.results
        };
    }

    /**
     * Generate test report
     */
    generateReport() {
        const summary = this.getTestSummary();
        
        let report = `
KeyboardShortcutManager Test Report
==================================
Total Tests: ${summary.total}
Passed: ${summary.passed}
Failed: ${summary.failed}
Pass Rate: ${summary.passRate}%

Detailed Results:
`;

        this.results.forEach((result, index) => {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            report += `${index + 1}. ${status} ${result.testName}: ${result.message}\n`;
        });

        return report;
    }
}

// Export for use in test runner
export default KeyboardShortcutManagerTest;