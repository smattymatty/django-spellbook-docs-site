# Quick Insert Feature Documentation

## Overview

The Quick Insert feature enhances the SpellBlock insertion workflow by remembering the last used SpellBlock and providing a streamlined way to re-insert it. This feature transforms the main "Insert SpellBlock" button text to show the last used SpellBlock name, making it easy to quickly re-insert the same type.

## How It Works

### Initial State
- Button displays: "Insert SpellBlock" with ✨ icon
- Button has default styling (btn-accent class)
- Clicking inserts the default Card SpellBlock

### After SpellBlock Selection
- When a user selects a SpellBlock from the dropdown OR inserts the default Card
- Button text changes to: "Insert [SpellBlockName]" (e.g., "Insert Alert")
- Button tooltip updates to reflect the Quick Insert functionality
- No visual styling changes - keeps the same appearance

### Quick Insert Behavior
- Clicking the main button directly inserts the last used SpellBlock
- No dropdown selection required - immediate insertion
- Dropdown button (▼) remains available for selecting different SpellBlocks
- Notification shows "(Quick Insert)" to indicate the feature was used
- Button maintains standard styling - only the text content changes

## Technical Implementation

### ButtonStateManager Enhancements

The `ButtonStateManager` class now tracks:
- `lastUsedBlockName`: The identifier of the last used SpellBlock
- `lastUsedBlockDisplayName`: The human-readable name for UI display

Key methods added:
- `setLastUsedSpellBlock(blockName, displayName)`: Store the last used block
- `getLastUsedSpellBlock()`: Retrieve last used block information
- `clearLastUsedSpellBlock()`: Reset the Quick Insert state
- `isQuickInsertMode()`: Check if Quick Insert is active
- `updateSpellBlockButtonForQuickInsert()`: Update button appearance

### EventCoordinator Enhancements

The `EventCoordinator` class now handles:
- Tracking SpellBlock selections in `insertSelectedSpellBlock()`
- Quick Insert logic in `handleInsertSpellBlock()`
- New method `insertLastUsedSpellBlock()` for direct insertion

### Visual Styling

The Quick Insert feature uses minimal visual changes:
- No special CSS classes or color schemes
- No indicator badges or icons
- Button maintains standard appearance and styling
- Only the text content changes to reflect the last used SpellBlock

## User Experience Flow

1. **First Use**: User clicks "Insert SpellBlock" → default Card inserted → button becomes "Insert Card"
2. **Dropdown Selection**: User clicks dropdown → selects "Alert" → button becomes "Insert Alert"  
3. **Quick Insert**: User clicks "Insert Alert" → Alert SpellBlock inserted immediately
4. **Different Block**: User clicks dropdown → selects "Table" → button becomes "Insert Table"
5. **Continued Use**: User can quickly insert Tables or select different blocks via dropdown

## Benefits

### Efficiency Gains
- Reduces clicks for repeated SpellBlock insertion
- Eliminates need to navigate dropdown for common blocks
- Maintains quick access to full SpellBlock library

### Adaptive Interface
- Button intelligently adapts to user's workflow
- Text content clearly shows current Quick Insert state
- Preserves all existing functionality while adding convenience

### Workflow Enhancement
- Particularly useful for content authors who repeatedly use specific SpellBlocks
- Streamlines the creation of consistent content patterns
- Reduces cognitive load by remembering user preferences

## Implementation Notes

### State Persistence
- Quick Insert state is maintained only during the current session
- State is cleared when the editor is refreshed or reloaded
- No permanent storage of user preferences (by design)

### Error Handling
- Graceful fallback if last used SpellBlock template fails to load
- Clear error messages with specific SpellBlock names
- Automatic state cleanup on errors

### Compatibility
- Fully backward compatible with existing SpellBlock functionality
- No changes to existing keyboard shortcuts or dropdown behavior
- Works seamlessly with all existing SpellBlock types

## Testing

The feature includes comprehensive tests in `QuickInsert.test.mjs`:
- Initial state validation
- SpellBlock tracking functionality
- Button text and styling updates
- Quick Insert mode detection
- State clearing and reset
- Multiple selection scenarios

## Future Enhancements

Potential improvements could include:
- Keyboard shortcut for Quick Insert (currently uses same as regular insert)
- Most-frequently-used SpellBlock tracking
- Quick Insert history (last 3-5 blocks)
- User preference persistence across sessions
### Subtle visual indicators for Quick Insert state