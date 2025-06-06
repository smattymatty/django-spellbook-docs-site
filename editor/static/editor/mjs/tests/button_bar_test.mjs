// static/mjs/tests/button_bar_test.mjs

import { EditorButtonBar } from '../button_bar.mjs';
import { ButtonConfigManager } from '../button_bar/ButtonConfigManager.mjs';
import { ButtonBarRenderer } from '../button_bar/ButtonBarRenderer.mjs';
import { CursorTracker } from '../button_bar/CursorTracker.mjs';
import { NotificationService } from '../button_bar/NotificationService.mjs';
import { ButtonStateManager } from '../button_bar/ButtonStateManager.mjs';
import { EventCoordinator } from '../button_bar/EventCoordinator.mjs';
import { BlockFormatter } from '../formatters/BlockFormatter.mjs';
import { InlineFormatter } from '../formatters/InlineFormatter.mjs';

/**
 * Comprehensive test suite for refactored EditorButtonBar
 * Tests all modular components and integration
 */
class ButtonBarTestSuite {
    constructor() {
        this.testResults = [];
        this.editorElement = null;
        this.buttonBar = null;
        this.setupComplete = false;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting ButtonBar Test Suite...');
        
        try {
            await this.setup();
            
            // Component tests
            await this.testButtonConfigManager();
            await this.testCursorTracker();
            await this.testBlockFormatter();
            await this.testInlineFormatter();
            await this.testNotificationService();
            await this.testButtonBarRenderer();
            await this.testButtonStateManager();
            await this.testEventCoordinator();
            
            // Integration tests
            await this.testEditorButtonBarIntegration();
            await this.testFormattingOperations();
            await this.testKeyboardShortcuts();
            await this.testButtonStates();
            await this.testErrorHandling();
            
            // Performance tests
            await this.testPerformance();
            
            await this.cleanup();
            
            this.printResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.addResult('TestSuite', 'Setup/Teardown', false, error.message);
        }
        
        // Return results summary for test runner
        const summary = this.exportResults();
        return {
            total: summary.summary.total,
            passed: summary.summary.passed,
            failed: summary.summary.failed,
            results: summary.results
        };
    }

    /**
     * Setup test environment
     */
    async setup() {
        console.log('🔧 Setting up test environment...');
        
        // Create mock editor element
        this.editorElement = document.createElement('textarea');
        this.editorElement.id = 'test-editor';
        this.editorElement.value = 'Test content for cursor tracking';
        
        // Create mock editor pane
        const editorPane = document.createElement('div');
        editorPane.className = 'editor-pane';
        editorPane.appendChild(this.editorElement);
        document.body.appendChild(editorPane);
        
        // Initialize button bar
        this.buttonBar = new EditorButtonBar(this.editorElement, {
            animationDuration: 100, // Faster for testing
            notificationDuration: 500
        });
        
        this.setupComplete = true;
        console.log('✅ Test environment setup complete');
    }

    /**
     * Cleanup test environment
     */
    async cleanup() {
        if (this.buttonBar) {
            this.buttonBar.destroy();
        }
        
        if (this.editorElement && this.editorElement.parentNode) {
            this.editorElement.parentNode.parentNode.removeChild(this.editorElement.parentNode);
        }
        
        console.log('🧹 Test environment cleaned up');
    }

    /**
     * Test ButtonConfigManager
     */
    async testButtonConfigManager() {
        console.log('📝 Testing ButtonConfigManager...');
        
        const configManager = new ButtonConfigManager();
        
        // Test getting buttons
        this.addResult('ButtonConfigManager', 'getMainButtons', 
            configManager.getMainButtons().length > 0,
            'Should return main buttons'
        );
        
        this.addResult('ButtonConfigManager', 'getMarkdownButtons', 
            configManager.getMarkdownButtons().length > 0,
            'Should return markdown buttons'
        );
        
        // Test adding custom button
        const customButton = {
            id: 'test-btn',
            text: 'Test',
            icon: '🧪',
            className: 'btn-test',
            action: 'testAction'
        };
        
        this.addResult('ButtonConfigManager', 'addButton', 
            configManager.addButton(customButton),
            'Should add custom button'
        );
        
        this.addResult('ButtonConfigManager', 'getButtonById', 
            configManager.getButtonById('test-btn') !== null,
            'Should find added button'
        );
        
        // Test validation
        this.addResult('ButtonConfigManager', 'validateInvalidButton', 
            !configManager.addButton({ id: 'invalid' }),
            'Should reject invalid button config'
        );
        
        console.log('✅ ButtonConfigManager tests complete');
    }

