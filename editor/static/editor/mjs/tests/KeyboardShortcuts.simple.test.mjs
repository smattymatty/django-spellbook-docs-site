// static/mjs/tests/KeyboardShortcuts.simple.test.mjs

import { KeyboardShortcutManager } from '../button_bar/KeyboardShortcutManager.mjs';

/**
 * Simple test suite for KeyboardShortcutManager that won't hang
 */
export class SimpleKeyboardShortcutTest {
    constructor() {
        this.results = [];
        this.testCount = 0;
    }

    /**
     * Add test result
     */
    addResult(testName, passed, message) {
        this.testCount++;
        this.results.push({
            testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        // Log each test result immediately
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`Test ${this.testCount}: ${status} ${testName} - ${message}`);
    }

    /**
     * Create minimal mock event coordinator
     */
    createMockEventCoordinator() {
        return {
            handleMarkdownFormat: function(formatType, type) {
                console.log(`Mock handleMarkdownFormat called: ${formatType}, ${type}`);
            },
            handleInsertSpellBlock: function() {
                console.log('Mock handleInsertSpellBlock called');
            },
            hasCustomAction: function() { 
                return false; 
            },
            executeActionByName: function() {
                console.log('Mock executeActionByName called');
            },
            renderer: {
                getButtonElement: function() {
                    return document.createElement('button');
                }
            },
            notificationService: {
                info: function(message) {
                    console.log(`Mock notification: ${message}`);
                }
            }
        };
    }

    /**
     * Test 1: Basic initialization
     */
    testBasicInitialization() {
        try {
            console.log('Creating mock event coordinator...');
            const mockEventCoordinator = this.createMockEventCoordinator();
            
            console.log('Creating KeyboardShortcutManager...');
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            console.log('Testing instance creation...');
            this.addResult(
                'Basic Initialization',
                manager instanceof KeyboardShortcutManager,
                'Should create KeyboardShortcutManager instance'
            );
            
            console.log('Testing initial state...');
            const status = manager.getStatus();
            this.addResult(
                'Initial State',
                typeof status === 'object' && !status.isEnabled,
                'Should have correct initial state'
            );
            
            console.log('Cleaning up manager...');
            manager.destroy();
            
        } catch (error) {
            console.error('Basic initialization test error:', error);
            this.addResult('Basic Initialization', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test 2: Shortcut map creation
     */
    testShortcutMapCreation() {
        try {
            const mockEventCoordinator = this.createMockEventCoordinator();
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            const shortcuts = manager.getAllShortcuts();
            
            this.addResult(
                'Shortcut Map Creation',
                shortcuts instanceof Map && shortcuts.size > 0,
                `Should create shortcut map with ${shortcuts.size} shortcuts`
            );
            
            // Test specific shortcuts
            const hasBoldShortcut = shortcuts.has('ctrl+b');
            this.addResult(
                'Bold Shortcut Exists',
                hasBoldShortcut,
                'Should have bold shortcut (ctrl+b)'
            );
            
            const hasItalicShortcut = shortcuts.has('ctrl+i');
            this.addResult(
                'Italic Shortcut Exists',
                hasItalicShortcut,
                'Should have italic shortcut (ctrl+i)'
            );
            
            manager.destroy();
            
        } catch (error) {
            console.error('Shortcut map creation test error:', error);
            this.addResult('Shortcut Map Creation', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test 3: Enable/disable functionality
     */
    testEnableDisable() {
        try {
            const mockEventCoordinator = this.createMockEventCoordinator();
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            // Create test element
            const testElement = document.createElement('textarea');
            testElement.id = 'test-textarea';
            document.body.appendChild(testElement);
            
            // Test enable
            const enableResult = manager.enable(testElement);
            this.addResult(
                'Enable Shortcuts',
                enableResult === true,
                'Should successfully enable shortcuts'
            );
            
            const statusAfterEnable = manager.getStatus();
            this.addResult(
                'Status After Enable',
                statusAfterEnable.isEnabled && statusAfterEnable.hasTarget,
                'Should show enabled status'
            );
            
            // Test disable
            manager.disable();
            const statusAfterDisable = manager.getStatus();
            this.addResult(
                'Status After Disable',
                !statusAfterDisable.isEnabled && !statusAfterDisable.hasTarget,
                'Should show disabled status'
            );
            
            // Cleanup
            document.body.removeChild(testElement);
            manager.destroy();
            
        } catch (error) {
            console.error('Enable/disable test error:', error);
            this.addResult('Enable/Disable', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test 4: Key combination generation
     */
    testKeyGeneration() {
        try {
            const mockEventCoordinator = this.createMockEventCoordinator();
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            // Create mock keyboard events
            const boldEvent = new KeyboardEvent('keydown', {
                key: 'b',
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            
            const shiftEvent = new KeyboardEvent('keydown', {
                key: 'c',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            
            // Test key generation
            const boldKey = manager.getShortcutKey(boldEvent);
            this.addResult(
                'Bold Key Generation',
                boldKey === 'ctrl+b',
                `Should generate 'ctrl+b', got '${boldKey}'`
            );
            
            const shiftKey = manager.getShortcutKey(shiftEvent);
            this.addResult(
                'Shift Key Generation',
                shiftKey === 'ctrl+shift+c',
                `Should generate 'ctrl+shift+c', got '${shiftKey}'`
            );
            
            manager.destroy();
            
        } catch (error) {
            console.error('Key generation test error:', error);
            this.addResult('Key Generation', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test 5: Custom shortcut management
     */
    testCustomShortcuts() {
        try {
            const mockEventCoordinator = this.createMockEventCoordinator();
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            // Add custom shortcut
            const addResult = manager.addShortcut('ctrl+shift+t', {
                id: 'test-shortcut',
                description: 'Test shortcut',
                action: 'testAction'
            });
            
            this.addResult(
                'Add Custom Shortcut',
                addResult === true,
                'Should successfully add custom shortcut'
            );
            
            // Check if shortcut exists
            const hasShortcut = manager.hasShortcut('ctrl+shift+t');
            this.addResult(
                'Has Custom Shortcut',
                hasShortcut === true,
                'Should find added custom shortcut'
            );
            
            // Remove shortcut
            const removeResult = manager.removeShortcut('ctrl+shift+t');
            this.addResult(
                'Remove Custom Shortcut',
                removeResult === true,
                'Should successfully remove custom shortcut'
            );
            
            // Check if shortcut is gone
            const hasShortcutAfterRemoval = manager.hasShortcut('ctrl+shift+t');
            this.addResult(
                'Shortcut Removed',
                hasShortcutAfterRemoval === false,
                'Should not find removed shortcut'
            );
            
            manager.destroy();
            
        } catch (error) {
            console.error('Custom shortcuts test error:', error);
            this.addResult('Custom Shortcuts', false, `Error: ${error.message}`);
        }
    }

    /**
     * Test 6: Help content generation
     */
    testHelpContent() {
        try {
            const mockEventCoordinator = this.createMockEventCoordinator();
            const manager = new KeyboardShortcutManager(mockEventCoordinator);
            
            const helpContent = manager.generateHelpContent();
            
            this.addResult(
                'Help Content Generation',
                typeof helpContent === 'string' && helpContent.length > 0,
                'Should generate non-empty help content'
            );
            
            this.addResult(
                'Help Content Structure',
                helpContent.includes('keyboard-shortcuts-help'),
                'Should contain expected CSS classes'
            );
            
            manager.destroy();
            
        } catch (error) {
            console.error('Help content test error:', error);
            this.addResult('Help Content', false, `Error: ${error.message}`);
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('[SimpleKeyboardShortcutTest] Starting simple test suite...');
        
        try {
            console.log('\n--- Test 1: Basic Initialization ---');
            this.testBasicInitialization();
            
            console.log('\n--- Test 2: Shortcut Map Creation ---');
            this.testShortcutMapCreation();
            
            console.log('\n--- Test 3: Enable/Disable ---');
            this.testEnableDisable();
            
            console.log('\n--- Test 4: Key Generation ---');
            this.testKeyGeneration();
            
            console.log('\n--- Test 5: Custom Shortcuts ---');
            this.testCustomShortcuts();
            
            console.log('\n--- Test 6: Help Content ---');
            this.testHelpContent();
            
            console.log('\n[SimpleKeyboardShortcutTest] All tests completed');
            
        } catch (error) {
            console.error('[SimpleKeyboardShortcutTest] Test suite error:', error);
            this.addResult('Test Suite', false, `Unexpected error: ${error.message}`);
        }

        return this.getTestSummary();
    }

    /**
     * Get test summary
     */
    getTestSummary() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        const failed = total - passed;

        const summary = {
            total,
            passed,
            failed,
            passRate: total > 0 ? (passed / total * 100).toFixed(1) : 0,
            results: this.results
        };
        
        console.log(`\n[SimpleKeyboardShortcutTest] Test Summary:`);
        console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}, Pass Rate: ${summary.passRate}%`);
        
        return summary;
    }
}

// Export for use in test runner
export default SimpleKeyboardShortcutTest;