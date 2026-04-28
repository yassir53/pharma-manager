from django.db import models
from medicaments.models import Medicament

class Vente(models.Model):
    reference = models.CharField(primary_key=True, max_length=20, unique=True,auto_created=True)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='en cours')  
    note = models.TextField(blank=True, null=True)

class LigneVente(models.Model):
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes_vente')
    medicament = models.ForeignKey(Medicament, on_delete=models.CASCADE )
    quantite = models.IntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    sous_total = models.DecimalField(max_digits=10, decimal_places=2)