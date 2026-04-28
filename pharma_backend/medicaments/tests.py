from django.test import TestCase
from django.test import Client
from django.urls import reverse

from .models import Medicament
from categories.models import Category


class MedicamentAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.category = Category.objects.create(nom='Antibiotiques')

    def test_medicament_list(self):
        Medicament.objects.create(
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
        response = self.client.get('/api/medicaments/')
        self.assertEqual(response.status_code, 200)

    def test_medicament_retrieval(self):
        medicament = Medicament.objects.create(
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
        response = self.client.get(f'/api/medicaments/{medicament.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['categorie'], self.category.pk)
        self.assertEqual(response.data['form'], 'Comprimé')
        self.assertEqual(response.data['dosage'], '500mg')
        self.assertEqual(float(response.data['prix_achat']), 10.00)
        self.assertEqual(float(response.data['prix_vente']), 15.00)
        self.assertEqual(response.data['stock_actuel'], 100)
        self.assertEqual(response.data['stock_minimum'], 20)
        self.assertEqual(response.data['date_expiration'], '2025-12-31')
        self.assertTrue(response.data['ordonnance_requise'])

    def test_medicament_creation(self):
        data = {
            'nom': 'Azithromycine',
            'dci': 'Azithromycin',
            'categorie': self.category.pk,
            'form': 'Comprimé',
            'dosage': '250mg',
            'prix_achat': 12.00,
            'prix_vente': 18.00,
            'stock_actuel': 50,
            'stock_minimum': 10,
            'date_expiration': '2025-12-31',
            'ordonnance_requise': True
        }
        response = self.client.post('/api/medicaments/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nom'], 'Azithromycine')
        self.assertEqual(response.data['dci'], 'Azithromycin')

    def test_medicament_update(self):
        medicament = Medicament.objects.create(
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
        data = {
            'nom': 'Azithromycine',
            'dci': 'Azithromycin',
            'categorie': self.category.pk,
            'form': 'Comprimé',
            'dosage': '250mg',
            'prix_achat': 12.00,
            'prix_vente': 18.00,
            'stock_actuel': 50,
            'stock_minimum': 10,
            'date_expiration': '2025-12-31',
            'ordonnance_requise': True
        }
        response = self.client.put(f'/api/medicaments/{medicament.pk}/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nom'], 'Azithromycine')
        self.assertEqual(response.data['dci'], 'Azithromycin')
    def test_medicament_deletion(self):
        medicament = Medicament.objects.create(
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
        pk = medicament.pk
        response = self.client.delete(f'/api/medicaments/{pk}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Medicament.objects.filter(pk=pk).exists())

    def test_medicament_by_category(self):
        medicament = Medicament.objects.create(
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
        response = self.client.get(f'/api/medicaments/category/{self.category.nom}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nom'], 'Amoxicilline')

    def test_medicament_by_form(self):
        medicament = Medicament.objects.create(
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
        response = self.client.get(f'/api/medicaments/form/{medicament.form}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['form'], 'Comprimé')

    def test_medicament_by_ordonnance(self):
        medicament = Medicament.objects.create(
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
        response = self.client.get(f'/api/medicaments/ordonnance/{medicament.ordonnance_requise}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['ordonnance_requise'])

    def test_recherche_medicament(self):
        medicament = Medicament.objects.create(
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
        url = reverse('recherche-medicament', kwargs={'nom': 'Amoxicilline'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nom'], 'Amoxicilline')
        self.assertEqual(response.data[0]['dci'], 'Amoxicillin')
        self.assertEqual(response.data[0]['categorie'], self.category.pk)
        self.assertEqual(response.data[0]['form'], 'Comprimé')
        self.assertEqual(response.data[0]['dosage'], '500mg')
        self.assertEqual(float(response.data[0]['prix_achat']), 10.00)
        self.assertEqual(float(response.data[0]['prix_vente']), 15.00)
        self.assertEqual(response.data[0]['stock_actuel'], 100)
        self.assertEqual(response.data[0]['stock_minimum'], 20)
        self.assertEqual(response.data[0]['date_expiration'], '2025-12-31')
        self.assertTrue(response.data[0]['ordonnance_requise'])

    def test_alertes_stock(self):
        medicament = Medicament.objects.create(
            nom='Amoxicilline',
            dci='Amoxicillin',
            categorie=self.category,
            form='Comprimé',
            dosage='500mg',
            prix_achat=10.00,
            prix_vente=15.00,
            stock_actuel=10,
            stock_minimum=20,
            date_expiration='2025-12-31',
            ordonnance_requise=True
        )
        url = reverse('alertes-stock')
        print(f"\nDEBUG: Testing URL -> {url}") 
        response = self.client.get(url)
        print(f"DEBUG: Status Code -> {response.status_code}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)