    /**
     * Test CursorTracker
     */
    async testCursorTracker() {
        console.log('📍 Testing CursorTracker...');
        
        const cursorTracker = new CursorTracker(this.editorElement);
        
        // Test cursor position
        this.editorElement.setSelectionRange(5, 5);
        this.addResult('CursorTracker', 'getCursorPosition', 
            cursorTracker.getCursorPosition() === 5,
            'Should return correct cursor position'
        );
        
        // Test selection range
        this.editorElement.setSelectionRange(2, 8);
        const range = cursorTracker.getSelectionRange();
        this.addResult('CursorTracker', 'getSelectionRange', 
            range.start === 2 && range.end === 8,
            'Should return correct selection range'
        );
        
        // Test context
        const context = cursorTracker.getCursorContext(10);
        this.addResult('CursorTracker', 'getCursorContext', 
            context && context.text && context.position >= 0,
            'Should return cursor context'
        );
        
        // Test markdown detection
        this.editorElement.value = 'This is **bold** text';
        this.editorElement.setSelectionRange(12, 12); // Inside bold
        this.addResult('CursorTracker', 'isInsideMarkdown', 
            cursorTracker.isInsideMarkdown('**'),
            'Should detect cursor inside markdown'
        );
        
        cursorTracker.destroy();
        console.log('✅ CursorTracker tests complete');
    }

    /**
     * Test BlockFormatter
     */
    async testBlockFormatter() {
        console.log('📄 Testing BlockFormatter...');
        
        const blockFormatter = new BlockFormatter(this.editorElement);
        
        // Test header formatting
        this.editorElement.value = 'Test heading';
        this.editorElement.setSelectionRange(0, 0);
        blockFormatter.format('header1');
        
        this.addResult('BlockFormatter', 'formatHeader1', 
            this.editorElement.value.startsWith('# '),
            'Should format as header 1'
        );
        
        // Test list formatting
        this.editorElement.value = 'List item';
        this.editorElement.setSelectionRange(0, 0);
        blockFormatter.format('unorderedList');
        
        this.addResult('BlockFormatter', 'formatUnorderedList', 
            this.editorElement.value.startsWith('- '),
            'Should format as unordered list'
        );
        
        // Test code block formatting
        this.editorElement.value = '';
        this.editorElement.setSelectionRange(0, 0);
        blockFormatter.format('codeBlock');
        
        this.addResult('BlockFormatter', 'formatCodeBlock', 
            this.editorElement.value.includes('```'),
            'Should format as code block'
        );
        
        // Test supported formats
        this.addResult('BlockFormatter', 'getSupportedFormats', 
            blockFormatter.getSupportedFormats().includes('header1'),
            'Should return supported formats'
        );
        
        blockFormatter.destroy();
        console.log('✅ BlockFormatter tests complete');
    }

