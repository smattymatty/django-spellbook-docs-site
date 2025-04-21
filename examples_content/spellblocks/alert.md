# Alert SpellBlock Showcase

The Alert SpellBlock is a versatile component for highlighting important information in your documentation. This guide demonstrates all the capabilities and variations of the Alert block.

## Basic Alert Types

Alerts come in four standard types, each with its own color scheme and icon to convey different levels of importance.

### Info Alert (Default)

The default alert type is "info" - used for general information and notes.

```django
{~ alert ~}
This is a standard info alert without specifying a type.
{~~}
```

{~ alert ~}
This is a standard info alert without specifying a type.
{~~}

### Success Alert

Success alerts highlight positive messages, accomplishments, or correct approaches.

```django
{~ alert type="success" ~}
Great job! Your operation completed successfully.
{~~}
```

{~ alert type="success" ~}
Great job! Your operation completed successfully.
{~~}

### Warning Alert

Warning alerts call attention to potential issues or things to be careful about.

```django
{~ alert type="warning" ~}
Be careful! This action can't be undone.
{~~}
```

{~ alert type="warning" ~}
Be careful! This action can't be undone.
{~~}

### Danger Alert

Danger alerts highlight critical information or error conditions.

```django
{~ alert type="danger" ~}
Fatal error! Database connection failed.
{~~}
```

{~ alert type="danger" ~}
Fatal error! Database connection failed.
{~~}

## Formatting Inside Alerts

Alerts support full markdown formatting within their content, allowing rich text presentation.

### Text Formatting

```django
{~ alert ~}
You can use **bold**, *italic*, and `code` formatting inside alerts.

Even [links](https://example.com) work perfectly!
{~~}
```

{~ alert ~}
You can use **bold**, *italic*, and `code` formatting inside alerts.

Even [links](https://example.com) work perfectly!
{~~}

### Lists in Alerts

```django
{~ alert type="success" ~}
Follow these steps:

1. Install the package
2. Configure settings
3. Run migrations

Or alternatively:
* Use the quickstart script
* Follow the prompts
{~~}
```

{~ alert type="success" ~}
Follow these steps:

1. Install the package
2. Configure settings
3. Run migrations

Or alternatively:
* Use the quickstart script
* Follow the prompts
{~~}

## Customizing Alerts

### TODO: Adding Custom Classes

You can add custom CSS classes to further style your alerts:

```django
{~ alert type="warning" class="sb-p-4 sb-my-4" ~}
This alert has custom spacing.
{~~}
```

{~ alert type="warning" class="sb-p-4 sb-my-4 sb-border-dashed sb-border-2" ~}
This alert has custom spacing.
{~~}

### TODO: Adding a Title

You can add a title to your alert for additional context:

```django
{~ alert type="info" title="Installation Note" ~}
This feature requires Django 3.2 or higher.
{~~}
```

{~ alert type="info" title="Installation Note" ~}
This feature requires Django 3.2 or higher.
{~~}

### TODO: Dismissible Alerts

Make alerts dismissible with the `dismissible` parameter:

```django
{~ alert type="success" dismissible="true" ~}
Click the X to dismiss this alert!
{~~}
```

{~ alert type="success" dismissible="true" ~}
Click the X to dismiss this alert!
{~~}

## Nested SpellBlocks

Alerts can contain other SpellBlocks for complex content arrangements:

```django
{~ alert type="info" ~}
Did you know?

{~ quote author="Albert Einstein" ~}
The only source of knowledge is experience.
{~~}

This is why hands-on practice is so important!
{~~}
```

{~ alert type="info" ~}
Did you know?

{~ quote author="Albert Einstein" ~}
The only source of knowledge is experience.
{~~}

This is why hands-on practice is so important!
{~~}

## Best Practices

{~ alert type="success" ~}
### When to Use Alerts

Alerts are perfect for:
* Important notes and warnings
* Highlighting key information
* Providing tips and best practices
* Pointing out version-specific information

Keep alerts brief and focused for maximum impact.
{~~}

{~ alert type="warning" ~}
### Alert Overuse

Too many alerts can cause "alert fatigue" - where readers start to ignore them.

Use alerts purposefully and sparingly for the most important information.
{~~}

## Error Handling

If you specify an invalid alert type, it will default to the "info" type:

```django
{~ alert type="not-a-valid-type" ~}
This will render as an info alert.
{~~}
```

{~ alert type="not-a-valid-type" ~}
This will render as an info alert.
{~~}

---

{~ practice difficulty="Beginner" timeframe="5-10 minutes" impact="Medium" focus="Documentation" ~}
### Alert Practice Challenge

Try creating your own alert blocks:

1. Create an info alert about a feature you're working on
2. Create a warning alert about potential pitfalls
3. Create a success alert with a list of benefits
4. Create a danger alert with code showing an anti-pattern

Experiment with different formatting inside your alerts!
{~~}