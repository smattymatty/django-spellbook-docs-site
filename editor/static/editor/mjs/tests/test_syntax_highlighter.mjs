// tests/test_syntax_highlighter.mjs

import SyntaxHighlighter from '../editor/SyntaxHighlighter.mjs';
import EditorConfig from '../editor/EditorConfig.mjs';
import EditorLogger from '../utils/EditorLogger.mjs';

/**
 * Test suite for SyntaxHighlighter
 */
class SyntaxHighlighterTests {
    constructor() {
        this.testResults = [];
        this.setupTestEnvironment();
    }
    
    /**
     * Set up test environment with mock DOM elements
     */
    setupTestEnvironment() {
        // Create mock textarea element
        this.mockTextarea = document.createElement('textarea');
        this.mockTextarea.id = 'test-editor';
        this.mockTextarea.style.position = 'absolute';
        this.mockTextarea.style.top = '-9999px';
        this.mockTextarea.style.left = '-9999px';
        this.mockTextarea.style.width = '300px';
        this.mockTextarea.style.height = '200px';
        
        // Create mock parent container
        this.mockContainer = document.createElement('div');
        this.mockContainer.style.position = 'relative';
        this.mockContainer.appendChild(this.mockTextarea);
        
        // Add to document
        document.body.appendChild(this.mockContainer);
        
        // Create test config
        this.testConfig = EditorConfig.createForTesting().get('syntaxHighlighting');
        this.testLogger = new EditorLogger({ enabled: false });
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
        console.log(`Running test: ${testName}`);
        
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
     * Test basic initialization
     */
    async testInitialization() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        
        // Test initial state
        if (highlighter.isInitialized) {
            throw new Error('Highlighter should not be initialized before calling initialize()');
        }
        
        if (highlighter.isDestroyed) {
            throw new Error('Highlighter should not be destroyed initially');
        }
        
        // Test initialization
        const success = await highlighter.initialize();
        if (!success) {
            throw new Error('Initialization should return true');
        }
        
        if (!highlighter.isInitialized) {
            throw new Error('Highlighter should be initialized after calling initialize()');
        }
        
        // Test status
        const status = highlighter.getStatus();
        if (!status.isInitialized) {
            throw new Error('Status should show initialized');
        }
        
        if (!status.hasHighlightContainer) {
            throw new Error('Status should show highlight container exists');
        }
        
        // Cleanup
        highlighter.cleanup();
    }
    
    /**
     * Test highlight overlay creation
     */
    async testOverlayCreation() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        // Check if overlay elements exist
        const container = this.mockContainer.querySelector('.syntax-highlight-container');
        if (!container) {
            throw new Error('Highlight container should be created');
        }
        
        const layer = container.querySelector('.syntax-highlight-layer');
        if (!layer) {
            throw new Error('Highlight layer should be created');
        }
        
        // Check positioning
        const containerStyle = getComputedStyle(container);
        if (containerStyle.position !== 'absolute') {
            throw new Error('Container should be positioned absolutely');
        }
        
