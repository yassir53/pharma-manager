
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action,api_view
from rest_framework.response import Response
from .models import Vente, LigneVente
from .serializers import VenteSerializer, LigneVenteSerializer
from medicaments.models import Medicament
from drf_spectacular.utils import extend_schema, extend_schema_view


@extend_schema_view(
    list=extend_schema(summary="List details of all the ventes", description="Retrieve details of all ventes"),
    retrieve=extend_schema(summary="Get vente details"),
    create=extend_schema(summary="Create a new vente"),
    delete=extend_schema(summary="Delete a vente"),
    put=extend_schema(summary="Update a vente"),
)
class VenteViewSet(viewsets.ModelViewSet):
    queryset = Vente.objects.all()
    serializer_class = VenteSerializer

    @action(detail=False, methods=['post'], url_path='create')
    def create_vente(self, request):
        """Custom create action for ventes with articles"""
        articles_data = request.data.get('articles', [])
        total_ttc = sum(
            float(article.get('prix_unitaire', 0)) * article.get('quantite', 0)
            for article in articles_data
        )
        
        # Add total_ttc to the data
        data = request.data.copy()
        data['total_ttc'] = total_ttc
        
        serializer = VenteSerializer(data=data)
        if serializer.is_valid():
            vente = serializer.save()
            created_articles = []
            for article_data in articles_data:
                article_data['vente'] = vente.reference
                medicament_id = article_data.get('medicament')
                quantite = article_data.get('quantite', 0)
                try:
                    medicament = Medicament.objects.get(pk=medicament_id)
                except Medicament.DoesNotExist:
                    vente.delete()
                    return Response({'error': f'Medicament {medicament_id} not found'}, status=400)
                if medicament.stock_actuel < quantite:
                    vente.delete()
                    return Response({'error': f'Stock insuffisant pour le médicament {medicament.nom}'}, status=400)
                medicament.stock_actuel -= quantite
                medicament.save()
                article_data['sous_total'] = quantite * float(article_data.get('prix_unitaire', 0))
                article_serializer = LigneVenteSerializer(data=article_data)
                if article_serializer.is_valid():
                    article_serializer.save()
                    created_articles.append(article_serializer)
                else:
                    for created_article in LigneVente.objects.filter(vente=vente):
                        created_article.medicament.stock_actuel += created_article.quantite
                        created_article.medicament.save()
                        created_article.delete()
                    vente.delete()
                    return Response(article_serializer.errors, status=400)
            
            vente.refresh_from_db()
            response_serializer = VenteSerializer(vente)
            data = response_serializer.data
            articles = LigneVente.objects.filter(vente=vente)
            articles_serializer = LigneVenteSerializer(articles, many=True)
            data['articles'] = articles_serializer.data
            return Response(data, status=201)
        return Response(serializer.errors, status=400)
    

    def retrieve(self, request, pk=None): 
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente not found'}, status=404)

        serializer = VenteSerializer(vente)
        articles = LigneVente.objects.filter(vente=vente)
        articles_serializer = LigneVenteSerializer(articles, many=True)
        
        data = serializer.data
        data['articles'] = articles_serializer.data 
        return Response(data)

    def put(self, request, pk):
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente not found'}, status=404)

        old_articles = LigneVente.objects.filter(vente=vente)
        for old_article in old_articles:
            old_article.medicament.stock_actuel += old_article.quantite
            old_article.medicament.save()
            old_article.delete()

        serializer = VenteSerializer(vente, data=request.data)
        if serializer.is_valid():
            vente = serializer.save()
            articles_data = request.data.get('articles', [])
            created_articles = []
            for article_data in articles_data:
                article_data['vente'] = vente.reference
                medicament_id = article_data.get('medicament')
                quantite = article_data.get('quantite', 0)
                try:
                    medicament = Medicament.objects.get(pk=medicament_id)
                except Medicament.DoesNotExist:
                    return Response({'error': f'Medicament {medicament_id} not found'}, status=400)
                if medicament.stock_actuel < quantite:
                    return Response({'error': f'Stock insuffisant pour le médicament {medicament.nom}'}, status=400)
                medicament.stock_actuel -= quantite
                medicament.save()
                article_data['sous_total'] = quantite * float(article_data.get('prix_unitaire', 0))
                article_serializer = LigneVenteSerializer(data=article_data)
                if article_serializer.is_valid():
                    article_serializer.save()
                    created_articles.append(article_serializer)
                else:
                    for created_article in LigneVente.objects.filter(vente=vente):
                        created_article.medicament.stock_actuel += created_article.quantite
                        created_article.medicament.save()
                        created_article.delete()
                    return Response(article_serializer.errors, status=400)
            
            vente.refresh_from_db()
            response_serializer = VenteSerializer(vente)
            data = response_serializer.data
            articles = LigneVente.objects.filter(vente=vente)
            articles_serializer = LigneVenteSerializer(articles, many=True)
            data['articles'] = articles_serializer.data
            return Response(data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None): 
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente not found'}, status=404)

        ligneVentes = LigneVente.objects.filter(vente=vente)
        
        for ligne in ligneVentes:
            med = ligne.medicament
            med.stock_actuel += ligne.quantite
            med.save()
        vente.delete()
        return Response(status=204)
    

@api_view(['GET']) # Ensure the decorator is present
@extend_schema(summary="Get ventes by date", responses=VenteSerializer(many=True))
def Vente_by_date(request, date):
    # Django's __date lookup extracts the date part from a DateTimeField
    ventes = Vente.objects.filter(date_vente__date=date)
    
    # If using many=True, an empty QuerySet returns [] (status 200), not a 404
    serializer = VenteSerializer(ventes, many=True)
    return Response(serializer.data)
    

