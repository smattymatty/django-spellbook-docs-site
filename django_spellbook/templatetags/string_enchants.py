from django import template

register = template.Library()


@register.filter
def strip(value):
    """
    Strips whitespace from the beginning and end of the value.

    Arguments:
        value (str): The value to be stripped.

    Returns:
        str: The stripped value.
    """
    return value.strip()


@register.filter
def concat(value, arg):
    """
    Concatenates the given argument to the value

    Arguments:
        value (str): The value to be concatenated.
        arg (str): The string to be concatenated to the value.

    Returns:
        str: The concatenated value.

    Example:
    >>> value = "Hello"
    >>> arg = ", World!"
    >>> concat(value, arg)
    'Hello, World!'

    """
    return str(value) + str(arg)


@register.filter
def split(value, arg):
    """
    Splits the value by the argument and returns a list.

    Arguments:
        value (str): The value to be split.
        arg (str): The string to split the value by.

    Returns:
        list: A list of strings.

    Example:
    >>> value = "Hello, World!"
    >>> arg = ", "
    >>> split(value, arg)
    ['Hello', 'World!']

    """
    return value.split(arg)


@register.filter
def replace(value, arg):
    """
    Replaces all occurrences of a string with another string.

    Arguments:
        value (str): The value to be replaced.
        arg (str): The string to replace the value with. 
            It should be in the format "old,new".
            This is to keep in line with the Django template syntax.

    Returns:
        str: The replaced value.

    Example:
    >>> value = "Hello, World!"
    >>> arg = "World!,Django!"
    >>> replace(value, arg)
    'Hello, Django!'
    >>> value = "This is a test"
    >>> arg = "This is a ,"
    >>> replace(value, arg)
    'test'
    """
    old, new = arg.split(',')
    return value.replace(old, new)


if __name__ == '__main__':
    import doctest
    doctest.testmod()
