# grimoire_generator/registry.py

class BlockRegistry:
    def __init__(self):
        self.blocks = {}

    def register(self, name):
        """
        Decorator to register a custom block.

        Args:
            name (str): The name of the block.

        Returns:
            function: The decorator function.

        Example:
        >>> @block_registry.register('code_block')
        ... def code_block(content: str, **kwargs) -> str:
        ...     return f'<div class="code-block">{content}</div>'
        >>> block_registry.blocks
        {'code_block': <function code_block at 0x7f7d1c0c1d50>}
        """
        # TODO: fix doctest memory address change
        def decorator(func):
            self.blocks[name] = func
            return func
        return decorator


block_registry = BlockRegistry()

if __name__ == '__main__':
    import doctest
    doctest.testmod()
