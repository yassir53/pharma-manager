from django.test import TestCase
from .models import Category



class CategoryAPITest(TestCase):
    def test_category_list(self):
        Category.objects.create(nom='Antibiotiques', description='Médicaments antibiotiques')
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)

    def test_category_retrieval(self):
        category = Category.objects.create(nom='Antibiotiques', description='Médicaments antibiotiques')
        response = self.client.get(f'/api/categories/{category.pk}/')
        self.assertEqual(response.status_code, 200)

    def test_category_creation(self):
        data = {'nom': 'Antidouleurs', 'description': 'Médicaments antidouleurs'}
        response = self.client.post('/api/categories/create/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nom'], 'Antidouleurs')
        self.assertEqual(response.data['description'], 'Médicaments antidouleurs')

    def test_category_update(self):
        category = Category.objects.create(nom='Antibiotiques', description='Médicaments antibiotiques')
        data = {'nom': 'Antidouleurs', 'description': 'Médicaments antidouleurs'}
        response = self.client.put(f'/api/categories/{category.pk}/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nom'], 'Antidouleurs')
        self.assertEqual(response.data['description'], 'Médicaments antidouleurs')

    def test_category_deletion(self):
        category = Category.objects.create(nom='Antibiotiques', description='Médicaments antibiotiques')
        pk = category.pk
        response = self.client.delete(f'/api/categories/{pk}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Category.objects.filter(pk=pk).exists())