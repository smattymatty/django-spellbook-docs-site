# api/tests/test_spellblock_registry_api.py

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django_spellbook.blocks import SpellBlockRegistry
from django_spellbook.blocks.base import BasicSpellBlock


class MockSpellBlock(BasicSpellBlock):
    """Mock SpellBlock for testing purposes"""
    name = 'test_block'
    template = 'test/test_block.html'
    
    DEFAULT_TITLE = "Test Title"
    DEFAULT_COLOR = "blue"
    DEFAULT_ENABLED = True
    
    def get_context(self):
        context = super().get_context()
        context['title'] = self.kwargs.get('title', self.DEFAULT_TITLE)
        context['color'] = self.kwargs.get('color', self.DEFAULT_COLOR)
        context['enabled'] = self.kwargs.get('enabled', self.DEFAULT_ENABLED)
        return context


class AnotherMockSpellBlock(BasicSpellBlock):
    """Another mock SpellBlock for testing - uses kwargs.get without DEFAULT_"""
    name = 'another_test'
    template = 'test/another_test.html'
    
    DEFAULT_SIZE = "medium"
    
    def get_context(self):
        context = super().get_context()
        context['size'] = self.kwargs.get('size', self.DEFAULT_SIZE)
        # This block also has parameters only in get_context (no DEFAULT_ prefix)
        context['style'] = self.kwargs.get('style', 'modern')
        context['visible'] = self.kwargs.get('visible', True)
        return context


