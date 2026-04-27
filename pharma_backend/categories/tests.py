from django.test import TestCase

class CategoryTests(TestCase):
    def test_category_creation(self):
        response = self.client.post('/categories/create/', {'nom': 'Test Category', 'description': 'This is a test category.'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nom'], 'Test Category')
        self.assertEqual(response.data['description'], 'This is a test category.')

    def test_category_retrieval(self):
        self.client.post('/categories/create/', {'nom': 'Test Category', 'description': 'This is a test category.'})
        response = self.client.get('/categories/Test Category/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nom'], 'Test Category')
        self.assertEqual(response.data['description'], 'This is a test category.')

    def test_category_update(self):
        self.client.post('/categories/create/', {'nom': 'Test Category', 'description': 'This is a test category.'})
        response = self.client.put('/categories/Test Category/', {'nom': 'Updated Category', 'description': 'This category has been updated.'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nom'], 'Updated Category')
        self.assertEqual(response.data['description'], 'This category has been updated.')

    def test_category_deletion(self):
        self.client.post('/categories/create/', {'nom': 'Test Category', 'description': 'This is a test category.'})
        response = self.client.delete('/categories/Test Category/')
        self.assertEqual(response.status_code, 204)
        response = self.client.get('/categories/Test Category/')
        self.assertEqual(response.status_code, 404)

    