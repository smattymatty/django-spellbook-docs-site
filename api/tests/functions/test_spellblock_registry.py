"""
Tests for spellblock registry helper functions.
"""

import unittest
from unittest.mock import Mock, patch, MagicMock
from django.test import TestCase

from api.logic.spellblock_registry import (
    extract_default_parameters,
    extract_kwargs_parameters,
    build_spellblock_registry,
    _get_block_description,
    _infer_parameter_type,
)


class TestExtractDefaultParameters(TestCase):
    """Test the extract_default_parameters function."""
    
    def test_extract_default_parameters_with_defaults(self):
        """Test extracting DEFAULT_ attributes from a mock class."""
        
        class MockBlock:
            DEFAULT_TITLE = "Default Title"
            DEFAULT_VISIBLE = True
            DEFAULT_COUNT = 5
            DEFAULT_RATIO = 3.14
            regular_attribute = "not a default"
        
        result = extract_default_parameters(MockBlock)
        
        expected = {
            "title": {
                "default": "Default Title",
                "type": "str",
                "required": False,
            },
            "visible": {
                "default": True,
                "type": "bool",
                "required": False,
            },
            "count": {
                "default": 5,
                "type": "int",
                "required": False,
            },
            "ratio": {
                "default": 3.14,
                "type": "float",
                "required": False,
            },
        }
        
        self.assertEqual(result, expected)
    
    def test_extract_default_parameters_no_defaults(self):
        """Test with a class that has no DEFAULT_ attributes."""
        
        class MockBlock:
            some_attribute = "value"
            another_attribute = 123
        
        result = extract_default_parameters(MockBlock)
        self.assertEqual(result, {})
    
    def test_extract_default_parameters_empty_class(self):
        """Test with an empty class."""
        
        class MockBlock:
            pass
        
        result = extract_default_parameters(MockBlock)
        self.assertEqual(result, {})


class TestExtractKwargsParameters(TestCase):
    """Test the extract_kwargs_parameters function."""
    
    def test_extract_kwargs_parameters_basic(self):
        """Test extracting kwargs.get patterns from get_context method."""
        
        class MockBlock:
            def get_context(self):
                context = {}
                context['title'] = self.kwargs.get('title', 'Default Title')
                context['visible'] = self.kwargs.get('visible', True)
                context['count'] = self.kwargs.get('count', 0)
                return context
        
        result = extract_kwargs_parameters(MockBlock)
        
        expected = {
            "title": {
                "default": "Default Title",
                "type": "str",
                "required": False,
            },
            "visible": {
                "default": True,
                "type": "bool",
                "required": False,
            },
            "count": {
                "default": 0,
                "type": "int",
                "required": False,
            },
        }
        
        self.assertEqual(result, expected)
    
    def test_extract_kwargs_parameters_with_comments(self):
        """Test that commented lines are ignored."""
        
        class MockBlock:
            def get_context(self):
                context = {}
                # context['ignored'] = self.kwargs.get('ignored', 'should not appear')
                context['title'] = self.kwargs.get('title', 'Default Title')
                return context
        
        result = extract_kwargs_parameters(MockBlock)
        
        expected = {
            "title": {
                "default": "Default Title",
                "type": "str",
                "required": False,
            },
        }
        
        self.assertEqual(result, expected)
        self.assertNotIn("ignored", result)
    
    def test_extract_kwargs_parameters_no_get_context(self):
        """Test with a class that has no get_context method."""
        
        class MockBlock:
            pass
        
        result = extract_kwargs_parameters(MockBlock)
        self.assertEqual(result, {})
    
    def test_extract_kwargs_parameters_empty_defaults(self):
        """Test with kwargs.get calls that have no default values."""
        
        class MockBlock:
            def get_context(self):
                context = {}
                context['title'] = self.kwargs.get('title')
                context['description'] = self.kwargs.get('description', '')
                return context
        
        result = extract_kwargs_parameters(MockBlock)
        
        expected = {
            "title": {
                "default": "",
                "type": "str",
                "required": False,
            },
            "description": {
                "default": "",
                "type": "str",
                "required": False,
            },
        }
        
        self.assertEqual(result, expected)
    
    @patch('api.logic.spellblock_registry.logger')
    def test_extract_kwargs_parameters_inspection_error(self, mock_logger):
        """Test handling of inspection errors."""
        
        class MockBlock:
            def get_context(self):
                pass
        
        with patch('inspect.getsource', side_effect=OSError("Cannot get source")):
            result = extract_kwargs_parameters(MockBlock)
            
            self.assertEqual(result, {})
            mock_logger.warning.assert_called_once()


