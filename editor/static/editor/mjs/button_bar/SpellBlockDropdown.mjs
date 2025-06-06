// static/editor/mjs/button_bar/SpellBlockDropdown.mjs

import { spellBlockRegistry } from './SpellBlockRegistry.mjs';

/**
 * SpellBlock Dropdown Component
 * Handles the dropdown UI for selecting and inserting SpellBlocks
 */
export class SpellBlockDropdown {
    constructor(targetElement, notificationService) {
        this.targetElement = targetElement;
        this.notificationService = notificationService;
        this.dropdownElement = null;
        this.searchInput = null;
        this.blocksList = null;
        this.isOpen = false;
        this.blocks = [];
        this.filteredBlocks = [];
        this.selectedIndex = -1;
        this.onBlockSelect = null;
        this.previouslyFocused = null; // Store previously focused element
        
        this.init();
    }

    /**
     * Initialize the dropdown component
     * @private
     */
    init() {
        this.createDropdownElement();
        this.attachEventListeners();
    }

    /**
     * Create dropdown HTML structure
     * @private
     */
    createDropdownElement() {
        this.dropdownElement = document.createElement('div');
        this.dropdownElement.className = 'spellblock-dropdown';
        this.dropdownElement.innerHTML = `
            <div class="spellblock-dropdown-content">
                <div class="spellblock-dropdown-header">
                    <input type="text" 
                           class="spellblock-search-input" 
                           placeholder="Search SpellBlocks..." 
                           autocomplete="off">
                    <button class="spellblock-dropdown-close" type="button" aria-label="Close dropdown">×</button>
                </div>
                <div class="spellblock-dropdown-loading">
                    <div class="loading-spinner"></div>
                    <span>Loading SpellBlocks...</span>
                </div>
                <div class="spellblock-blocks-list"></div>
                <div class="spellblock-dropdown-footer">
                    <span class="spellblock-count">0 blocks available</span>
                    <span class="spellblock-help">↑↓ Navigate • Enter Select • Esc Close</span>
                </div>
            </div>
        `;

        // Cache important elements
        this.searchInput = this.dropdownElement.querySelector('.spellblock-search-input');
        this.blocksList = this.dropdownElement.querySelector('.spellblock-blocks-list');
        this.loadingElement = this.dropdownElement.querySelector('.spellblock-dropdown-loading');
        this.countElement = this.dropdownElement.querySelector('.spellblock-count');
        this.closeButton = this.dropdownElement.querySelector('.spellblock-dropdown-close');

        // Position dropdown relative to target
        this.positionDropdown();
        
        // Add to DOM but keep hidden
        document.body.appendChild(this.dropdownElement);
        this.hide();
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Focus search input when user starts typing (but don't steal focus on show)
        this.searchInput.addEventListener('focus', () => {
            // Only focus if dropdown is open and user explicitly focused
            if (!this.isOpen) return;
        });

        // Close button
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.dropdownElement.contains(e.target) && !this.targetElement.contains(e.target)) {
                this.hide();
            }
        });

        // Prevent dropdown from closing when clicking inside and prevent focus loss
        this.dropdownElement.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault(); // Prevent focus changes
        });
        
        // Prevent mousedown on dropdown from causing blur
        this.dropdownElement.addEventListener('mousedown', (e) => {
            e.preventDefault(); // This prevents the editor from losing focus
        });

        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // Global key handler for dropdown navigation when editor is focused
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            // Allow dropdown navigation even when editor is focused
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                // Check if we should handle this (dropdown is open and no input is focused)
                if (document.activeElement !== this.searchInput) {
                    e.preventDefault();
                    if (e.key === 'ArrowDown') {
                        this.navigateDown();
                    } else {
                        this.navigateUp();
                    }
                }
            } else if (e.key === 'Enter' && document.activeElement !== this.searchInput) {
                // Enter to select when not in search input
                if (this.selectedIndex >= 0) {
                    e.preventDefault();
                    this.selectCurrentBlock();
                }
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                // User starts typing - focus search and add the character
                this.searchInput.focus();
                // Don't prevent default - let the character go to the search input
            }
        });
    }

    /**
     * Position dropdown relative to target element
     * @private
     */
    positionDropdown() {
        if (!this.targetElement || !this.dropdownElement) return;

        const rect = this.targetElement.getBoundingClientRect();
        const dropdownHeight = 400; // Max height
        const dropdownWidth = 320;

        // Calculate position
        let top = rect.bottom + 5;
        let left = rect.left;

        // Adjust if dropdown would go off screen
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check if dropdown would go below viewport
        if (top + dropdownHeight > viewportHeight) {
            top = rect.top - dropdownHeight - 5;
        }

        // Check if dropdown would go off right side
        if (left + dropdownWidth > viewportWidth) {
            left = rect.right - dropdownWidth;
        }

        // Ensure dropdown doesn't go off left side
        if (left < 5) {
            left = 5;
        }

        this.dropdownElement.style.position = 'fixed';
        this.dropdownElement.style.top = `${top}px`;
        this.dropdownElement.style.left = `${left}px`;
        this.dropdownElement.style.zIndex = '9999';
    }

    /**
     * Show the dropdown
     */
    async show() {
        if (this.isOpen) return;

        // Store reference to currently focused element (likely the editor)
        this.previouslyFocused = document.activeElement;

        this.isOpen = true;
        this.positionDropdown();
        this.dropdownElement.classList.add('visible');
        
        // Show loading state
        this.showLoading();
        
        try {
            // Load SpellBlocks
            this.blocks = await spellBlockRegistry.getAllBlocks();
            this.filteredBlocks = [...this.blocks];
            
            // Hide loading and render blocks
            this.hideLoading();
            this.renderBlocks();
            this.updateCount();
            
            // Don't steal focus from editor - allow navigation via keyboard but keep editor focused
            // Only focus search if user explicitly wants to search
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load SpellBlocks: ' + error.message);
            console.error('[SpellBlockDropdown] Error loading blocks:', error);
        }
    }

    /**
     * Hide the dropdown
     */
    hide() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.dropdownElement.classList.remove('visible');
        this.selectedIndex = -1;
        this.searchInput.value = '';
        this.filteredBlocks = [...this.blocks];
        
        // Restore focus to previously focused element (editor)
        if (this.previouslyFocused && this.previouslyFocused.focus) {
            setTimeout(() => {
                this.previouslyFocused.focus();
            }, 50);
        }
        this.previouslyFocused = null;
    }

    /**
     * Show loading state
     * @private
     */
    showLoading() {
        this.loadingElement.style.display = 'flex';
        this.blocksList.style.display = 'none';
    }

    /**
     * Hide loading state
     * @private
     */
    hideLoading() {
        this.loadingElement.style.display = 'none';
        this.blocksList.style.display = 'block';
    }

    /**
     * Show error message
     * @param {string} message - Error message
     * @private
     */
    showError(message) {
        this.blocksList.innerHTML = `
            <div class="spellblock-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="retry-button" onclick="this.closest('.spellblock-dropdown').dispatchEvent(new CustomEvent('retry'))">
                    Retry
                </button>
            </div>
        `;
        this.blocksList.style.display = 'block';
    }

    /**
     * Handle search input
     * @param {string} searchTerm - Search term
     * @private
     */
    async handleSearch(searchTerm) {
        try {
            this.filteredBlocks = await spellBlockRegistry.searchBlocks(searchTerm);
            this.selectedIndex = -1;
            this.renderBlocks();
            this.updateCount();
        } catch (error) {
            console.error('[SpellBlockDropdown] Search error:', error);
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     * @private
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateUp();
                break;
            case 'Enter':
                e.preventDefault();
                this.selectCurrentBlock();
                break;
            case 'Tab':
                // Allow tab to navigate through dropdown
                if (this.filteredBlocks.length > 0) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.navigateUp();
                    } else {
                        this.navigateDown();
                    }
                }
                break;
        }
    }

    /**
     * Navigate down in the list
     * @private
     */
    navigateDown() {
        if (this.filteredBlocks.length === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredBlocks.length;
        this.updateSelection();
    }

    /**
     * Navigate up in the list
     * @private
     */
    navigateUp() {
        if (this.filteredBlocks.length === 0) return;
        
        this.selectedIndex = this.selectedIndex <= 0 
            ? this.filteredBlocks.length - 1 
            : this.selectedIndex - 1;
        this.updateSelection();
    }

    /**
     * Select the currently highlighted block
     * @private
     */
    selectCurrentBlock() {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredBlocks.length) {
            const block = this.filteredBlocks[this.selectedIndex];
            this.selectBlock(block);
        }
    }

    /**
     * Select a specific block
     * @param {Object} block - SpellBlock definition
     * @private
     */
    selectBlock(block) {
        // Store the previously focused element before hiding (in case callback changes focus)
        const editorElement = this.previouslyFocused;
        
        if (this.onBlockSelect && typeof this.onBlockSelect === 'function') {
            this.onBlockSelect(block);
        }
        
        this.hide();
        
        // Ensure editor gets focus back after block insertion
        if (editorElement && editorElement.focus) {
            setTimeout(() => {
                editorElement.focus();
            }, 100);
        }
    }

    /**
     * Update visual selection in the list
     * @private
     */
    updateSelection() {
        const items = this.blocksList.querySelectorAll('.spellblock-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    /**
     * Render the blocks list
     * @private
     */
    renderBlocks() {
        if (this.filteredBlocks.length === 0) {
            this.blocksList.innerHTML = `
                <div class="spellblock-no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-message">No SpellBlocks found</div>
                    <div class="no-results-suggestion">Try adjusting your search terms</div>
                </div>
            `;
            return;
        }

        const itemsHtml = this.filteredBlocks.map((block, index) => {
            const parameterCount = block.parameters ? block.parameters.length : 0;
            const parameterText = parameterCount === 0 ? 'No parameters' : 
                                  parameterCount === 1 ? '1 parameter' : 
                                  `${parameterCount} parameters`;

            return `
                <div class="spellblock-item" data-index="${index}" data-block-name="${block.name}">
                    <div class="spellblock-item-main">
                        <div class="spellblock-item-name">${block.displayName}</div>
                        <div class="spellblock-item-code">${block.name}</div>
                    </div>
                    <div class="spellblock-item-details">
                        <div class="spellblock-item-description">${block.description}</div>
                        <div class="spellblock-item-meta">
                            <span class="parameter-count">${parameterText}</span>
                            ${block.template ? `<span class="template-info">Template: ${block.template}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.blocksList.innerHTML = itemsHtml;

        // Add click handlers
        this.blocksList.querySelectorAll('.spellblock-item').forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent focus loss
                this.selectedIndex = index;
                this.selectCurrentBlock();
            });
            
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent focus loss on mousedown
            });

            item.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
        });
    }

    /**
     * Update the blocks count display
     * @private
     */
    updateCount() {
        const count = this.filteredBlocks.length;
        const total = this.blocks.length;
        
        if (count === total) {
            this.countElement.textContent = `${count} blocks available`;
        } else {
            this.countElement.textContent = `${count} of ${total} blocks`;
        }
    }

    /**
     * Set callback for block selection
     * @param {Function} callback - Callback function that receives selected block
     */
    setOnBlockSelect(callback) {
        this.onBlockSelect = callback;
    }

    /**
     * Toggle dropdown visibility
     */
    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Check if dropdown is open
     * @returns {boolean} True if open
     */
    getIsOpen() {
        return this.isOpen;
    }

    /**
     * Refresh the blocks list
     */
    async refresh() {
        if (!this.isOpen) return;

        this.showLoading();
        try {
            spellBlockRegistry.invalidateCache();
            this.blocks = await spellBlockRegistry.getAllBlocks();
            this.filteredBlocks = [...this.blocks];
            this.hideLoading();
            this.renderBlocks();
            this.updateCount();
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to refresh SpellBlocks: ' + error.message);
        }
    }

    /**
     * Destroy the dropdown and clean up
     */
    destroy() {
        if (this.dropdownElement && this.dropdownElement.parentNode) {
            this.dropdownElement.parentNode.removeChild(this.dropdownElement);
        }
        
        this.dropdownElement = null;
        this.searchInput = null;
        this.blocksList = null;
        this.isOpen = false;
        this.blocks = [];
        this.filteredBlocks = [];
        this.onBlockSelect = null;
    }
}