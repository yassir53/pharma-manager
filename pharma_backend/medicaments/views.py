from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter,extend_schema_view
from django.db.models import F

from .models import Medicament
from .serializer import MedicamentSerializer

@extend_schema_view(
    list=extend_schema(summary="List details of one medicament", description="Retrieve details of a specific medicament by its name"),
    retrieve=extend_schema(summary="Get medicament details"),
    create=extend_schema(summary="Create a new medicament"),
    delete=extend_schema(summary="Delete a medicament"),
    )
class MedicamentViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    

@extend_schema_view(
list=extend_schema(summary="List all medicaments", description="Retrieve a full list of active products."),
)
class MedicamentListViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    
@extend_schema(
summary="Search medicaments by category",
parameters=[
    OpenApiParameter(name='category_nom', description='Name of the category', required=True, type=str)
],
responses={200: MedicamentSerializer(many=True)}
)
@api_view(['GET'])
def medicament_by_category(request, category_nom):
    medicaments= Medicament.objects.filter(categorie__nom=category_nom)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)


@extend_schema(
    summary="Search medicaments by form",
    parameters=[
        OpenApiParameter(name='forme', description='Form of the medicament', required=True, type=str)
    ],
    responses={200: MedicamentSerializer(many=True)}
)
@api_view(['GET'])
def medicament_by_form(request, forme):
    medicaments = Medicament.objects.filter(form=forme)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)


@extend_schema(
    summary="Search medicaments by prescription requirement",
    parameters=[
        OpenApiParameter(name='ordonnance_requise', description='Whether the medicament requires a prescription', required=True, type=bool)
    ],
    responses={200: MedicamentSerializer(many=True)}
)
@api_view(['GET'])
def medicament_by_ordonnance(request, ordonnance_requise):
    is_required = ordonnance_requise.lower() == 'true'
    
    medicaments = Medicament.objects.filter(ordonnance_requise=is_required)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)

@extend_schema(
    summary="Search medicaments by name",
    parameters=[
        OpenApiParameter(name='nom', description='Name or partial name of the medicament', required=True, type=str)
    ],
    responses={200: MedicamentSerializer(many=True)}
)
@api_view(['GET'])
def recherche_medicament(request, nom):
    medicaments = Medicament.objects.filter(nom__icontains=nom)
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)


@extend_schema(
    summary="Alert for medicaments with low stock",
    description="Returns a list of medicaments where current stock is less than or equal to minimum stock.",
    responses={200: MedicamentSerializer(many=True)}
)
@api_view(['GET'])
def alertes_stock(request):
    medicaments = Medicament.objects.filter(stock_actuel__lte=F('stock_minimum'))
    
    serializer = MedicamentSerializer(medicaments, many=True)
    return Response(serializer.data)