        if (containerStyle.pointerEvents !== 'none') {
            throw new Error('Container should have pointer-events: none');
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Test SpellBlock syntax highlighting
     */
    async testSpellBlockHighlighting() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        // Test content with SpellBlock syntax
        const testContent = `This is normal text.

{~ alert type="warning" ~}
This is inside a SpellBlock.
{~~}

More normal text here.

{~ card title="Test Card" style="bordered" ~}
Card content here.
{~~}`;
        
        this.mockTextarea.value = testContent;
        
        // Trigger highlighting
        highlighter.updateHighlighting();
        
        // Wait for debounced update
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        const highlightedHtml = layer.innerHTML;
        
        // Check if SpellBlock syntax is highlighted
        if (!highlightedHtml.includes('spellblock-syntax-open')) {
            throw new Error('Opening SpellBlock syntax should be highlighted');
        }
        
        if (!highlightedHtml.includes('spellblock-syntax-close')) {
            throw new Error('Closing SpellBlock syntax should be highlighted');
        }
        
        if (!highlightedHtml.includes('spellblock-name')) {
            throw new Error('SpellBlock names should be highlighted');
        }
        
        if (!highlightedHtml.includes('spellblock-params')) {
            throw new Error('SpellBlock parameters should be highlighted');
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Test HTML escaping
     */
    async testHtmlEscaping() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        // Test content with HTML characters
        const testContent = `{~ alert type="<script>alert('xss')</script>" ~}
Content with & characters and < > symbols.
{~~}`;
        
        this.mockTextarea.value = testContent;
        highlighter.updateHighlighting();
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        const highlightedHtml = layer.innerHTML;
        
        // Check that HTML is properly escaped
        if (highlightedHtml.includes('<script>')) {
            throw new Error('HTML should be escaped');
        }
        
        if (!highlightedHtml.includes('&lt;') || !highlightedHtml.includes('&gt;')) {
            throw new Error('Angle brackets should be escaped');
        }
        
        if (!highlightedHtml.includes('&amp;')) {
            throw new Error('Ampersands should be escaped');
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Test multiple SpellBlocks
     */
    async testMultipleSpellBlocks() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        const testContent = `{~ alert ~}First{~~}

{~ card title="Test" ~}Second{~~}

{~ quote author="Someone" ~}Third{~~}`;
        
        this.mockTextarea.value = testContent;
        highlighter.updateHighlighting();
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        const highlightedHtml = layer.innerHTML;
        
        // Count occurrences of highlighting classes
        const openMatches = (highlightedHtml.match(/spellblock-syntax-open/g) || []).length;
        const closeMatches = (highlightedHtml.match(/spellblock-syntax-close/g) || []).length;
        const nameMatches = (highlightedHtml.match(/spellblock-name/g) || []).length;
        
        if (openMatches !== 3) {
            throw new Error(`Expected 3 opening tags, found ${openMatches}`);
        }
        
        if (closeMatches !== 6) { // 3 opening closes + 3 closing tags
            throw new Error(`Expected 6 closing elements, found ${closeMatches}`);
        }
        
        if (nameMatches !== 3) {
            throw new Error(`Expected 3 SpellBlock names, found ${nameMatches}`);
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Test real-time updates
     */
    async testRealTimeUpdates() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        // Start with empty content
        this.mockTextarea.value = '';
        highlighter.updateHighlighting();
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        let layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        if (layer.innerHTML.includes('spellblock-')) {
            throw new Error('Empty content should not have highlighting');
        }
        
        // Add SpellBlock content
        this.mockTextarea.value = '{~ alert ~}Test{~~}';
        this.mockTextarea.dispatchEvent(new Event('input'));
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        if (!layer.innerHTML.includes('spellblock-syntax-open')) {
            throw new Error('Adding SpellBlock should trigger highlighting');
        }
        
        // Clear content
        this.mockTextarea.value = '';
        this.mockTextarea.dispatchEvent(new Event('input'));
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        layer = this.mockContainer.querySelector('.syntax-highlight-layer');
        if (layer.innerHTML.includes('spellblock-')) {
            throw new Error('Clearing content should remove highlighting');
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Test cleanup
     */
    async testCleanup() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        // Verify elements exist before cleanup
        let container = this.mockContainer.querySelector('.syntax-highlight-container');
        if (!container) {
            throw new Error('Container should exist before cleanup');
        }
        
        // Perform cleanup
        highlighter.cleanup();
        
        // Verify cleanup
        if (!highlighter.isDestroyed) {
            throw new Error('Highlighter should be marked as destroyed');
        }
        
        if (highlighter.isInitialized) {
            throw new Error('Highlighter should not be marked as initialized after cleanup');
        }
        
        container = this.mockContainer.querySelector('.syntax-highlight-container');
        if (container) {
            throw new Error('Container should be removed after cleanup');
        }
        
        const status = highlighter.getStatus();
        if (status.hasHighlightContainer) {
            throw new Error('Status should show no highlight container after cleanup');
        }
    }
    
    /**
     * Test configuration updates
     */
    async testConfigurationUpdates() {
        const highlighter = new SyntaxHighlighter(this.testConfig, this.testLogger, this.mockTextarea);
        await highlighter.initialize();
        
        const originalDelay = highlighter.debounceDelay;
        
        // Update configuration
        highlighter.updateConfig({
            syntaxHighlighting: {
                debounceDelay: 200
            }
        });
        
        if (highlighter.debounceDelay === originalDelay) {
            throw new Error('Debounce delay should be updated');
        }
        
        if (highlighter.debounceDelay !== 200) {
            throw new Error('Debounce delay should be set to 200');
        }
        
        highlighter.cleanup();
    }
    
    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('Starting SyntaxHighlighter Tests...');
        
        await this.runTest('Initialization', () => this.testInitialization());
        await this.runTest('Overlay Creation', () => this.testOverlayCreation());
        await this.runTest('SpellBlock Highlighting', () => this.testSpellBlockHighlighting());
        await this.runTest('HTML Escaping', () => this.testHtmlEscaping());
        await this.runTest('Multiple SpellBlocks', () => this.testMultipleSpellBlocks());
        await this.runTest('Real-time Updates', () => this.testRealTimeUpdates());
        await this.runTest('Cleanup', () => this.testCleanup());
        await this.runTest('Configuration Updates', () => this.testConfigurationUpdates());
        
        this.cleanupTestEnvironment();
        this.printResults();
    }
    
    /**
     * Print test results
     */
    printResults() {
        console.log('\n=== SyntaxHighlighter Test Results ===');
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log(`Total Tests: ${this.testResults.length}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        
        if (failed > 0) {
            console.log('\nFailed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`  ✗ ${r.name}: ${r.error}`));
        }
        
        console.log(`\nSuccess Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    }
}

// Export for use in test runner
export default SyntaxHighlighterTests;

// Auto-run if loaded directly
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        const tests = new SyntaxHighlighterTests();
        await tests.runAllTests();
    });
}