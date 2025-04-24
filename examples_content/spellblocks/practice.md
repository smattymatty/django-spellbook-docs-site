# Practice SpellBlock Showcase

The Practice SpellBlock provides a structured format for exercises, challenges, and hands-on activities in your documentation. This guide demonstrates all the capabilities and variations of the Practice block.

## Basic Practice Block

A Practice block includes metadata about the exercise and the exercise content itself:

```django
{~ practice difficulty="Beginner" timeframe="15-20 minutes" impact="Medium" focus="Django Models" ~}
### Create a Blog Model

Create a Django model for a simple blog with the following fields:

- Title (CharField)
- Content (TextField)
- Publication date (DateTimeField)
- Author (ForeignKey to User)
- Status (CharField with choices)

Implement the `__str__` method and add a Meta class with proper ordering.
{~~}
```

{~ practice difficulty="Beginner" timeframe="15-20 minutes" impact="Medium" focus="Django Models" ~}
### Create a Blog Model

Create a Django model for a simple blog with the following fields:

- Title (CharField)
- Content (TextField)
- Publication date (DateTimeField)
- Author (ForeignKey to User)
- Status (CharField with choices)

Implement the `__str__` method and add a Meta class with proper ordering.
{~~}

## Practice Block Metadata

The Practice block supports several metadata fields to help users understand the exercise.

### Difficulty Levels

```django
{~ practice difficulty="Beginner" timeframe="10 minutes" impact="Low" focus="Django Templates" ~}
### Basic Template Inheritance

Create a base template and a child template that extends it.
{~~}
```

{~ practice difficulty="Beginner" timeframe="10 minutes" impact="Low" focus="Django Templates" ~}
### Basic Template Inheritance

Create a base template and a child template that extends it.
{~~}

```django
{~ practice difficulty="Intermediate" timeframe="30 minutes" impact="Medium" focus="Django Forms" ~}
### Custom Form Validation

Create a form with custom validation logic for email and password fields.
{~~}
```

{~ practice difficulty="Intermediate" timeframe="30 minutes" impact="Medium" focus="Django Forms" ~}
### Custom Form Validation

Create a form with custom validation logic for email and password fields.
{~~}

```django
{~ practice difficulty="Advanced" timeframe="1-2 hours" impact="High" focus="Django ORM" ~}
### Complex Database Queries

Implement a view that uses advanced ORM features:

- Aggregation
- Annotation
- Window functions
- Subqueries
{~~}
```

{~ practice difficulty="Advanced" timeframe="1-2 hours" impact="High" focus="Django ORM" ~}
### Complex Database Queries

Implement a view that uses advanced ORM features:

- Aggregation
- Annotation
- Window functions
- Subqueries
{~~}

### Impact Levels

Impact indicates how valuable completing the practice will be:

```django
{~ practice difficulty="Beginner" timeframe="15 minutes" impact="Very High" focus="Project Structure" ~}
### Setting Up a Django Project

Create a new Django project with a proper directory structure and initial settings.
{~~}
```

{~ practice difficulty="Beginner" timeframe="15 minutes" impact="Very High" focus="Project Structure" ~}
### Setting Up a Django Project

Create a new Django project with a proper directory structure and initial settings.
{~~}

### Time Commitment

The timeframe helps users decide when to tackle the practice:

```django
{~ practice difficulty="Intermediate" timeframe="5 minutes" impact="Medium" focus="Django Admin" ~}
### Quick Admin Customization

Modify the admin display for a model to show more fields in the list view.
{~~}
```

{~ practice difficulty="Intermediate" timeframe="5 minutes" impact="Medium" focus="Django Admin" ~}
### Quick Admin Customization

Modify the admin display for a model to show more fields in the list view.
{~~}

```django
{~ practice difficulty="Advanced" timeframe="2-3 hours" impact="High" focus="Performance" ~}
### Database Optimization

Profile and optimize a Django application experiencing slow database queries.
{~~}
```

{~ practice difficulty="Advanced" timeframe="2-3 hours" impact="High" focus="Performance" ~}
### Database Optimization

Profile and optimize a Django application experiencing slow database queries.
{~~}

### Focus Areas

The focus area helps users find practices relevant to their learning goals:

```django
{~ practice difficulty="Intermediate" timeframe="45 minutes" impact="Medium" focus="Authentication" ~}
### Custom User Model

Implement a custom user model with additional fields and authentication methods.
{~~}
```

{~ practice difficulty="Intermediate" timeframe="45 minutes" impact="Medium" focus="Authentication" ~}
### Custom User Model

Implement a custom user model with additional fields and authentication methods.
{~~}

## Formatting Inside Practice Blocks

Practice blocks support full markdown formatting for rich content presentation.

### Lists and Steps

```django
{~ practice difficulty="Intermediate" timeframe="25 minutes" impact="Medium" focus="Class-Based Views" ~}
### List and Detail Views

Implement these class-based views:

1. A ListView that:

   - Displays all published articles
   - Includes pagination (10 per page)
   - Has a search feature

2. A DetailView that:

   - Shows a single article with all its details
   - Handles 404 errors gracefully
   - Includes a "related articles" section

**Bonus challenge:** Add a comment form to the detail view.
{~~}
```