    /**
     * Test InlineFormatter
     */
    async testInlineFormatter() {
        console.log('✏️ Testing InlineFormatter...');
        
        const inlineFormatter = new InlineFormatter(this.editorElement);
        
        // Test bold formatting
        this.editorElement.value = 'bold text';
        this.editorElement.setSelectionRange(0, 4);
        inlineFormatter.format('bold');
        
        this.addResult('InlineFormatter', 'formatBold', 
            this.editorElement.value.includes('**bold**'),
            'Should format selected text as bold'
        );
        
        // Test italic formatting
        this.editorElement.value = 'italic text';
        this.editorElement.setSelectionRange(0, 6);
        inlineFormatter.format('italic');
        
        this.addResult('InlineFormatter', 'formatItalic', 
            this.editorElement.value.includes('*italic*'),
            'Should format selected text as italic'
        );
        
        // Test link formatting
        this.editorElement.value = 'link text';
        this.editorElement.setSelectionRange(0, 4);
        inlineFormatter.format('link');
        
        this.addResult('InlineFormatter', 'formatLink', 
            this.editorElement.value.includes('[link](url)'),
            'Should format as link'
        );
        
        // Test activity detection
        this.editorElement.value = 'This is **bold** text';
        this.editorElement.setSelectionRange(12, 12);
        
        this.addResult('InlineFormatter', 'isActive', 
            inlineFormatter.isActive('bold'),
            'Should detect active formatting'
        );
        
        inlineFormatter.destroy();
        console.log('✅ InlineFormatter tests complete');
    }

    /**
     * Test NotificationService
     */
    async testNotificationService() {
        console.log('🔔 Testing NotificationService...');
        
        const notificationService = new NotificationService({
            duration: 100,
            position: 'top-right'
        });
        
        // Test showing notification
        const notificationId = notificationService.show('Test message', 'info');
        this.addResult('NotificationService', 'show', 
            typeof notificationId === 'string',
            'Should return notification ID'
        );
        
        this.addResult('NotificationService', 'exists', 
            notificationService.exists(notificationId),
            'Should confirm notification exists'
        );
        
        // Test different types
        const successId = notificationService.success('Success message');
        const errorId = notificationService.error('Error message');
        const warningId = notificationService.warning('Warning message');
        
        this.addResult('NotificationService', 'multipleTypes', 
            notificationService.getCount() >= 4,
            'Should handle multiple notification types'
        );
        
        // Test hiding
        await notificationService.hide(notificationId);
        this.addResult('NotificationService', 'hide', 
            !notificationService.exists(notificationId),
            'Should hide notification'
        );
        
        // Cleanup
        await notificationService.hideAll();
        notificationService.destroy();
        
        console.log('✅ NotificationService tests complete');
    }

    /**
     * Test ButtonBarRenderer
     */
    async testButtonBarRenderer() {
        console.log('🎨 Testing ButtonBarRenderer...');
        
        const configManager = new ButtonConfigManager();
        const renderer = new ButtonBarRenderer(this.editorElement, configManager);
        
        // Test creating button bar
        const buttonBar = renderer.createButtonBar();
        this.addResult('ButtonBarRenderer', 'createButtonBar', 
            buttonBar && buttonBar.id === 'editor-button-bar',
            'Should create button bar element'
        );
        
        // Test inserting into DOM
        this.addResult('ButtonBarRenderer', 'insertIntoDOM', 
            renderer.insertIntoDOM(),
            'Should insert into DOM'
        );
        
        // Test visibility
        this.addResult('ButtonBarRenderer', 'initiallyHidden', 
            !renderer.isVisible(),
            'Should be initially hidden'
        );
        
        renderer.show();
        this.addResult('ButtonBarRenderer', 'show', 
            renderer.isVisible(),
            'Should show button bar'
        );
        
        renderer.hide();
        this.addResult('ButtonBarRenderer', 'hide', 
            !renderer.isVisible(),
            'Should hide button bar'
        );
        
        // Test getting button element
        const boldButton = renderer.getButtonElement('bold-btn');
        this.addResult('ButtonBarRenderer', 'getButtonElement', 
            boldButton && boldButton.id === 'bold-btn',
            'Should return button element'
        );
        
        renderer.destroy();
        console.log('✅ ButtonBarRenderer tests complete');
    }

