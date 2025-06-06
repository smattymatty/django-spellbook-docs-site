// static/mjs/text-editor.mjs
import EditorButtonBar from './button_bar.mjs';

class TextEditorFocusLogger {
    constructor(editorId) {
        this.editorId = editorId;
        this.editorElement = document.getElementById(this.editorId);
        this.previewElement = document.getElementById('live-preview-area'); // Assuming this ID is correct

        if (!this.editorElement) {
            console.error(`[TextEditorFocusLogger] Error: Editor element with ID "${this.editorId}" was not found.`);
            return;
        }
        if (!this.previewElement) {
            console.warn(`[TextEditorFocusLogger] Warning: Preview element with ID "live-preview-area" was not found. Style changes on focus/blur will not apply.`);
        }

        // Initialize the EditorButtonBar
        this.buttonBar = new EditorButtonBar(this.editorElement);

        console.log(`[TextEditorFocusLogger] Initialized for editor "#${this.editorId}" and preview "#${this.previewElement ? this.previewElement.id : 'null'}".`);
        this._attachEventListeners();
    }

    _attachEventListeners() {
        // Attach focus listener
        this.editorElement.addEventListener('focus', (event) => this.handleFocus(event));
        console.log(`[TextEditorFocusLogger] Attached focus listener to "#${this.editorId}".`);

        // Attach blur listener
        this.editorElement.addEventListener('blur', (event) => this.handleBlur(event));
        console.log(`[TextEditorFocusLogger] Attached blur listener to "#${this.editorId}".`);
    }

    // --- Style Helper Methods ---
    _applyFocusedStyles() {
        if (!this.editorElement || !this.previewElement) return;
        console.log(`[TextEditorFocusLogger] Applying focused styles to panes.`);
        this.editorElement.classList.add('editor-pane-focused');
        this.previewElement.classList.add('preview-pane-squashed');
    }

    _resetPreviewStyles() {
        if (!this.editorElement || !this.previewElement) return;
        console.log(`[TextEditorFocusLogger] Resetting pane styles.`);
        this.editorElement.classList.remove('editor-pane-focused');
        this.previewElement.classList.remove('preview-pane-squashed');

    }

    // --- Event Handlers ---
    handleFocus(event) {
        const currentTime = new Date().toLocaleTimeString();
        console.log(`[TextEditorFocusLogger] Editor "#${this.editorElement.id}" GAINED focus at ${currentTime}.`);
        this._applyFocusedStyles();
        
        // Show the floating button bar
        if (this.buttonBar) {
            this.buttonBar.show();
        }
    }

    handleBlur(event) {
        const currentTime = new Date().toLocaleTimeString();
        console.log(`[TextEditorFocusLogger] Editor "#${this.editorElement.id}" LOST focus (blurred) at ${currentTime}.`);
        this._resetPreviewStyles();
        
        // Hide the floating button bar
        if (this.buttonBar) {
            this.buttonBar.hide();
        }
    }
}

// This ensures the class is instantiated only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    console.log('[text-editor.mjs] DOMContentLoaded event fired.');
    new TextEditorFocusLogger('markdown-input'); // Assuming your textarea still has id="markdown-input"
});

// export default TextEditorFocusLogger; // If you plan to import this class elsewhere