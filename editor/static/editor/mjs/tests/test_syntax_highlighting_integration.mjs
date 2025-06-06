// tests/test_syntax_highlighting_integration.mjs

import EditorManager from '../editor/EditorManager.mjs';
import EditorConfig from '../editor/EditorConfig.mjs';

/**
 * Integration test suite for syntax highlighting with EditorManager
 */
class SyntaxHighlightingIntegrationTests {
    constructor() {
        this.testResults = [];
        this.setupTestEnvironment();
    }

    /**
     * Set up test environment with mock DOM elements
     */
    setupTestEnvironment() {
        // Create mock editor textarea
        this.mockEditor = document.createElement('textarea');
        this.mockEditor.id = 'test-markdown-input';
        this.mockEditor.style.position = 'absolute';
        this.mockEditor.style.top = '-9999px';
        this.mockEditor.style.left = '-9999px';
        this.mockEditor.style.width = '600px';
        this.mockEditor.style.height = '400px';
        this.mockEditor.style.padding = '12px';
        this.mockEditor.style.fontFamily = 'monospace';
        this.mockEditor.style.fontSize = '14px';
        this.mockEditor.style.lineHeight = '1.5';

        // Create mock preview area
        this.mockPreview = document.createElement('div');
        this.mockPreview.id = 'test-live-preview-area';
        this.mockPreview.style.position = 'absolute';
        this.mockPreview.style.top = '-9999px';
        this.mockPreview.style.left = '-9999px';
        this.mockPreview.style.width = '600px';
        this.mockPreview.style.height = '400px';

        // Create container
        this.mockContainer = document.createElement('div');
        this.mockContainer.style.position = 'relative';
        this.mockContainer.appendChild(this.mockEditor);
        this.mockContainer.appendChild(this.mockPreview);

        // Add to document
        document.body.appendChild(this.mockContainer);

        console.log('Test environment set up');
    }

    /**
     * Clean up test environment
     */
    cleanupTestEnvironment() {
        if (this.mockContainer && this.mockContainer.parentNode) {
            this.mockContainer.parentNode.removeChild(this.mockContainer);
        }
    }

    /**
     * Run a single test
     */
    async runTest(testName, testFunction) {
        console.log(`Running integration test: ${testName}`);

        try {
            await testFunction();
            this.testResults.push({ name: testName, status: 'PASS', error: null });
            console.log(`✓ ${testName} PASSED`);
        } catch (error) {
            this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
            console.error(`✗ ${testName} FAILED:`, error.message);
        }
    }

    /**
     * Test EditorManager with syntax highlighting enabled
     */
    async testEditorManagerWithSyntaxHighlighting() {
        const config = EditorConfig.createDefault({
            selectors: {
                editor: 'test-markdown-input',
                preview: 'test-live-preview-area'
            },
            syntaxHighlighting: {
                enabled: true
