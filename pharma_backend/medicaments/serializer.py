from .models import Medicament
from rest_framework import serializers

class MedicamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicament
        fields = '__all__'
        