{~ practice difficulty="Intermediate" timeframe="25 minutes" impact="Medium" focus="Class-Based Views" ~}
### List and Detail Views

Implement these class-based views:

1. A ListView that:

   - Displays all published articles
   - Includes pagination (10 per page)
   - Has a search feature

2. A DetailView that:

   - Shows a single article with all its details
   - Handles 404 errors gracefully
   - Includes a "related articles" section

**Bonus challenge:** Add a comment form to the detail view.
{~~}

## Customizing Practice Blocks

### Custom CSS Classes

Add custom CSS classes to further style your practice blocks:

```django
{~ practice difficulty="Advanced" timeframe="1 hour" impact="High" focus="Deployment" class="sb-border-primary sb-border-2" ~}
### Deploy to Production

Set up a production environment with:

- Gunicorn
- Nginx
- PostgreSQL
- Redis cache
{~~}
```

{~ practice difficulty="Advanced" timeframe="1 hour" impact="High" focus="Deployment" class="sb-border-primary sb-border-2" ~}
### Deploy to Production

Set up a production environment with:

- Gunicorn
- Nginx
- PostgreSQL
- Redis cache
{~~}

## Practice Block Use Cases

### Tutorial Exercises

```django
{~ practice difficulty="Beginner" timeframe="30 minutes" impact="High" focus="Django Forms" ~}
### Contact Form Implementation

In this exercise, you'll create a fully functional contact form:

1. Create a Django form class with these fields:

   - Name
   - Email
   - Subject
   - Message

2. Create a view that:

   - Renders the empty form on GET
   - Validates the form on POST
   - Sends an email when valid
   - Shows a success message

3. Add a template with:

   - The form rendered with proper styling
   - Error message display
   - A success message area

**Deliverable:** A working contact form that sends emails and validates input.
{~~}
```

{~ practice difficulty="Beginner" timeframe="30 minutes" impact="High" focus="Django Forms" ~}
### Contact Form Implementation

In this exercise, you'll create a fully functional contact form:

1. Create a Django form class with these fields:

   - Name
   - Email
   - Subject
   - Message

2. Create a view that:

   - Renders the empty form on GET
   - Validates the form on POST
   - Sends an email when valid
   - Shows a success message

3. Add a template with:

   - The form rendered with proper styling
   - Error message display
   - A success message area

**Deliverable:** A working contact form that sends emails and validates input.
{~~}

### Project Exercises

```django
{~ practice difficulty="Advanced" timeframe="2-3 hours" impact="Very High" focus="Full-stack Implementation" ~}
### Building a REST API with Django Rest Framework

Create a complete REST API for a blog application:

1. Design and implement these models:

   - Post (with title, content, author, publication date)
   - Category (with name, description)
   - Comment (with content, author, post reference)

2. Create serializers for each model:

   - Include proper validation
   - Use nested serializers where appropriate
   - Implement custom methods as needed

3. Implement ViewSets with:

   - Proper permissions (admin can do everything, authors can edit their own content)
   - Filtering and searching
   - Pagination

4. Set up proper URL routing with a router

5. Add documentation using drf-yasg or similar

**Bonus:** Add automated tests for your API endpoints.
{~~}
```

{~ practice difficulty="Advanced" timeframe="2-3 hours" impact="Very High" focus="Full-stack Implementation" ~}
### Building a REST API with Django Rest Framework

Create a complete REST API for a blog application:

1. Design and implement these models:

   - Post (with title, content, author, publication date)
   - Category (with name, description)
   - Comment (with content, author, post reference)

2. Create serializers for each model:

   - Include proper validation
   - Use nested serializers where appropriate
   - Implement custom methods as needed

3. Implement ViewSets with:

   - Proper permissions (admin can do everything, authors can edit their own content)
   - Filtering and searching
   - Pagination

4. Set up proper URL routing with a router

5. Add documentation using drf-yasg or similar

**Bonus:** Add automated tests for your API endpoints.
{~~}

## Best Practices

{~ alert type="info" ~}
### When to Use Practice Blocks

Practice blocks are ideal for:

* Tutorials and educational content
* Documentation that teaches concepts
* Reinforcing theoretical concepts with practical exercises
* Providing hands-on challenges to solidify understanding

Use practice blocks after explaining concepts to give readers a chance to apply what they've learned.
{~~}

### Creating Effective Practice Exercises

{~ alert type="success" ~}
For effective practice exercises:

* Clearly define the objective
* Provide enough context and starting points
* Make difficulty level appropriate for the target audience
* Include success criteria or expected outcomes
* Consider providing hints or partial solutions for more complex tasks
{~~}

---

{~ practice difficulty="Beginner" timeframe="10-15 minutes" impact="Medium" focus="Documentation" ~}
### Practice Block Challenge

Create your own practice blocks:

1. Write a beginner-level practice for a simple concept
2. Create an intermediate-level practice with code examples
3. Design an advanced practice with multiple steps and deliverables
4. Try customizing a practice block with additional classes

Ensure your practice blocks include clear instructions and success criteria!
{~~}