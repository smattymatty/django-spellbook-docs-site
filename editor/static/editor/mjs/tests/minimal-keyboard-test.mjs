// Minimal test to diagnose KeyboardShortcutManager import issues

console.log('Starting minimal keyboard shortcut test...');

export class MinimalKeyboardTest {
    constructor() {
        this.results = [];
    }

    addResult(name, passed, message) {
        this.results.push({ name, passed, message });
        console.log(`${passed ? '✅' : '❌'} ${name}: ${message}`);
    }

    async runTests() {
        console.log('Test 1: Import KeyboardShortcutManager');
        try {
            const { KeyboardShortcutManager } = await import('../button_bar/KeyboardShortcutManager.mjs');
            this.addResult('Import', true, 'Successfully imported KeyboardShortcutManager');
            
            console.log('Test 2: Create simple mock');
            const mockCoordinator = {
                handleMarkdownFormat: () => {},
                handleInsertSpellBlock: () => {},
                hasCustomAction: () => false,
                executeActionByName: () => {},
                renderer: { getButtonElement: () => document.createElement('button') },
                notificationService: { info: () => {} }
            };
            
            console.log('Test 3: Create manager instance');
            const manager = new KeyboardShortcutManager(mockCoordinator);
            this.addResult('Create Instance', true, 'Successfully created manager instance');
            
            console.log('Test 4: Get status');
            const status = manager.getStatus();
            this.addResult('Get Status', typeof status === 'object', `Status: ${JSON.stringify(status)}`);
            
            console.log('Test 5: Get shortcuts');
            const shortcuts = manager.getAllShortcuts();
            this.addResult('Get Shortcuts', shortcuts instanceof Map, `Found ${shortcuts.size} shortcuts`);
            
            console.log('Test 6: Cleanup');
            manager.destroy();
            this.addResult('Cleanup', true, 'Successfully destroyed manager');
            
        } catch (error) {
            console.error('Error in minimal test:', error);
            this.addResult('Import', false, `Error: ${error.message}`);
        }
        
        const total = this.results.length;
        const passed = this.results.filter(r => r.passed).length;
        
        console.log(`\nMinimal test complete: ${passed}/${total} passed`);
        
        return {
            total,
            passed,
            failed: total - passed,
            passRate: total > 0 ? (passed / total * 100).toFixed(1) : 0,
            results: this.results
        };
    }
}

export default MinimalKeyboardTest;