
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Vente, LigneVente
from .serializers import VenteSerializer, LigneVenteSerializer
from medicaments.models import Medicament


class VenteViewSet(viewsets.ModelViewSet):

    def create(self, request, ):
            serializer = VenteSerializer(data=request.data)
            if serializer.is_valid():
                vente = serializer.save()
                articles_data = request.data.get('articles', [])
                created_articles = []
                for article_data in articles_data:
                    article_data['vente'] = vente.id
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
                    article_data['sous_total'] = quantite * article_data.get('prix_unitaire', 0)
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
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
    

    def get(self, request, pk):
        """Retrieve a vente and its articles."""
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

        # Restore stock for old articles and delete them
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
                article_data['vente'] = vente.id
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
                article_data['sous_total'] = quantite * article_data.get('prix_unitaire', 0)
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
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            vente = Vente.objects.get(pk=pk)
        except Vente.DoesNotExist:
            return Response({'error': 'Vente not found'}, status=404)

        ligneVentes = LigneVente.objects.filter(vente=vente)
        for ligne in ligneVentes:
            ligne.medicament.stock_actuel += ligne.quantite
            ligne.medicament.save()
            ligne.delete()
        vente.delete()
        return Response(status=204)
    