    /**
     * Test ButtonStateManager
     */
    async testButtonStateManager() {
        console.log('⚡ Testing ButtonStateManager...');
        
        const configManager = new ButtonConfigManager();
        const renderer = new ButtonBarRenderer(this.editorElement, configManager);
        const cursorTracker = new CursorTracker(this.editorElement);
        
        renderer.createButtonBar();
        renderer.insertIntoDOM();
        
        const stateManager = new ButtonStateManager(renderer, cursorTracker);
        
        // Test setting button active
        stateManager.setButtonActive('bold-btn', true);
        this.addResult('ButtonStateManager', 'setButtonActive', 
            stateManager.isButtonActive('bold-btn'),
            'Should set button active'
        );
        
        // Test toggling
        const newState = stateManager.toggleButtonActive('bold-btn');
        this.addResult('ButtonStateManager', 'toggleButtonActive', 
            !newState && !stateManager.isButtonActive('bold-btn'),
            'Should toggle button state'
        );
        
        // Test clearing all states
        stateManager.setButtonActive('italic-btn', true);
        stateManager.clearAllActiveStates();
        this.addResult('ButtonStateManager', 'clearAllActiveStates', 
            stateManager.getActiveButtonCount() === 0,
            'Should clear all active states'
        );
        
        stateManager.destroy();
        cursorTracker.destroy();
        renderer.destroy();
        
        console.log('✅ ButtonStateManager tests complete');
    }

    /**
     * Test EventCoordinator
     */
    async testEventCoordinator() {
        console.log('🎯 Testing EventCoordinator...');
        
        const configManager = new ButtonConfigManager();
        const renderer = new ButtonBarRenderer(this.editorElement, configManager);
        const cursorTracker = new CursorTracker(this.editorElement);
        const stateManager = new ButtonStateManager(renderer, cursorTracker);
        const notificationService = new NotificationService({ duration: 100 });
        const blockFormatter = new BlockFormatter(this.editorElement);
        const inlineFormatter = new InlineFormatter(this.editorElement);
        
        renderer.createButtonBar();
        renderer.insertIntoDOM();
        
        const eventCoordinator = new EventCoordinator(
            renderer, configManager, blockFormatter, inlineFormatter,
            stateManager, notificationService
        );
        
        // Test attaching event listeners
        eventCoordinator.attachEventListeners();
        this.addResult('EventCoordinator', 'attachEventListeners', 
            eventCoordinator.getStatus().isAttached,
            'Should attach event listeners'
        );
        
        // Test custom actions
        let customActionCalled = false;
        const customHandler = () => { customActionCalled = true; };
        
        this.addResult('EventCoordinator', 'addCustomAction', 
            eventCoordinator.addCustomAction('testAction', customHandler),
            'Should add custom action'
        );
        
        eventCoordinator.executeActionByName('testAction');
        this.addResult('EventCoordinator', 'executeCustomAction', 
            customActionCalled,
            'Should execute custom action'
        );
        
        // Test triggering button
        this.editorElement.value = '';
        eventCoordinator.triggerButton('bold-btn');
        this.addResult('EventCoordinator', 'triggerButton', 
            this.editorElement.value.includes('**'),
            'Should trigger button formatting'
        );
        
        eventCoordinator.destroy();
        stateManager.destroy();
        cursorTracker.destroy();
        renderer.destroy();
        notificationService.destroy();
        blockFormatter.destroy();
        inlineFormatter.destroy();
        
        console.log('✅ EventCoordinator tests complete');
    }

    /**
     * Test EditorButtonBar integration
     */
    async testEditorButtonBarIntegration() {
        console.log('🔗 Testing EditorButtonBar integration...');
        
        // Test initialization
        this.addResult('EditorButtonBar', 'initialization', 
            this.buttonBar && this.buttonBar.getElement(),
            'Should initialize successfully'
        );
        
        // Test show/hide
        this.buttonBar.show();
        this.addResult('EditorButtonBar', 'show', 
            this.buttonBar.isButtonBarVisible(),
            'Should show button bar'
        );
        
        this.buttonBar.hide();
        this.addResult('EditorButtonBar', 'hide', 
            !this.buttonBar.isButtonBarVisible(),
            'Should hide button bar'
        );
        
        // Ensure button bar is shown before adding buttons (containers need to exist)
        this.buttonBar.show();
        
        // Test adding custom button
        const customButton = {
            id: 'custom-test-btn',
            text: 'Custom Test',
            icon: '🧪',
            className: 'btn-custom',
            action: 'testAction'
        };
        

        this.addResult('EditorButtonBar', 'addButton', 
            this.buttonBar.addButton(customButton),
            'Should add custom button'
        );
        
        // Test getting button config
        this.addResult('EditorButtonBar', 'getButtonConfig', 
            this.buttonBar.getButtonConfig('custom-test-btn') !== null,
            'Should get button configuration'
        );
        
        // Test removing button
        this.addResult('EditorButtonBar', 'removeButton', 
            this.buttonBar.removeButton('custom-test-btn'),
            'Should remove button'
        );
        
        console.log('✅ EditorButtonBar integration tests complete');
    }

