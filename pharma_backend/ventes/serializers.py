from .models import Vente, LigneVente
from rest_framework import serializers

class VenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vente
        fields = '__all__'
        extra_kwargs = {
            'reference': {'required': False, 'allow_blank': True},
            'total_ttc': {'required': False},
        }

class LigneVenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneVente
        fields = '__all__'