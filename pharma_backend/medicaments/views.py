from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import F

from .models import Medicament
from .serializer import MedicamentSerializer

class MedicamentViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    
class MedicamentListViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    
@api_view(['GET'])
def medicament_by_category(request, category_nom):
    medicaments= Medicament.objects.filter(categorie__nom=category_nom)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def medicament_by_form(request, forme):
    medicaments = Medicament.objects.filter(form=forme)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def medicament_by_ordonnance(request, ordonnance_requise):
    medicaments = Medicament.objects.filter(ordonnance_requise=ordonnance_requise)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def recherche_medicament(request, nom):
    medicaments = Medicament.objects.filter(nom__icontains=nom)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def alertes_stock(request):
    medicaments = Medicament.objects.filter(stock_actuel__lte=F('stock_minimum'))
    
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)