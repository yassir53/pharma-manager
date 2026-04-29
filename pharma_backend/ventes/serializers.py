from .models import Vente, LigneVente
from rest_framework import serializers
from medicaments.models import Medicament
from django.db import transaction

class LigneVenteSerializer(serializers.ModelSerializer):
    medicament_name = serializers.ReadOnlyField(source='medicament.nom')

    class Meta:
        model = LigneVente
        exclude = ['vente'] 
        extra_kwargs = {
            'sous_total': {'read_only': True}
        }

class VenteSerializer(serializers.ModelSerializer):
    lignes_vente = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = ['reference', 'date_vente', 'total_ttc', 'status', 'note', 'lignes_vente']
        extra_kwargs = {
            'reference': {'read_only': True},
            'total_ttc': {'read_only': True},
        }

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes_vente')
        
        with transaction.atomic():
            total_ttc = sum(item['quantite'] * item['prix_unitaire'] for item in lignes_data)
            vente = Vente.objects.create(total_ttc=total_ttc, **validated_data)

            for ligne_data in lignes_data:
                med = ligne_data['medicament']
                quantite = ligne_data['quantite']

                if med.stock_actuel < quantite:
                    raise serializers.ValidationError(f"Stock insuffisant pour {med.nom}")

                med.stock_actuel -= quantite
                med.save()

                LigneVente.objects.create(
                    vente=vente, 
                    sous_total=quantite * ligne_data['prix_unitaire'],
                    **ligne_data
                )

        return vente