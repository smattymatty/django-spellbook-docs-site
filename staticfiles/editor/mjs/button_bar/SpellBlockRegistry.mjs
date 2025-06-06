// static/editor/mjs/button_bar/SpellBlockRegistry.mjs

/**
 * SpellBlock Registry Management
 * Handles fetching and caching of SpellBlock definitions from the API
 */
export class SpellBlockRegistry {
    constructor() {
        this.blocks = new Map();
        this.isLoaded = false;
        this.isLoading = false;
        this.lastUpdated = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch SpellBlock registry from API
     * @returns {Promise<Map>} Promise resolving to Map of SpellBlock definitions
     */
    async fetchRegistry() {
        if (this.isLoading) {
            // If already loading, wait for existing request
            return this.waitForLoad();
        }

        if (this.isLoaded && this.isCacheValid()) {
            return this.blocks;
        }

        this.isLoading = true;

        try {
            const response = await fetch('/api/v1/spellblock-registry/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Clear existing blocks and populate with new data
            this.blocks.clear();
            
            if (data.blocks && Array.isArray(data.blocks)) {
                data.blocks.forEach(block => {
                    this.blocks.set(block.name, this.processBlockDefinition(block));
                });
            }

            this.isLoaded = true;
            this.lastUpdated = Date.now();
            
            console.log(`[SpellBlockRegistry] Loaded ${this.blocks.size} SpellBlocks`);
            return this.blocks;

        } catch (error) {
            console.error('[SpellBlockRegistry] Failed to fetch registry:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Process and normalize block definition from API
     * @param {Object} block - Raw block definition from API
     * @returns {Object} Processed block definition
     * @private
     */
    processBlockDefinition(block) {
        return {
            name: block.name,
            className: block.class_name,
            template: block.template,
            description: block.description || `SpellBlock: ${block.name}`,
            parameters: this.processParameters(block.parameters || {}),
            displayName: this.createDisplayName(block.name),
            searchTerms: this.generateSearchTerms(block)
        };
    }

    /**
     * Process parameters from API response
     * @param {Object} parameters - Raw parameters object
     * @returns {Array} Array of parameter definitions
     * @private
     */
    processParameters(parameters) {
        return Object.entries(parameters).map(([name, config]) => ({
            name,
            type: config.type || 'string',
            default: config.default,
            required: config.required || false,
            description: config.description || `Parameter: ${name}`
        }));
    }

    /**
     * Create human-readable display name from block name
     * @param {string} name - Block name
     * @returns {string} Display name
     * @private
     */
    createDisplayName(name) {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Generate search terms for block filtering
     * @param {Object} block - Block definition
     * @returns {Array} Array of search terms
     * @private
     */
    generateSearchTerms(block) {
        const terms = [
            block.name,
            block.class_name,
            this.createDisplayName(block.name),
        ];

        // Add parameter names as search terms
        if (block.parameters) {
            Object.keys(block.parameters).forEach(param => {
                terms.push(param);
            });
        }

        return terms.map(term => term.toLowerCase());
    }

    /**
     * Wait for ongoing load operation to complete
     * @returns {Promise<Map>} Promise resolving to blocks Map
     * @private
     */
    async waitForLoad() {
        return new Promise((resolve) => {
            const checkLoading = () => {
                if (!this.isLoading) {
                    resolve(this.blocks);
                } else {
                    setTimeout(checkLoading, 100);
                }
            };
            checkLoading();
        });
    }

    /**
     * Check if cache is still valid
     * @returns {boolean} True if cache is valid
     * @private
     */
    isCacheValid() {
        if (!this.lastUpdated) return false;
        return (Date.now() - this.lastUpdated) < this.cacheTimeout;
    }

    /**
     * Get all SpellBlocks
     * @returns {Promise<Array>} Array of SpellBlock definitions
     */
    async getAllBlocks() {
        const blocks = await this.fetchRegistry();
        return Array.from(blocks.values());
    }

    /**
     * Get SpellBlock by name
     * @param {string} name - Block name
     * @returns {Promise<Object|null>} SpellBlock definition or null
     */
    async getBlock(name) {
        const blocks = await this.fetchRegistry();
        return blocks.get(name) || null;
    }

    /**
     * Search SpellBlocks by term
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Array of matching SpellBlock definitions
     */
    async searchBlocks(searchTerm) {
        const blocks = await this.getAllBlocks();
        
        if (!searchTerm || searchTerm.trim() === '') {
            return blocks;
        }

        const term = searchTerm.toLowerCase().trim();
        
        return blocks.filter(block => {
            return block.searchTerms.some(searchTerm => 
                searchTerm.includes(term)
            );
        });
    }

    /**
     * Generate SpellBlock template with parameters
     * @param {string} blockName - Name of the block
     * @param {Object} parameterValues - Parameter values (optional)
     * @returns {Promise<string>} Generated template string
     */
    async generateTemplate(blockName, parameterValues = {}) {
        const block = await this.getBlock(blockName);
        
        if (!block) {
            throw new Error(`SpellBlock '${blockName}' not found`);
        }

        let template = `{~ ${blockName}`;
        
        // Add parameters
        if (block.parameters && block.parameters.length > 0) {
            template += '\n';
            
            block.parameters.forEach(param => {
                const value = parameterValues[param.name] !== undefined 
                    ? parameterValues[param.name] 
                    : param.default;
                
                if (value !== undefined && value !== null) {
                    const formattedValue = this.formatParameterValue(value, param.type);
                    template += `    ${param.name}=${formattedValue}\n`;
                }
            });
        }
        
        template += '~}\n';
        template += 'Content goes here\n';
        template += '{~~}';
        
        return template;
    }

    /**
     * Format parameter value based on type
     * @param {*} value - Parameter value
     * @param {string} type - Parameter type
     * @returns {string} Formatted value
     * @private
     */
    formatParameterValue(value, type) {
        if (type === 'string' || typeof value === 'string') {
            return `"${value}"`;
        }
        return String(value);
    }

    /**
     * Invalidate cache and force refresh
     */
    invalidateCache() {
        this.isLoaded = false;
        this.lastUpdated = null;
        this.blocks.clear();
    }

    /**
     * Get registry statistics
     * @returns {Object} Registry stats
     */
    getStats() {
        return {
            isLoaded: this.isLoaded,
            isLoading: this.isLoading,
            blockCount: this.blocks.size,
            lastUpdated: this.lastUpdated,
            cacheValid: this.isCacheValid()
        };
    }
}

// Create singleton instance
export const spellBlockRegistry = new SpellBlockRegistry();