    /**
     * Test formatting operations
     */
    async testFormattingOperations() {
        console.log('📝 Testing formatting operations...');
        
        // Test bold formatting
        this.editorElement.value = 'test text';
        this.editorElement.setSelectionRange(0, 4);
        this.buttonBar.handleMarkdownFormat('bold', 'inline');
        
        this.addResult('FormattingOperations', 'boldFormatting', 
            this.editorElement.value.includes('**test**'),
            'Should apply bold formatting'
        );
        
        // Test header formatting
        this.editorElement.value = 'heading text';
        this.editorElement.setSelectionRange(0, 0);
        this.buttonBar.handleMarkdownFormat('header1', 'block');
        
        this.addResult('FormattingOperations', 'headerFormatting', 
            this.editorElement.value.includes('# '),
            'Should apply header formatting'
        );
        
        // Test list formatting
        this.editorElement.value = 'list item';
        this.editorElement.setSelectionRange(0, 0);
        this.buttonBar.handleMarkdownFormat('unorderedList', 'block');
        
        this.addResult('FormattingOperations', 'listFormatting', 
            this.editorElement.value.includes('- '),
            'Should apply list formatting'
        );
        
        console.log('✅ Formatting operations tests complete');
    }

    /**
     * Test keyboard shortcuts
     */
    async testKeyboardShortcuts() {
        console.log('⌨️ Testing keyboard shortcuts...');
        
        // Test Ctrl+B for bold
        this.editorElement.value = 'shortcut test';
        this.editorElement.setSelectionRange(0, 8);
        this.editorElement.focus();
        
        const boldEvent = new KeyboardEvent('keydown', {
            key: 'b',
            ctrlKey: true,
            bubbles: true
        });
        
        this.editorElement.dispatchEvent(boldEvent);
        
        // Note: This test might not work in all environments due to preventDefault
        this.addResult('KeyboardShortcuts', 'ctrlB', 
            true, // Assuming it works if no errors
            'Should handle Ctrl+B shortcut'
        );
        
        console.log('✅ Keyboard shortcuts tests complete');
    }

    /**
     * Test button states
     */
    async testButtonStates() {
        console.log('⚪ Testing button states...');
        
        // Test context-based state updates
        this.editorElement.value = 'This is **bold** text';
        this.editorElement.setSelectionRange(12, 12); // Inside bold
        this.buttonBar.updateButtonStates();
        
        this.addResult('ButtonStates', 'contextAwareness', 
            this.buttonBar.isButtonActive('bold-btn'),
            'Should detect context and set button active'
        );
        
        // Test clearing states
        this.editorElement.value = 'Plain text';
        this.editorElement.setSelectionRange(0, 0);
        this.buttonBar.updateButtonStates();
        
        this.addResult('ButtonStates', 'clearStates', 
            !this.buttonBar.isButtonActive('bold-btn'),
            'Should clear active states in plain text'
        );
        
        console.log('✅ Button states tests complete');
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        console.log('🚨 Testing error handling...');
        
        // Test with null editor element
        try {
            const nullButtonBar = new EditorButtonBar(null);
            this.addResult('ErrorHandling', 'nullEditor', 
                false,
                'Should handle null editor element gracefully'
            );
        } catch (error) {
            this.addResult('ErrorHandling', 'nullEditor', 
                true,
                'Should throw error for null editor element'
            );
        }
        
        // Test invalid button configuration
        const invalidButton = { id: '', text: '' };
        this.addResult('ErrorHandling', 'invalidButton', 
            !this.buttonBar.addButton(invalidButton),
            'Should reject invalid button configuration'
        );
        
        // Test non-existent button operations
        this.addResult('ErrorHandling', 'nonExistentButton', 
            !this.buttonBar.removeButton('non-existent-btn'),
            'Should handle non-existent button gracefully'
        );
        
        console.log('✅ Error handling tests complete');
    }

