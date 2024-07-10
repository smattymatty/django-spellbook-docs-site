# What is Django-Spellbook?

Django-Spellbook aims to allow developers to create dynamic, interactive web applications with minimal custom JavaScript. It bridges the gap between back-end and front-end development, enabling you to implement complex front-end behaviors directly within your Django templates.
In theory, you should be able to include many interactive elements such as navigation menus, hovered class changes, instant updates etc. with simple, easy to understand Django template tags.

* **Simplicity**: Add interactive elements using familiar Django template tags.
* **Productivity**: Achieve more with less code using pre-built modules.
* **Flexibility**: Works seamlessly with HTMX and Tailwind CSS, or standalone.
* **Maintainability**: Keep front-end logic close to your HTML structure for improved readability.
* **Gentle Learning Curve**: Easy to adopt for developers familiar with Django templates.

## How It Works

Django-Spellbook introduces a set of powerful "spells" (modules) that you can invoke in your templates. Here's a simple example using the ActionInvoker module:

```code
{ % load action_invoker_tags % }
{ % invoke_action "click" "add-class" "this" "my-button" config='class:active' % }
```

This spell adds the 'active' class to an element with the ID 'my-button' when it's clicked, all without writing a single line of JavaScript.

## Why Choose Django-Spellbook?

Django-Spellbook solves several common pain points in web development:

- Reduces the need for complex JavaScript setups
- Bridges the gap between back-end and front-end development
- Enables rapid prototyping of interactive features
- Promotes consistency in front-end interactions across your project

## Getting Started

Ready to add some magic to your Django project? Let's begin with a simple installation:

```code
pip install django-spellbook
```

Then, add 'django_spellbook' to your INSTALLED_APPS in settings.py:

```code
INSTALLED_APPS = [
    # ...
    'django_spellbook',
    # ...
]
```

Now you're ready to start casting spells in your templates!

## Next Steps

Explore our documentation to learn more about:

- [Available Modules](./modules.md)
- [Best Practices](./best-practices.md)
- [Advanced Usage](./advanced-usage.md)

Welcome to the world of Django-Spellbook, where crafting interactive web applications is as simple as casting a spell!