from typing import Dict, Any, Callable
import re


def sort_structure(structure: Dict[str, Any], sort_key: str = 'name', reverse: bool = False) -> Dict[str, Any]:
    """
    Sort the grimoire structure based on the specified key while preserving all properties.

    Args:
        structure (Dict[str, Any]): The grimoire structure to sort.
        sort_key (str): The key to sort by. Options: 'name', 'title', 'last_modified'.
        reverse (bool): Whether to sort in descending order.

    Returns:
        Dict[str, Any]: The sorted grimoire structure with all properties preserved.
    """
    def get_sort_value(item: tuple) -> Any:
        """
        Get the sort value for a given item.

        Args:
            item (tuple): The item to get the sort value for.

        Returns:
            Any: The sort value for the item.
        """
        key, value = item
        if sort_key == 'name':
            return key
        elif sort_key == 'title':
            return value.get('title', key) if isinstance(value, dict) else key
        elif sort_key == 'last_modified':
            return value.get('last_modified', '') if isinstance(value, dict) else ''
        else:
            return key  # Default to sorting by name

    def sort_recursive(struct: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sort the structure recursively.

        Args:
            struct (Dict[str, Any]): The structure to sort.

        Returns:
            Dict[str, Any]: The sorted structure.
        """
        sorted_items = sorted(
            struct.items(), key=get_sort_value, reverse=reverse)
        return {
            k: (
                {**v, 'children': sort_recursive(v['children'])
                 } if 'children' in v else v
            ) if isinstance(v, dict) else v
            for k, v in sorted_items
        }

    try:
        return sort_recursive(structure)
    except Exception as e:
        print(f"Error sorting structure: {str(e)}")
        return structure


def parse_attributes(attributes: str) -> dict:
    """
    Parse attributes from a string.

    Args:
        attributes (str): The attributes string.

    Returns:
        dict: A dictionary of attribute names and values.

    Example:
    >>> attributes = 'class="btn btn-primary" id="submit-btn" data-toggle="modal"'
    >>> parse_attributes(attributes)
    {'class': 'btn btn-primary', 'id': 'submit-btn', 'data-toggle': 'modal'}
    """
    try:
        attr_dict = {}
        for attr in re.findall(r'([\w-]+)=[\'"]([^\'"]*)[\'"]', attributes):
            attr_dict[attr[0]] = attr[1]
        return attr_dict
    except Exception as e:
        print(f"Error parsing attributes: {str(e)}")
        raise e


def dict_to_attributes_str(**kwargs) -> str:
    """
    Parse attributes from a dictionary of keyword arguments.
    This is to be used in html custom elements.

    Args:
        **kwargs: The keyword arguments.

    Returns:
        str: The attributes string.

    Example:

    """
    return ' '.join(
        [f'{k.replace("_", "-")}="{v}"' for k, v in kwargs.items()])


if __name__ == '__main__':
    import doctest
    doctest.testmod()
