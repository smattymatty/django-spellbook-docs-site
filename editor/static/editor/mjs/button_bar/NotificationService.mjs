// static/mjs/button_bar/NotificationService.mjs

import { NOTIFICATION_STYLES } from '../config/button_configs.mjs';

export class NotificationService {
    constructor(options = {}) {
        this.options = {
            duration: 3000,
            position: 'top-right',
            animationDuration: 300,
            maxNotifications: 5,
            ...options
        };
        
        this.notifications = new Map();
        this.container = null;
        this.notificationCounter = 0;
        
        this.createContainer();
    }

    /**
     * Create notification container
     * @private
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = this.getContainerStyles();
        document.body.appendChild(this.container);
    }

    /**
     * Get container styles based on position
     * @returns {string} CSS styles string
     * @private
     */
    getContainerStyles() {
        const baseStyles = `
            position: fixed;
            z-index: 10000;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;

        const positionStyles = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
            'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
        };

        return baseStyles + (positionStyles[this.options.position] || positionStyles['top-right']);
    }

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    show(message, type = 'info', options = {}) {
        const notificationId = `notification-${++this.notificationCounter}`;
        const config = { ...this.options, ...options };
        
        const notification = this.createNotification(message, type, config);
        this.notifications.set(notificationId, notification);
        
        // Remove oldest notification if we exceed max
        if (this.notifications.size > this.options.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.hide(oldestId);
        }
        
        this.container.appendChild(notification.element);
        this.animateIn(notification.element);
        
        // Auto-hide if duration is set
        if (config.duration > 0) {
            notification.timeout = setTimeout(() => {
                this.hide(notificationId);
            }, config.duration);
        }
        
        return notificationId;
    }

    /**
     * Create notification element
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     * @param {Object} config - Configuration options
     * @returns {Object} Notification object
     * @private
     */
    createNotification(message, type, config) {
        const element = document.createElement('div');
        element.className = `editor-notification notification-${type}`;
        element.style.cssText = this.getNotificationStyles(type);
        
        // Create notification content
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        
        // Add icon based on type
        const icon = this.getIconForType(type);
        if (icon) {
            const iconElement = document.createElement('span');
            iconElement.className = 'notification-icon';
            iconElement.textContent = icon;
            iconElement.style.cssText = 'font-size: 16px; flex-shrink: 0;';
            content.appendChild(iconElement);
        }
        
        // Add message
        const messageElement = document.createElement('span');
        messageElement.className = 'notification-message';
        messageElement.textContent = message;
        messageElement.style.cssText = 'flex: 1; line-height: 1.4;';
        content.appendChild(messageElement);
        
        // Add close button if persistent
        if (config.duration === 0) {
            const closeButton = document.createElement('button');
            closeButton.className = 'notification-close';
            closeButton.textContent = '×';
            closeButton.style.cssText = `
                background: none;
                border: none;
                color: inherit;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: 8px;
                line-height: 1;
                opacity: 0.7;
                transition: opacity 0.2s;
            `;
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.opacity = '1';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.opacity = '0.7';
            });
            content.appendChild(closeButton);
        }
        
        element.appendChild(content);
        
        return {
            element,
            type,
            message,
            timestamp: Date.now(),
            timeout: null
        };
    }

    /**
     * Get notification styles
     * @param {string} type - Notification type
     * @returns {string} CSS styles string
     * @private
     */
    getNotificationStyles(type) {
        const backgroundColor = NOTIFICATION_STYLES[type] || NOTIFICATION_STYLES.info;
        
        return `
            background-color: ${backgroundColor};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            cursor: default;
            transform: translateX(100%);
            opacity: 0;
            transition: all ${this.options.animationDuration}ms ease-out;
            max-width: 100%;
            word-wrap: break-word;
        `;
    }

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string|null} Icon character
     * @private
     */
    getIconForType(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || null;
    }

    /**
     * Animate notification in
     * @param {HTMLElement} element - Notification element
     * @private
     */
    animateIn(element) {
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    /**
     * Animate notification out
     * @param {HTMLElement} element - Notification element
     * @returns {Promise} Promise that resolves when animation completes
     * @private
     */
    animateOut(element) {
        return new Promise(resolve => {
            element.style.transform = 'translateX(100%)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                resolve();
            }, this.options.animationDuration);
        });
    }

    /**
     * Hide a notification
     * @param {string} notificationId - Notification ID to hide
     * @returns {Promise} Promise that resolves when notification is hidden
     */
    async hide(notificationId) {
        const notification = this.notifications.get(notificationId);
        if (!notification) return;
        
        // Clear timeout if it exists
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }
        
        // Animate out and remove
        await this.animateOut(notification.element);
        this.notifications.delete(notificationId);
    }

    /**
     * Hide all notifications
     * @returns {Promise} Promise that resolves when all notifications are hidden
     */
    async hideAll() {
        const hidePromises = Array.from(this.notifications.keys()).map(id => this.hide(id));
        await Promise.all(hidePromises);
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    error(message, options = {}) {
        return this.show(message, 'error', { duration: 5000, ...options });
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    warning(message, options = {}) {
        return this.show(message, 'warning', { duration: 4000, ...options });
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    /**
     * Show persistent notification (doesn't auto-hide)
     * @param {string} message - Message to display
     * @param {string} type - Notification type
     * @param {Object} options - Additional options
     * @returns {string} Notification ID
     */
    persistent(message, type = 'info', options = {}) {
        return this.show(message, type, { duration: 0, ...options });
    }

    /**
     * Get active notification count
     * @returns {number} Number of active notifications
     */
    getCount() {
        return this.notifications.size;
    }

    /**
     * Get all active notifications
     * @returns {Array} Array of notification objects
     */
    getAll() {
        return Array.from(this.notifications.values());
    }

    /**
     * Check if a notification exists
     * @param {string} notificationId - Notification ID to check
     * @returns {boolean} True if notification exists
     */
    exists(notificationId) {
        return this.notifications.has(notificationId);
    }

    /**
     * Update notification message
     * @param {string} notificationId - Notification ID
     * @param {string} newMessage - New message
     * @returns {boolean} True if updated successfully
     */
    updateMessage(notificationId, newMessage) {
        const notification = this.notifications.get(notificationId);
        if (!notification) return false;
        
        const messageElement = notification.element.querySelector('.notification-message');
        if (messageElement) {
            messageElement.textContent = newMessage;
            notification.message = newMessage;
            return true;
        }
        
        return false;
    }

    /**
     * Set notification position
     * @param {string} position - New position
     */
    setPosition(position) {
        this.options.position = position;
        if (this.container) {
            this.container.style.cssText = this.getContainerStyles();
        }
    }

    /**
     * Destroy the notification service
     */
    destroy() {
        // Clear all timeouts
        this.notifications.forEach(notification => {
            if (notification.timeout) {
                clearTimeout(notification.timeout);
            }
        });
        
        // Remove container
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.notifications.clear();
        this.container = null;
    }
}