class TestBuildSpellblockRegistry(TestCase):
    """Test the build_spellblock_registry function."""
    
    @patch('api.logic.spellblock_registry.SpellBlockRegistry')
    @patch('api.logic.spellblock_registry.extract_default_parameters')
    @patch('api.logic.spellblock_registry.extract_kwargs_parameters')
    def test_build_spellblock_registry_success(self, mock_kwargs_extract, mock_default_extract, mock_registry):
        """Test successful registry building."""
        
        # Mock the registry
        mock_block_class = Mock()
        mock_block_class.__name__ = "TestBlock"
        mock_block_class.__doc__ = "Test block description"
        
        mock_registry._registry.items.return_value = [
            ("test", mock_block_class),
            ("card", mock_block_class),
        ]
        
        # Mock the parameter extraction functions
        mock_default_extract.return_value = {
            "title": {"default": "Default", "type": "str", "required": False}
        }
        mock_kwargs_extract.return_value = {
            "visible": {"default": True, "type": "bool", "required": False}
        }
        
        result = build_spellblock_registry()
        
        expected = [
            {
                "name": "test",
                "class_name": "TestBlock",
                "description": "Test block description",
                "parameters": {
                    "title": {"default": "Default", "type": "str", "required": False},
                    "visible": {"default": True, "type": "bool", "required": False},
                },
            },
            {
                "name": "card",
                "class_name": "TestBlock", 
                "description": "Test block description",
                "parameters": {
                    "title": {"default": "Default", "type": "str", "required": False},
                    "visible": {"default": True, "type": "bool", "required": False},
                },
            },
        ]
        
        self.assertEqual(result, expected)
    
    @patch('api.logic.spellblock_registry.SpellBlockRegistry')
    def test_build_spellblock_registry_skips_test_blocks(self, mock_registry):
        """Test that test blocks are skipped."""
        
        mock_block_class = Mock()
        mock_block_class.__name__ = "TestBlock"
        
        mock_registry._registry.items.return_value = [
            ("argstest", mock_block_class),
            ("selfclosing", mock_block_class),
            ("simple", mock_block_class),
            ("card", mock_block_class),
        ]
        
        result = build_spellblock_registry()
        
        # Should only have the "card" block, not the test blocks
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["name"], "card")


class TestGetBlockDescription(TestCase):
    """Test the _get_block_description helper function."""
    
    def test_get_block_description_with_docstring(self):
        """Test getting description from class docstring."""
        
        class MockBlock:
            """This is a test block."""
            pass
        
        result = _get_block_description(MockBlock, "test")
        self.assertEqual(result, "This is a test block.")
    
    def test_get_block_description_without_docstring(self):
        """Test fallback description when no docstring exists."""
        
        class MockBlock:
            pass
        
        result = _get_block_description(MockBlock, "test")
        self.assertEqual(result, "SpellBlock: test")
    
    def test_get_block_description_none_docstring(self):
        """Test handling when __doc__ is explicitly None."""
        
        class MockBlock:
            __doc__ = None
        
        result = _get_block_description(MockBlock, "test")
        self.assertEqual(result, "SpellBlock: test")


class TestInferParameterType(TestCase):
    """Test the _infer_parameter_type helper function."""
    
    def test_infer_parameter_type_string(self):
        """Test string type inference."""
        result = _infer_parameter_type("hello world")
        self.assertEqual(result, ("str", "hello world"))
    
    def test_infer_parameter_type_empty_string(self):
        """Test empty string handling."""
        result = _infer_parameter_type("")
        self.assertEqual(result, ("str", ""))
    
    def test_infer_parameter_type_boolean_true(self):
        """Test boolean true inference."""
        result = _infer_parameter_type("true")
        self.assertEqual(result, ("bool", True))
        
        result = _infer_parameter_type("True")
        self.assertEqual(result, ("bool", True))
    
    def test_infer_parameter_type_boolean_false(self):
        """Test boolean false inference."""
        result = _infer_parameter_type("false")
        self.assertEqual(result, ("bool", False))
        
        result = _infer_parameter_type("False")
        self.assertEqual(result, ("bool", False))
    
    def test_infer_parameter_type_integer_positive(self):
        """Test positive integer inference."""
        result = _infer_parameter_type("123")
        self.assertEqual(result, ("int", 123))
    
    def test_infer_parameter_type_integer_negative(self):
        """Test negative integer inference."""
        result = _infer_parameter_type("-123")
        self.assertEqual(result, ("int", -123))
    
    def test_infer_parameter_type_float(self):
        """Test float inference."""
        result = _infer_parameter_type("3.14")
        self.assertEqual(result, ("float", 3.14))
        
        result = _infer_parameter_type("-2.5")
        self.assertEqual(result, ("float", -2.5))
    
    def test_infer_parameter_type_invalid_float(self):
        """Test handling of invalid float values."""
        result = _infer_parameter_type("3.14.15")
        self.assertEqual(result, ("str", "3.14.15"))
    
    def test_infer_parameter_type_mixed_content(self):
        """Test strings with mixed content."""
        result = _infer_parameter_type("123abc")
        self.assertEqual(result, ("str", "123abc"))
        
        result = _infer_parameter_type("abc123")
        self.assertEqual(result, ("str", "abc123"))