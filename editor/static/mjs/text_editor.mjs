// static/mjs/text-editor.mjs
import EditorManager from './editor/EditorManager.mjs';

/**
 * Main entry point for editor functionality
 * Simplified to use the new EditorManager architecture
 */

let editorManager = null;

/**
 * Initialize editor when DOM is ready
 */
async function initializeEditor() {
    try {
        console.log('[text-editor.mjs] Initializing editor...');
        
        // Create and initialize EditorManager
        editorManager = await EditorManager.create('markdown-input');
        
        console.log('[text-editor.mjs] Editor initialized successfully');
        
        // Optional: Set up global cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (editorManager) {
                editorManager.cleanup();
            }
        });
        
    } catch (error) {
        console.error('[text-editor.mjs] Failed to initialize editor:', error);
    }
}

/**
 * Get the current editor manager instance
 */
function getEditorManager() {
    return editorManager;
}

/**
 * Reset editor to default state
 */
function resetEditor() {
    if (editorManager) {
        return editorManager.reset();
    }
    console.warn('[text-editor.mjs] Cannot reset: editor not initialized');
    return false;
}

/**
 * Get editor status
 */
function getEditorStatus() {
    if (editorManager) {
        return editorManager.getStatus();
    }
    return { isInitialized: false, error: 'Editor not initialized' };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeEditor);

// Export for potential external use
export { getEditorManager, resetEditor, getEditorStatus };