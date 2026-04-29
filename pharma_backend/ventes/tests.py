from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from categories.models import Category
from medicaments.models import Medicament
from .models import Vente, LigneVente
from django.contrib.auth.models import User

class VenteAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin', password='password123')
        
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(
            nom='Antibiotiques',
            description='Médicaments antibiotiques'
        )
        
        self.med1 = Medicament.objects.create(
            nom='Amoxicilline',
            dci='Amoxicillin',
            categorie=self.category,
            form='Comprimé',
            dosage='500mg',
            prix_achat=10.00,
            prix_vente=15.00,
            stock_actuel=100,
            stock_minimum=20,
            date_expiration='2025-12-31',
            ordonnance_requise=True
        )
        self.med2 = Medicament.objects.create(
            nom='Paracétamol',
            dci='Paracetamol',
            categorie=self.category,
            form='Comprimé',
            dosage='500mg',
            prix_achat=5.00,
            prix_vente=8.00,
            stock_actuel=200,
            stock_minimum=50,
            date_expiration='2025-12-31',
            ordonnance_requise=False
        )

    def test_vente_creation(self):
        url = '/api/ventes/create/' 
        data = {
            'note': 'John Doe',
            'articles': [
                {'medicament': self.med1.pk, 'quantite': 2, 'prix_unitaire': 15.00},
                {'medicament': self.med2.pk, 'quantite': 1, 'prix_unitaire': 8.00}
            ]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['note'], 'John Doe')
        self.assertEqual(float(response.data['total_ttc']), 38.00)
        
        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 98)

    def test_vente_retrieval(self):
        """Test retrieving a vente with its articles"""
        create_data = {
            'note': 'Retrieval Test',
            'articles': [{'medicament': self.med1.pk, 'quantite': 5, 'prix_unitaire': 15.00}]
        }
        create_res = self.client.post('/api/ventes/create/', create_data, format='json')
        ref = create_res.data['reference']

        url = f'/api/ventes/{ref}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['articles']), 1)
        self.assertEqual(response.data['note'], 'Retrieval Test')

    def test_vente_insufficient_stock(self):
        url = '/api/ventes/create/'
        data = {
            'note': 'Fail Test',
            'articles': [{'medicament': self.med1.pk, 'quantite': 500, 'prix_unitaire': 15.00}]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Stock insuffisant', response.data['error'])

    def test_vente_deletion_restores_stock(self):
        create_data = {
            'articles': [{'medicament': self.med1.pk, 'quantite': 10, 'prix_unitaire': 15.00}]
        }
        create_res = self.client.post('/api/ventes/create/', create_data, format='json')
        ref = create_res.data['reference']
        
        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 90)

        response = self.client.delete(f'/api/ventes/{ref}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 100)

    def test_vente_list_all(self):
        self.client.post('/api/ventes/create/', {'articles': []}, format='json')
        self.client.post('/api/ventes/create/', {'articles': []}, format='json')
        
        response = self.client.get('/api/ventes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_vente_list_by_date(self):
        from django.utils import timezone
        import datetime

        create_data = {
            'note': 'Date Test Vente',
            'articles': []
        }
        create_res = self.client.post('/api/ventes/create/', create_data, format='json')
        ref = create_res.data['reference']

        test_date = datetime.date(2023, 1, 1)
        Vente.objects.filter(pk=ref).update(date_vente=timezone.make_aware(datetime.datetime(2023, 1, 1, 12, 0)))

        url = f'/api/ventes/list/{test_date.isoformat()}/'
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['reference'], ref)

        empty_url = '/api/ventes/list/2000-01-01/'
        empty_response = self.client.get(empty_url)
        self.assertEqual(len(empty_response.data), 0)
