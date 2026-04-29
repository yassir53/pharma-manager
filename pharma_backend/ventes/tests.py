from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from categories.models import Category
from medicaments.models import Medicament
from .models import Vente, LigneVente

class VenteAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin', password='password123')
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(nom='Antibiotiques', description='Test Cat')

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
            form='Gélule',
            dosage='1g',
            prix_achat=5.00,
            prix_vente=8.00,
            stock_actuel=200,
            stock_minimum=50,
            date_expiration='2025-12-31',
            ordonnance_requise=False
        )

        self.url = '/api/ventes/'

    def test_vente_creation(self):
        data = {
            'note': 'Vente au comptoir',
            'status': 'terminée',
            'lignes_vente': [ 
                {'medicament': self.med1.pk, 'quantite': 2, 'prix_unitaire': 15.00},
                {'medicament': self.med2.pk, 'quantite': 1, 'prix_unitaire': 8.00}
            ]
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertEqual(float(response.data['total_ttc']), 38.00)
        
        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 98)

    def test_vente_retrieval(self):
        create_data = {
            'lignes_vente': [{'medicament': self.med1.pk, 'quantite': 5, 'prix_unitaire': 15.00}]
        }
        create_res = self.client.post(self.url, create_data, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        ref = create_res.data['reference']

        response = self.client.get(f'{self.url}{ref}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['lignes_vente']), 1)
        self.assertEqual(response.data['lignes_vente'][0]['medicament'], self.med1.pk)

    def test_vente_insufficient_stock(self):
        data = {
            'note': 'Fail Test',
            'lignes_vente': [{'medicament': self.med1.pk, 'quantite': 500, 'prix_unitaire': 15.00}]
        }
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        self.assertIn('Stock insuffisant pour Amoxicilline', str(response.data))


    def test_vente_deletion_restores_stock(self):
        create_data = {
            'lignes_vente': [{'medicament': self.med1.pk, 'quantite': 10, 'prix_unitaire': 15.00}]
        }
        create_res = self.client.post(self.url, create_data, format='json')
        ref = create_res.data['reference']
        
        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 90)

        response = self.client.delete(f'{self.url}{ref}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.med1.refresh_from_db()
        self.assertEqual(self.med1.stock_actuel, 100)

    def test_vente_list_all(self):
        self.client.post(self.url, {'lignes_vente': []}, format='json')
        self.client.post(self.url, {'lignes_vente': []}, format='json')
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 2)

    def test_vente_list_by_date(self):
        self.client.post(self.url, {'lignes_vente': []}, format='json')
        today = Vente.objects.first().date_vente.strftime('%Y-%m-%d')
        
        url = f'{self.url}list/{today}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)