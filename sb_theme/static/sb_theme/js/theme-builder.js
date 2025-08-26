/**
 * Theme Builder Wizard - Mode-Aware Theme Creation
 * Supports light and dark modes for Django Spellbook themes
 */

var ThemeBuilder = {
    // Separate color states for light and dark modes
    lightColors: {},
    darkColors: {},
    colorProperties: {},
    defaultLightColors: {},
    defaultDarkColors: {},
    currentEditMode: 'light', // Which mode we're currently editing
    currentPreviewMode: 'light', // Which mode is shown in preview
    
    // Preset themes with modes from django_spellbook
    presetThemes: {
        arcane: {
            light: {
                primary: '#9D4EDD',
                secondary: '#240046',
                accent: '#FFB700',
                neutral: '#3C096C',
                success: '#7FB800',
                warning: '#FFAA00',
                error: '#D00000',
                info: '#7209B7',
                background: '#ffffff',
                surface: '#F9F5FF',
                text: '#240046',
                'text-secondary': '#5A0A8C'
            },
            dark: {
                primary: '#B57BFF',
                secondary: '#E0AAFF',
                accent: '#FFD60A',
                neutral: '#7209B7',
                success: '#A7F432',
                warning: '#FFD60A',
                error: '#FF4444',
                info: '#9D4EDD',
                background: '#0f0f0f',
                surface: '#1a0033',
                text: '#F9F5FF',
                'text-secondary': '#C77DFF'
            }
        },
        celestial: {
            light: {
                primary: '#0077B6',
                secondary: '#00B4D8',
                accent: '#FFE66D',
                neutral: '#023E8A',
                success: '#52B788',
                warning: '#FFB700',
                error: '#E63946',
                info: '#0096C7',
                background: '#ffffff',
                surface: '#F0F9FF',
                text: '#03045E',
                'text-secondary': '#0077B6'
            },
            dark: {
                primary: '#48CAE4',
                secondary: '#90E0EF',
                accent: '#FFE66D',
                neutral: '#0077B6',
                success: '#95D5B2',
                warning: '#FFD60A',
                error: '#FF6B6B',
                info: '#48CAE4',
                background: '#03045E',
                surface: '#023E8A',
                text: '#CAF0F8',
                'text-secondary': '#90E0EF'
            }
        },
        phoenix: {
            light: {
                primary: '#F72585',
                secondary: '#B5179E',
                accent: '#FFBE0B',
                neutral: '#7209B7',
                success: '#06FFB4',
                warning: '#FB5607',
                error: '#E01E37',
                info: '#3A0CA3',
                background: '#ffffff',
                surface: '#FFF0F7',
                text: '#480CA8',
                'text-secondary': '#7209B7'
            },
            dark: {
                primary: '#FF006E',
                secondary: '#F72585',
                accent: '#FFBE0B',
                neutral: '#B5179E',
                success: '#06FFB4',
                warning: '#FF9A00',
                error: '#FF4365',
                info: '#8338EC',
                background: '#240046',
                surface: '#3C096C',
                text: '#FFDDFF',
                'text-secondary': '#F72585'
            }
        }
    },
    
    init: function() {
        console.log('🎨 Theme Builder Wizard (Mode-Aware) initializing...');
        try {
            this.loadInitialData();
            this.setupEventListeners();
            this.renderColorPickers('light');
            this.renderColorPickers('dark');
            this.updateGeneratedConfig();
            console.log('✅ Theme Builder ready with mode support!');
        } catch (error) {
            console.error('❌ Theme Builder initialization failed:', error);
        }
    },
    
    loadInitialData: function() {
        try {
            this.lightColors = JSON.parse(document.getElementById('light-colors').textContent);
            this.darkColors = JSON.parse(document.getElementById('dark-colors').textContent);
            this.colorProperties = JSON.parse(document.getElementById('color-properties').textContent);
            
            // Store defaults for reset
            this.defaultLightColors = JSON.parse(JSON.stringify(this.lightColors));
            this.defaultDarkColors = JSON.parse(JSON.stringify(this.darkColors));
        } catch (error) {
            console.error('Failed to load initial data:', error);
            // Fallback to empty objects
            this.lightColors = {};
            this.darkColors = {};
            this.colorProperties = {};
        }
    },
    
    setupEventListeners: function() {
        var self = this;
        
        // Mode tabs for editing
        document.querySelectorAll('.mode-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                var mode = this.getAttribute('data-mode');
                self.switchEditMode(mode);
            });
        });
        
        // Preview mode toggle
        document.querySelectorAll('.preview-mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var mode = this.getAttribute('data-preview-mode');
                self.switchPreviewMode(mode);
            });
        });
        
        // Preview section tabs
        document.querySelectorAll('.preview-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                self.switchPreviewSection(this.getAttribute('data-section'));
                document.querySelectorAll('.preview-tab').forEach(function(t) { 
                    t.classList.remove('active'); 
                });
                this.classList.add('active');
            });
        });
        
        // Preset theme buttons
        document.querySelectorAll('.preset-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var preset = this.getAttribute('data-preset');
                if (preset === 'custom') {
                    self.resetToDefaults();
                } else {
                    self.applyPresetTheme(preset);
                }
            });
        });
        
        // Mode action buttons
        var copyToDarkBtn = document.getElementById('copy-to-dark');
        if (copyToDarkBtn) {
            copyToDarkBtn.addEventListener('click', function() {
                self.copyColorsBetweenModes('light', 'dark');
            });
        }
        
        var copyToLightBtn = document.getElementById('copy-to-light');
        if (copyToLightBtn) {
            copyToLightBtn.addEventListener('click', function() {
                self.copyColorsBetweenModes('dark', 'light');
            });
        }
        
        var autoDarkBtn = document.getElementById('auto-dark');
        if (autoDarkBtn) {
            autoDarkBtn.addEventListener('click', function() {
                self.autoGenerateDarkMode();
            });
        }
        
        var optimizeContrastBtn = document.getElementById('optimize-contrast');
        if (optimizeContrastBtn) {
            optimizeContrastBtn.addEventListener('click', function() {
                self.optimizeDarkModeContrast();
            });
        }
        
        // Config buttons
        var copyBtn = document.getElementById('copy-config-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                self.copyConfigToClipboard();
            });
        }
        
        var downloadBtn = document.getElementById('download-config-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                self.downloadConfig();
            });
        }
    },
    
    renderColorPickers: function(mode) {
        var containerId = mode + '-color-picker-container';
        var container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Get colors for this mode
        var colors = mode === 'light' ? this.lightColors : this.darkColors;
        
        // Group colors by category
        var categories = this.groupColorsByCategory(colors);
        var self = this;
        
        // Render each category
        Object.keys(categories).forEach(function(categoryName) {
            var categoryColors = categories[categoryName];
            
            var categoryDiv = document.createElement('div');
            categoryDiv.className = 'color-category';
            
            // Category header
            var headerDiv = document.createElement('div');
            headerDiv.className = 'category-header';
            
            var titleSpan = document.createElement('span');
            titleSpan.className = 'category-title';
            titleSpan.textContent = categoryName;
            
            var badgeSpan = document.createElement('span');
            badgeSpan.className = 'category-badge';
            badgeSpan.textContent = categoryColors.length + ' colors';
            
            headerDiv.appendChild(titleSpan);
            headerDiv.appendChild(badgeSpan);
            categoryDiv.appendChild(headerDiv);
            
            // Color inputs grid
            var gridDiv = document.createElement('div');
            gridDiv.className = 'color-inputs-grid';
            
            categoryColors.forEach(function(color) {
                var colorCard = self.createColorInput(color, mode);
                gridDiv.appendChild(colorCard);
            });
            
            categoryDiv.appendChild(gridDiv);
            container.appendChild(categoryDiv);
        });
    },
    
    groupColorsByCategory: function(colors) {
        var categories = {};
        var self = this;
        
        Object.keys(this.colorProperties).forEach(function(colorName) {
            var properties = self.colorProperties[colorName];
            var category = properties.category || 'Other';
            
            if (!categories[category]) {
                categories[category] = [];
            }
            
            categories[category].push({
                name: colorName,
                label: properties.label,
                description: properties.description,
                value: colors[colorName] || '#000000'
            });
        });
        
        // Sort categories
        var sortedCategories = {};
        ['Brand Colors', 'Status Colors', 'System Colors', 'Extended Colors'].forEach(function(cat) {
            if (categories[cat]) {
                sortedCategories[cat] = categories[cat];
            }
        });
        
        return sortedCategories;
    },
    
    createColorInput: function(colorData, mode) {
        var self = this;
        var name = colorData.name;
        var label = colorData.label;
        var description = colorData.description;
        var value = this.normalizeHex(colorData.value);
        
        // Create card
        var card = document.createElement('div');
        card.className = 'color-input-card';
        card.setAttribute('data-color-name', name);
        card.setAttribute('data-mode', mode);
        
        // Header
        var header = document.createElement('div');
        header.className = 'color-input-header';
        
        var labelSpan = document.createElement('span');
        labelSpan.className = 'color-label';
        labelSpan.textContent = label;
        header.appendChild(labelSpan);
        
        // Description
        var descSpan = document.createElement('div');
        descSpan.className = 'color-description';
        descSpan.textContent = description;
        
        // Controls
        var controls = document.createElement('div');
        controls.className = 'color-controls';
        
        // Color picker
        var pickerWrapper = document.createElement('div');
        pickerWrapper.className = 'color-picker-wrapper';
        
        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'color-picker-input';
        colorInput.value = value;
        colorInput.id = mode + '-color-' + name;
        
        pickerWrapper.appendChild(colorInput);
        
        // Hex input
        var hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.className = 'color-hex-input';
        hexInput.value = value;
        hexInput.placeholder = '#000000';
        hexInput.maxLength = 7;
        
        // Reset button
        var resetBtn = document.createElement('button');
        resetBtn.className = 'color-reset-btn';
        resetBtn.innerHTML = '↺';
        resetBtn.title = 'Reset to default';
        
        // Event handlers
        colorInput.addEventListener('input', function(e) {
            var newValue = self.normalizeHex(e.target.value);
            hexInput.value = newValue;
            self.updateThemeColor(name, newValue, mode);
        });
        
        hexInput.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (self.isValidHex(newValue)) {
                newValue = self.normalizeHex(newValue);
                colorInput.value = newValue;
                self.updateThemeColor(name, newValue, mode);
            }
        });
        
        hexInput.addEventListener('blur', function(e) {
            var newValue = self.normalizeHex(e.target.value);
            e.target.value = newValue;
            colorInput.value = newValue;
            self.updateThemeColor(name, newValue, mode);
        });
        
        resetBtn.addEventListener('click', function() {
            var defaults = mode === 'light' ? self.defaultLightColors : self.defaultDarkColors;
            var defaultValue = defaults[name] || '#000000';
            colorInput.value = defaultValue;
            hexInput.value = defaultValue;
            self.updateThemeColor(name, defaultValue, mode);
        });
        
        // Assemble
        controls.appendChild(pickerWrapper);
        controls.appendChild(hexInput);
        controls.appendChild(resetBtn);
        
        card.appendChild(header);
        card.appendChild(descSpan);
        card.appendChild(controls);
        
        return card;
    },
    
    updateThemeColor: function(colorName, colorValue, mode) {
        // Update the appropriate color state
        if (mode === 'light') {
            this.lightColors[colorName] = colorValue;
        } else {
            this.darkColors[colorName] = colorValue;
        }
        
        // If we're previewing this mode, update CSS variables
        if (mode === this.currentPreviewMode) {
            var cssVarName = '--' + colorName.replace(/_/g, '-') + '-color';
            document.documentElement.style.setProperty(cssVarName, colorValue);
            this.updateColorVariants(colorName, colorValue);
        }
        
        // Update config
        this.updateGeneratedConfig();
    },
    
    updateColorVariants: function(colorName, colorValue) {
        var baseName = '--' + colorName.replace(/_/g, '-') + '-color';
        var variants = [25, 50, 75];
        
        variants.forEach(function(opacity) {
            var varName = baseName + '-' + opacity;
            var varValue = 'color-mix(in srgb, ' + colorValue + ' ' + opacity + '%, transparent)';
            document.documentElement.style.setProperty(varName, varValue);
        });
    },
    
    switchEditMode: function(mode) {
        this.currentEditMode = mode;
        
        // Update tab states
        document.querySelectorAll('.mode-tab').forEach(function(tab) {
            tab.classList.remove('active');
        });
        document.querySelector('.mode-tab[data-mode="' + mode + '"]').classList.add('active');
        
        // Show/hide panels
        document.querySelectorAll('.mode-panel').forEach(function(panel) {
            panel.classList.remove('active');
        });
        document.getElementById(mode + '-mode-panel').classList.add('active');
        
        // Update the theme mode for CSS variables
        var container = document.querySelector('.mode-tabs-container');
        if (container) {
            container.setAttribute('data-theme-mode', mode);
        }
    },
    
    switchPreviewMode: function(mode) {
        this.currentPreviewMode = mode;
        
        // Update button states
        document.querySelectorAll('.preview-mode-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        document.querySelector('.preview-mode-btn[data-preview-mode="' + mode + '"]').classList.add('active');
        
        // Apply colors for the selected mode
        var colors = mode === 'light' ? this.lightColors : this.darkColors;
        var self = this;
        
        Object.keys(colors).forEach(function(colorName) {
            var cssVarName = '--' + colorName.replace(/_/g, '-') + '-color';
            document.documentElement.style.setProperty(cssVarName, colors[colorName]);
            self.updateColorVariants(colorName, colors[colorName]);
        });
        
        // Toggle dark mode class on preview
        var previewContent = document.getElementById('preview-content');
        if (previewContent) {
            if (mode === 'dark') {
                previewContent.classList.add('dark-mode');
            } else {
                previewContent.classList.remove('dark-mode');
            }
        }
    },
    
    switchPreviewSection: function(sectionName) {
        document.querySelectorAll('.preview-section').forEach(function(section) {
            section.classList.remove('active');
        });
        
        var targetSection = document.getElementById('preview-' + sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },
    
    applyPresetTheme: function(themeName) {
        var theme = this.presetThemes[themeName];
        if (!theme) return;
        
        var self = this;
        
        // Apply light mode colors
        if (theme.light) {
            Object.keys(theme.light).forEach(function(colorName) {
                if (self.lightColors.hasOwnProperty(colorName)) {
                    self.lightColors[colorName] = theme.light[colorName];
                    
                    // Update UI
                    var colorInput = document.getElementById('light-color-' + colorName);
                    var hexInput = document.querySelector('#light-mode-panel .color-hex-input');
                    
                    if (colorInput) colorInput.value = theme.light[colorName];
                }
            });
            this.renderColorPickers('light');
        }
        
        // Apply dark mode colors
        if (theme.dark) {
            Object.keys(theme.dark).forEach(function(colorName) {
                if (self.darkColors.hasOwnProperty(colorName)) {
                    self.darkColors[colorName] = theme.dark[colorName];
                    
                    // Update UI
                    var colorInput = document.getElementById('dark-color-' + colorName);
                    
                    if (colorInput) colorInput.value = theme.dark[colorName];
                }
            });
            this.renderColorPickers('dark');
        }
        
        // Update preview
        this.switchPreviewMode(this.currentPreviewMode);
        this.updateGeneratedConfig();
    },
    
    copyColorsBetweenModes: function(fromMode, toMode) {
        var fromColors = fromMode === 'light' ? this.lightColors : this.darkColors;
        var self = this;
        
        // Copy colors
        Object.keys(fromColors).forEach(function(colorName) {
            if (toMode === 'light') {
                self.lightColors[colorName] = fromColors[colorName];
            } else {
                self.darkColors[colorName] = fromColors[colorName];
            }
        });
        
        // Re-render the target mode
        this.renderColorPickers(toMode);
        
        // Update preview if needed
        if (toMode === this.currentPreviewMode) {
            this.switchPreviewMode(toMode);
        }
        
        this.updateGeneratedConfig();
    },
    
    autoGenerateDarkMode: function() {
        var self = this;
        
        // Smart dark mode generation based on light colors
        Object.keys(this.lightColors).forEach(function(colorName) {
            var lightColor = self.lightColors[colorName];
            var darkColor = self.generateDarkVariant(lightColor, colorName);
            self.darkColors[colorName] = darkColor;
        });
        
        // Re-render dark mode
        this.renderColorPickers('dark');
        
        // Update preview if in dark mode
        if (this.currentPreviewMode === 'dark') {
            this.switchPreviewMode('dark');
        }
        
        this.updateGeneratedConfig();
    },
    
    generateDarkVariant: function(lightColor, colorName) {
        // Special handling for system colors
        if (colorName === 'background') {
            return '#0f0f0f';
        }
        if (colorName === 'surface') {
            return '#1a1a1a';
        }
        if (colorName === 'text') {
            return '#f3f4f6';
        }
        if (colorName === 'text-secondary' || colorName === 'text_secondary') {
            return '#9ca3af';
        }
        
        // For other colors, brighten them for dark mode
        // This is a simplified version - could be enhanced
        return this.brightenColor(lightColor, 20);
    },
    
    brightenColor: function(hex, percent) {
        // Simple color brightening
        hex = hex.replace('#', '');
        var r = parseInt(hex.substr(0, 2), 16);
        var g = parseInt(hex.substr(2, 2), 16);
        var b = parseInt(hex.substr(4, 2), 16);
        
        r = Math.min(255, r + (255 - r) * percent / 100);
        g = Math.min(255, g + (255 - g) * percent / 100);
        b = Math.min(255, b + (255 - b) * percent / 100);
        
        return '#' + 
            Math.round(r).toString(16).padStart(2, '0') +
            Math.round(g).toString(16).padStart(2, '0') +
            Math.round(b).toString(16).padStart(2, '0');
    },
    
    optimizeDarkModeContrast: function() {
        // Placeholder for contrast optimization
        console.log('Optimizing dark mode contrast for WCAG AA compliance...');
        // This would check contrast ratios and adjust colors
        this.updateGeneratedConfig();
    },
    
    resetToDefaults: function() {
        var self = this;
        
        // Reset light colors
        Object.keys(this.defaultLightColors).forEach(function(colorName) {
            self.lightColors[colorName] = self.defaultLightColors[colorName];
        });
        
        // Reset dark colors
        Object.keys(this.defaultDarkColors).forEach(function(colorName) {
            self.darkColors[colorName] = self.defaultDarkColors[colorName];
        });
        
        // Re-render both modes
        this.renderColorPickers('light');
        this.renderColorPickers('dark');
        
        // Update preview
        this.switchPreviewMode(this.currentPreviewMode);
        this.updateGeneratedConfig();
    },
    
    updateGeneratedConfig: function() {
        var config = this.generatePythonConfig();
        var textarea = document.getElementById('config-textarea');
        if (textarea) {
            textarea.value = config;
        }
    },
    
    generatePythonConfig: function() {
        var timestamp = new Date().toISOString().split('T')[0];
        var output = '';
        
        output += '# Django Spellbook Theme Configuration\n';
        output += '# Generated by Theme Builder Wizard on ' + timestamp + '\n';
        output += '# Add this to your Django settings.py file\n\n';
        
        output += 'SPELLBOOK_THEME = {\n';
        output += "    'name': 'custom',\n";
        output += "    'modes': {\n";
        
        // Light mode
        output += "        'light': {\n";
        output += "            'colors': {\n";
        
        var self = this;
        Object.keys(this.lightColors).forEach(function(colorName) {
            var colorValue = self.lightColors[colorName];
            var pythonKey = colorName.replace(/-/g, '_');
            output += "                '" + pythonKey + "': '" + colorValue + "',\n";
        });
        
        output += "            },\n";
        output += "            'generate_variants': True,\n";
        output += "        },\n";
        
        // Dark mode
        output += "        'dark': {\n";
        output += "            'colors': {\n";
        
        Object.keys(this.darkColors).forEach(function(colorName) {
            var colorValue = self.darkColors[colorName];
            var pythonKey = colorName.replace(/-/g, '_');
            output += "                '" + pythonKey + "': '" + colorValue + "',\n";
        });
        
        output += "            },\n";
        output += "            'generate_variants': True,\n";
        output += "        }\n";
        output += "    }\n";
        output += "}\n";
        
        return output;
    },
    
    copyConfigToClipboard: function() {
        var textarea = document.getElementById('config-textarea');
        var button = document.getElementById('copy-config-btn');
        
        if (textarea && button) {
            try {
                textarea.select();
                document.execCommand('copy');
                
                var originalHTML = button.innerHTML;
                button.innerHTML = '<span>✅</span><span>Copied!</span>';
                
                setTimeout(function() {
                    button.innerHTML = originalHTML;
                }, 2000);
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        }
    },
    
    downloadConfig: function() {
        var config = this.generatePythonConfig();
        var timestamp = new Date().toISOString().split('T')[0];
        var filename = 'spellbook_theme_' + timestamp + '.py';
        
        var blob = new Blob([config], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
    
    isValidHex: function(hex) {
        return /^#?[0-9A-Fa-f]{3}$|^#?[0-9A-Fa-f]{6}$/.test(hex);
    },
    
    normalizeHex: function(hex) {
        if (!hex) return '#000000';
        
        hex = hex.replace('#', '');
        
        if (hex.length === 3) {
            hex = hex.split('').map(function(char) { 
                return char + char; 
            }).join('');
        }
        
        if (hex.length !== 6) {
            return '#000000';
        }
        
        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
            return '#000000';
        }
        
        return '#' + hex.toUpperCase();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting Mode-Aware Theme Builder...');
    ThemeBuilder.init();
});

// Also try immediate initialization if DOM is already ready
if (document.readyState !== 'loading') {
    ThemeBuilder.init();
}