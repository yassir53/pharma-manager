from django.test import TestCase

from .models import Medicament
from categories.models import Category
from .views import MedicamentViewSet, MedicamentListViewSet

class MedicamentModelTest(TestCase):
    def setUp(self):
        self.category = self.client.post('/categories/', data={'nom': 'Antibiotiques'})
        self.medicament = self.client.post('/medicaments/create/', data={
            'nom': 'Amoxicilline',
            'dci': 'Amoxicillin',
            'categorie': self.category,
            'form': 'Comprimé',
            'dosage': '500mg',
            'prix_achat': 10.00,
            'prix_vente': 15.00,
            'stock_actuel': 100,
            'stock_minimum': 20,
            'date_expiration': '2025-12-31',
            'ordonnance_requise': True
        })
    def test_medicament_creation(self):
        self.assertEqual(self.medicament.nom, 'Amoxicilline')
        self.assertEqual(self.medicament.dci, 'Amoxicillin')
        self.assertEqual(self.medicament.categorie, self.category)
        self.assertEqual(self.medicament.form, 'Comprimé')
        self.assertEqual(self.medicament.dosage, '500mg')
        self.assertEqual(self.medicament.prix_achat, 10.00)
        self.assertEqual(self.medicament.prix_vente, 15.00)
        self.assertEqual(self.medicament.stock_actuel, 100)
        self.assertEqual(self.medicament.stock_minimum, 20)
        self.assertEqual(str(self.medicament.date_expiration), '2025-12-31')
        self.assertTrue(self.medicament.ordonnance_requise)
        self.assertTrue(self.medicament.est_actif)

    def test_medicament_update(self):
        updated_data = {
            'nom': 'Azithromycine',
            'dci': 'Azithromycin',
            'categorie': self.category,
            'form': 'Comprimé',
            'dosage': '250mg',
            'prix_achat': 12.00,
            'prix_vente': 18.00,
            'stock_actuel': 80,
            'stock_minimum': 15,
            'date_expiration': '2026-12-31',
            'ordonnance_requise': True
        }
        self.medicament=self.client.put(f'/medicaments/{self.medicament.pk}/update/', data=updated_data, content_type='application/json')
        self.assertEqual(self.medicament.nom, updated_data['nom'])
        self.assertEqual(self.medicament.dci, updated_data['dci'])
        self.assertEqual(self.medicament.categorie, updated_data['categorie'])
        self.assertEqual(self.medicament.form, updated_data['form'])
        self.assertEqual(self.medicament.dosage, updated_data['dosage'])
        self.assertEqual(self.medicament.prix_achat, updated_data['prix_achat'])
        self.assertEqual(self.medicament.prix_vente, updated_data['prix_vente'])
        self.assertEqual(self.medicament.stock_actuel, updated_data['stock_actuel'])
        self.assertEqual(self.medicament.stock_minimum, updated_data['stock_minimum'])
        self.assertEqual(str(self.medicament.date_expiration), updated_data['date_expiration'])
        self.assertEqual(self.medicament.ordonnance_requise, updated_data['ordonnance_requise'])

    def test_medicament_deletion(self):
        response = self.client.delete(f'/medicaments/{self.medicament.pk}/delete/')
        self.assertEqual(response.status_code, 204)
        response = self.client.get(f'/medicaments/{self.medicament.pk}/')
        self.assertEqual(response.status_code, 404)

    def test_medicament_list(self):
        response = self.client.get('/medicaments/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nom'], 'Amoxicilline')
    
    def test_medicament_retrieval(self):
        response = self.client.get(f'/medicaments/{self.medicament.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nom'], 'Amoxicilline')
        self.assertEqual(response.data['dci'], 'Amoxicillin')
        self.assertEqual(response.data['categorie'], self.category.pk)
        self.assertEqual(response.data['form'], 'Comprimé')
        self.assertEqual(response.data['dosage'], '500mg')
        self.assertEqual(float(response.data['prix_achat']), 10.00)
        self.assertEqual(float(response.data['prix_vente']), 15.00)
        self.assertEqual(response.data['stock_actuel'], 100)
        self.assertEqual(response.data['stock_minimum'], 20)
        self.assertEqual(response.data['date_expiration'], '2025-12-31')
        self.assertTrue(response.data['ordonnance_requise'])

    