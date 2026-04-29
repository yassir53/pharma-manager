from django.shortcuts import render
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Vente, LigneVente
from .serializers import VenteSerializer, LigneVenteSerializer
from medicaments.models import Medicament
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema_view(
    list=extend_schema(summary="Liste toutes les ventes", description="Récupère les détails de toutes les ventes"),
    retrieve=extend_schema(summary="Détails d'une vente"),
    create=extend_schema(summary="Créer une nouvelle vente"),
    destroy=extend_schema(summary="Supprimer une vente"),
)
class VenteViewSet(viewsets.ModelViewSet):
    queryset = Vente.objects.all().prefetch_related('lignes_vente')
    serializer_class = VenteSerializer

    def retrieve(self, request, pk=None): 
        
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente non trouvée'}, status=404)

        serializer = VenteSerializer(vente)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente non trouvée'}, status=404)

        with transaction.atomic():
            for old_article in vente.lignes_vente.all():
                old_article.medicament.stock_actuel += old_article.quantite
                old_article.medicament.save()
                old_article.delete()

            serializer = VenteSerializer(vente, data=request.data)
            if serializer.is_valid():
                vente = serializer.save()
                
                articles_data = request.data.get('articles') or request.data.get('lignes_vente') or []
                
                new_total = 0 
                
                for article_data in articles_data:
                    medicament = Medicament.objects.get(pk=article_data['medicament'])
                    quantite = int(article_data['quantite'])
                    prix_unitaire = float(article_data['prix_unitaire'])
                    
                    if medicament.stock_actuel < quantite:
                        raise ValueError(f"Stock insuffisant pour {medicament.nom}")

                    medicament.stock_actuel -= quantite
                    medicament.save()

                    sous_total = quantite * prix_unitaire
                    new_total += sous_total

                    LigneVente.objects.create(
                        vente=vente,
                        medicament=medicament,
                        quantite=quantite,
                        prix_unitaire=prix_unitaire,
                        sous_total=sous_total
                    )
                
                vente.total_ttc = new_total
                vente.save()
                
                vente.refresh_from_db()
                
                return Response(VenteSerializer(vente).data)
                
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None): 
    
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente non trouvée'}, status=404)

        with transaction.atomic():
            for ligne in vente.lignes_vente.all():
                med = ligne.medicament
                med.stock_actuel += ligne.quantite
                med.save()
            vente.delete()
        
        return Response(status=204)

@api_view(['GET'])
@extend_schema(summary="Liste des ventes par date", responses=VenteSerializer(many=True))
def Vente_by_date(request, date):
    
    ventes = Vente.objects.filter(date_vente__date=date)
    serializer = VenteSerializer(ventes, many=True)
    return Response(serializer.data)