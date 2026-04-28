from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Medicament
from .serializer import MedicamentSerializer

class MedicamentViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    
class MedicamentListViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    

def medicament_by_category(request, category_nom):
    medicaments= Medicament.objects.filter(categorie__nom=category_nom)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

def medicament_by_form(request, forme):
    medicaments = Medicament.objects.filter(form=forme)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

def medicament_by_ordonnance(request, ordonnance_requise):
    medicaments = Medicament.objects.filter(ordonnance_requise=ordonnance_requise)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

def recherche_medicament(request):
    query = request.GET.get('q', '')
    medicaments = Medicament.objects.filter(nom__icontains=query)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)
