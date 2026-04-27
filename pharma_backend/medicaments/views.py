from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Medicament
from .serializer import MedicamentSerializer

class MedicamentViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer

    def get(self, request, pk):
        try:
            medicament = Medicament.objects.get(pk=pk)
        except Medicament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = MedicamentSerializer(medicament)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = MedicamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            medicament = Medicament.objects.get(pk=pk)
        except Medicament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = MedicamentSerializer(medicament, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            medicament = Medicament.objects.get(pk=pk)
        except Medicament.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        medicament.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class MedicamentListViewSet(viewsets.ModelViewSet):
    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer

    def get(self, request):
        medicaments = Medicament.objects.all()
        serializer = MedicamentSerializer(medicaments, many=True)
        return Response(serializer.data)
    

