from django.db import models
from categories.models import Category

class Medicament(models.Model):
    nom = models.CharField(primary_key=True, max_length=100 ,unique=True)
    dci = models.CharField(max_length=100,null=False ,blank=False)
    categorie = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='medicaments')
    form = models.CharField(max_length=50, null=False, blank=False)
    dosage = models.CharField(max_length=50, null=False, blank=False)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    stock_actuel = models.IntegerField(null=False, blank=False)
    stock_minimum = models.IntegerField(null=False, blank=False)
    date_expiration = models.DateField(null=False, blank=False)
    ordonnance_requise = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    est_actif = models.BooleanField(default=True)