class SpellBlockRegistryAPITest(TestCase):
    """Test cases for SpellBlock registry API endpoint"""
    
    def setUp(self):
        """Set up test client and register test blocks"""
        self.client = APIClient()
        self.url = reverse('api:spellblock-registry')
        
        # Store original registry state
        self.original_registry = SpellBlockRegistry._registry.copy()
        
        # Clear registry and register test blocks
        SpellBlockRegistry._registry.clear()
        SpellBlockRegistry._registry['test_block'] = MockSpellBlock
        SpellBlockRegistry._registry['another_test'] = AnotherMockSpellBlock
    
    def tearDown(self):
        """Restore original registry state"""
        SpellBlockRegistry._registry.clear()
        SpellBlockRegistry._registry.update(self.original_registry)
    
    def test_spellblock_registry_get_success(self):
        """Test successful GET request to SpellBlock registry endpoint"""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('blocks', response.data)
        self.assertIn('count', response.data)
        
        # Check that we have our test blocks
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(len(response.data['blocks']), 2)
    
    def test_spellblock_registry_block_structure(self):
        """Test that returned blocks have correct structure"""
        response = self.client.get(self.url)
        
        blocks = response.data['blocks']
        test_block = next((b for b in blocks if b['name'] == 'test_block'), None)
        
        self.assertIsNotNone(test_block)
        self.assertEqual(test_block['name'], 'test_block')
        self.assertEqual(test_block['class_name'], 'MockSpellBlock')
        self.assertIn('description', test_block)
        self.assertIn('parameters', test_block)
        # Template field should not be exposed in API
        self.assertNotIn('template', test_block)
    
    def test_spellblock_registry_parameters_extraction(self):
        """Test that DEFAULT_ parameters and get_context parameters are correctly extracted"""
        response = self.client.get(self.url)
        
        blocks = response.data['blocks']
        test_block = next((b for b in blocks if b['name'] == 'test_block'), None)
        
        self.assertIsNotNone(test_block)
        parameters = test_block['parameters']
        
        # Check that DEFAULT_ attributes are extracted as parameters
        self.assertIn('title', parameters)
        self.assertIn('color', parameters)
        self.assertIn('enabled', parameters)
        
        # Check parameter structure for DEFAULT_ attributes
        title_param = parameters['title']
        self.assertEqual(title_param['default'], 'Test Title')
        self.assertEqual(title_param['type'], 'str')
        self.assertFalse(title_param['required'])
        
        color_param = parameters['color']
        self.assertEqual(color_param['default'], 'blue')
        self.assertEqual(color_param['type'], 'str')
        
        enabled_param = parameters['enabled']
        self.assertEqual(enabled_param['default'], True)
        self.assertEqual(enabled_param['type'], 'bool')
        
        # Test that parameters from get_context() method are also extracted
        # (The mock blocks use self.kwargs.get in their get_context methods)
        # Since the API extracts from both DEFAULT_ and kwargs.get patterns,
        # we should have all parameters regardless of source
    
    def test_spellblock_registry_empty_registry(self):
        """Test API response when registry is empty"""
        SpellBlockRegistry._registry.clear()
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['blocks']), 0)
    
    def test_spellblock_registry_block_with_get_context_parameters(self):
        """Test block that has both DEFAULT_ and get_context parameters"""
        response = self.client.get(self.url)
        
        blocks = response.data['blocks']
        another_block = next((b for b in blocks if b['name'] == 'another_test'), None)
        
        self.assertIsNotNone(another_block)
        self.assertEqual(another_block['name'], 'another_test')
        
        parameters = another_block['parameters']
        
        # Should have DEFAULT_ parameter
        self.assertIn('size', parameters)
        self.assertEqual(parameters['size']['default'], 'medium')
        
        # Should also have parameters extracted from get_context kwargs.get calls
        self.assertIn('style', parameters)
        self.assertEqual(parameters['style']['default'], 'modern')
        
        self.assertIn('visible', parameters)
        self.assertEqual(parameters['visible']['default'], True)
        self.assertEqual(parameters['visible']['type'], 'bool')
    
    def test_spellblock_registry_block_description(self):
        """Test that block descriptions are included"""
        response = self.client.get(self.url)
        
        blocks = response.data['blocks']
        
        for block in blocks:
            self.assertIn('description', block)
            self.assertIsInstance(block['description'], str)
            self.assertTrue(len(block['description']) > 0)
    
    def test_spellblock_registry_method_not_allowed(self):
        """Test that only GET method is allowed"""
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        response = self.client.put(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_spellblock_registry_content_type(self):
        """Test that response has correct content type"""
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['content-type'], 'application/json')
    
    def test_spellblock_registry_with_real_blocks(self):
        """Test with real registered blocks from the application"""
        # Restore original registry to test with real blocks
        SpellBlockRegistry._registry.clear()
        SpellBlockRegistry._registry.update(self.original_registry)
        
        # Import spellblocks to ensure they're registered
        try:
            import base.spellblocks
        except ImportError:
            pass
        
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # If we have real blocks registered, test their structure
        if response.data['count'] > 0:
            blocks = response.data['blocks']
            for block in blocks:
                # Each block should have required fields
                self.assertIn('name', block)
                self.assertIn('class_name', block)
                self.assertIn('description', block)
                self.assertIn('parameters', block)
                
                # Name should be a non-empty string
                self.assertIsInstance(block['name'], str)
                self.assertTrue(len(block['name']) > 0)
    
    def test_spellblock_registry_error_handling(self):
        """Test error handling when registry access fails"""
        # Temporarily break the registry to test error handling
        original_registry = SpellBlockRegistry._registry
        SpellBlockRegistry._registry = None
        
        try:
            response = self.client.get(self.url)
            # Should return 500 error when registry is broken
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertIn('error', response.data)
        finally:
            # Restore registry
            SpellBlockRegistry._registry = original_registry


class SpellBlockRegistryIntegrationTest(TestCase):
    """Integration tests for SpellBlock registry API"""
    
    def test_real_application_blocks(self):
        """Test that the API works with real application SpellBlocks"""
        # Import base spellblocks to register them
        try:
            import base.spellblocks
        except ImportError:
            self.skipTest("base.spellblocks not available")
        
        client = APIClient()
        url = reverse('api:spellblock-registry')
        
        response = client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Should have at least the label_seperator block from base.spellblocks
        blocks = response.data.get('blocks', [])
        block_names = [block['name'] for block in blocks]
        
        # Check if we have the label_seperator block
        if 'label_seperator' in block_names:
            label_block = next((b for b in blocks if b['name'] == 'label_seperator'), None)
            
            self.assertIsNotNone(label_block)
            self.assertEqual(label_block['name'], 'label_seperator')
            self.assertEqual(label_block['class_name'], 'LabelSeperatorSpellBlock')
            # Template should not be exposed in API
            self.assertNotIn('template', label_block)
            
            # Should have default parameters
            parameters = label_block['parameters']
            expected_params = ['align', 'text_color', 'bg_color']
            
            for param in expected_params:
                self.assertIn(param, parameters, f"Parameter '{param}' should be present")
                self.assertIn('default', parameters[param])
                self.assertIn('type', parameters[param])
                self.assertIn('required', parameters[param])