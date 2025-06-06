// editor/static/mjs/tests/EditorManager.test.mjs

import EditorManager from '../editor/EditorManager.mjs';

/**
 * Basic test suite for EditorManager
 * Uses simple assertion-based testing without external dependencies
 */

class EditorManagerTests {
    constructor() {
        this.testResults = [];
        this.setupDOM();
    }

    /**
     * Set up DOM elements for testing
     */
    setupDOM() {
        // Create test container
        const testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        
        // Create editor textarea
        const editor = document.createElement('textarea');
        editor.id = 'test-markdown-input';
        editor.value = 'Test content';
        
        // Create preview div
        const preview = document.createElement('div');
        preview.id = 'test-live-preview-area';
        
        testContainer.appendChild(editor);
        testContainer.appendChild(preview);
        document.body.appendChild(testContainer);
    }

    /**
     * Clean up DOM after tests
     */
    teardownDOM() {
        const testContainer = document.getElementById('test-container');
        if (testContainer) {
            testContainer.remove();
        }
    }

    /**
     * Assert utility
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    /**
     * Async test runner utility
     */
    async runTest(testName, testFunction) {
        try {
            console.log(`Running test: ${testName}`);
            await testFunction();
            this.testResults.push({ name: testName, status: 'PASS' });
            console.log(`✅ ${testName}: PASS`);
        } catch (error) {
            this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
            console.error(`❌ ${testName}: FAIL - ${error.message}`);
        }
    }

    /**
     * Test EditorManager construction
     */
    async testConstruction() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = new EditorManager('test-markdown-input', config);
        
        this.assert(manager !== null, 'EditorManager should be created');
        this.assert(manager.editorId === 'test-markdown-input', 'Editor ID should be set correctly');
        this.assert(!manager.isInitialized, 'Should not be initialized yet');
        this.assert(!manager.isDestroyed, 'Should not be destroyed');
    }

    /**
     * Test EditorManager initialization
     */
    async testInitialization() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = new EditorManager('test-markdown-input', config);
        const success = await manager.initialize();
        
        this.assert(success, 'Initialization should succeed');
        this.assert(manager.isInitialized, 'Should be marked as initialized');
        this.assert(manager.getEditorElement() !== null, 'Should find editor element');
        this.assert(manager.getPreviewElement() !== null, 'Should find preview element');
        
        // Cleanup
        manager.cleanup();
    }

    /**
     * Test configuration validation
     */
    async testConfigurationValidation() {
        // Test with invalid configuration
        try {
            const invalidConfig = {
                selectors: {
                    editor: '', // Invalid empty selector
                    preview: 'test-live-preview-area'
                }
            };
            
            new EditorManager('test-markdown-input', invalidConfig);
            this.assert(false, 'Should throw error for invalid config');
        } catch (error) {
            this.assert(error.message.includes('Invalid configuration'), 'Should throw configuration error');
        }
    }

    /**
     * Test element validation
     */
    async testElementValidation() {
        const config = {
            selectors: {
                editor: 'non-existent-element',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = new EditorManager('non-existent-element', config);
        const success = await manager.initialize();
        
        this.assert(!success, 'Initialization should fail with missing element');
        
        manager.cleanup();
    }

    /**
     * Test focus and blur handling
     */
    async testFocusBlurHandling() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            },
            buttonBar: {
                enabled: false // Disable for simpler testing
            }
        };

        const manager = new EditorManager('test-markdown-input', config);
        await manager.initialize();
        
        const editorElement = manager.getEditorElement();
        const previewElement = manager.getPreviewElement();
        
        // Simulate focus
        editorElement.focus();
        editorElement.dispatchEvent(new Event('focus'));
        
        // Check if focused styles are applied
        this.assert(
            editorElement.classList.contains('editor-pane-focused'),
            'Editor should have focused class'
        );
        
        if (previewElement) {
            this.assert(
                previewElement.classList.contains('preview-pane-squashed'),
                'Preview should have squashed class'
            );
        }
        
        // Simulate blur
        editorElement.blur();
        editorElement.dispatchEvent(new Event('blur'));
        
        // Check if focused styles are removed
        this.assert(
            !editorElement.classList.contains('editor-pane-focused'),
            'Editor should not have focused class after blur'
        );
        
        if (previewElement) {
            this.assert(
                !previewElement.classList.contains('preview-pane-squashed'),
                'Preview should not have squashed class after blur'
            );
        }
        
        manager.cleanup();
    }

    /**
     * Test cleanup functionality
     */
    async testCleanup() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = new EditorManager('test-markdown-input', config);
        await manager.initialize();
        
        this.assert(manager.isReady(), 'Manager should be ready');
        
        manager.cleanup();
        
        this.assert(manager.isDestroyed, 'Should be marked as destroyed');
        this.assert(!manager.isInitialized, 'Should not be marked as initialized');
        this.assert(!manager.isReady(), 'Should not be ready after cleanup');
    }

    /**
     * Test status reporting
     */
    async testStatusReporting() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = new EditorManager('test-markdown-input', config);
        await manager.initialize();
        
        const status = manager.getStatus();
        
        this.assert(typeof status === 'object', 'Status should be an object');
        this.assert(status.isInitialized === true, 'Status should show initialized');
        this.assert(status.elements.hasEditor === true, 'Status should show editor element');
        this.assert(typeof status.components === 'object', 'Status should include components');
        
        manager.cleanup();
    }

    /**
     * Test factory method
     */
    async testFactoryMethod() {
        const config = {
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            logging: {
                enabled: false
            }
        };

        const manager = await EditorManager.create('test-markdown-input', config);
        
        this.assert(manager.isReady(), 'Factory-created manager should be ready');
        
        manager.cleanup();
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting EditorManager Tests...');
        
        await this.runTest('Construction', () => this.testConstruction());
        await this.runTest('Initialization', () => this.testInitialization());
        await this.runTest('Configuration Validation', () => this.testConfigurationValidation());
        await this.runTest('Element Validation', () => this.testElementValidation());
        await this.runTest('Focus/Blur Handling', () => this.testFocusBlurHandling());
        await this.runTest('Cleanup', () => this.testCleanup());
        await this.runTest('Status Reporting', () => this.testStatusReporting());
        await this.runTest('Factory Method', () => this.testFactoryMethod());
        
        // Clean up test DOM
        this.teardownDOM();
        
        // Report results
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
        
        if (failed > 0) {
            console.log('\n❌ Failed tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
        }
        
        return { passed, failed, total: this.testResults.length };
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (window.location.search.includes('test=editor')) {
            const tests = new EditorManagerTests();
            await tests.runAllTests();
        }
    });
}

export default EditorManagerTests;