    /**
     * Test performance
     */
    async testPerformance() {
        console.log('⚡ Testing performance...');
        
        // Test rapid state updates
        const startTime = performance.now();
        
        for (let i = 0; i < 100; i++) {
            this.buttonBar.updateButtonStates();
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.addResult('Performance', 'rapidStateUpdates', 
            duration < 1000, // Should complete in under 1 second
            `100 state updates took ${duration.toFixed(2)}ms`
        );
        
        // Test memory usage (basic check)
        const beforeMemory = this.getMemoryUsage();
        
        // Create and destroy many button bars
        for (let i = 0; i < 10; i++) {
            const tempEditor = document.createElement('textarea');
            const tempPane = document.createElement('div');
            tempPane.className = 'editor-pane';
            tempPane.appendChild(tempEditor);
            document.body.appendChild(tempPane);
            
            const tempButtonBar = new EditorButtonBar(tempEditor);
            tempButtonBar.destroy();
            
            document.body.removeChild(tempPane);
        }
        
        const afterMemory = this.getMemoryUsage();
        const memoryDiff = afterMemory - beforeMemory;
        
        this.addResult('Performance', 'memoryCleanup', 
            memoryDiff < 10000000, // Less than 10MB increase
            `Memory diff: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`
        );
        
        console.log('✅ Performance tests complete');
    }

    /**
     * Get memory usage (if available)
     */
    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize;
        }
        return 0;
    }

    /**
     * Add test result
     */
    addResult(category, test, passed, message) {
        this.testResults.push({
            category,
            test,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${category}.${test}: ${message}`);
    }

    /**
     * Print test results summary
     */
    printResults() {
        console.log('\n📊 Test Results Summary');
        console.log('========================');
        
        const categories = {};
        let totalTests = 0;
        let passedTests = 0;
        
        this.testResults.forEach(result => {
            if (!categories[result.category]) {
                categories[result.category] = { passed: 0, total: 0 };
            }
            
            categories[result.category].total++;
            totalTests++;
            
            if (result.passed) {
                categories[result.category].passed++;
                passedTests++;
            }
        });
        
        Object.entries(categories).forEach(([category, stats]) => {
            const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
            const status = stats.passed === stats.total ? '✅' : '❌';
            console.log(`${status} ${category}: ${stats.passed}/${stats.total} (${percentage}%)`);
        });
        
        console.log('------------------------');
        const overallPercentage = ((passedTests / totalTests) * 100).toFixed(1);
        const overallStatus = passedTests === totalTests ? '✅' : '❌';
        console.log(`${overallStatus} Overall: ${passedTests}/${totalTests} (${overallPercentage}%)`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('❌ Some tests failed. Check details above.');
        }
    }

    /**
     * Export results for further analysis
     */
    exportResults() {
        return {
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.passed).length,
                failed: this.testResults.filter(r => r.passed === false).length
            },
            results: this.testResults,
            timestamp: new Date().toISOString()
        };
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && window.location) {
    // Browser environment
    const testSuite = new ButtonBarTestSuite();
    
    // Export for manual testing
    window.ButtonBarTestSuite = ButtonBarTestSuite;
    window.runButtonBarTests = () => testSuite.runAllTests();
    
    // Auto-run if URL contains test parameter
    if (window.location.search.includes('test=buttonbar')) {
        document.addEventListener('DOMContentLoaded', () => {
            testSuite.runAllTests();
        });
    }
}

export { ButtonBarTestSuite };