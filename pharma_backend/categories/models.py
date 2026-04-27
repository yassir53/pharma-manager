from django.db import models

class Category(models.Model):
    nom = models.CharField(primary_key=True, max_length=100 ,unique=True)
    description = models.TextField(blank=True , null=True)
    
