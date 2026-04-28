from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicamentViewSet, medicament_by_category, medicament_by_form, medicament_by_ordonnance, recherche_medicament, alertes_stock

router = DefaultRouter()
router.register('', MedicamentViewSet, basename='medicament')

urlpatterns = [
   
    path('alertes-stock/', alertes_stock, name='alertes-stock'),
    path('category/<str:category_nom>/', medicament_by_category, name='medicament-by-category'),
    path('form/<str:forme>/', medicament_by_form, name='medicament-by-form'),
    path('ordonnance/<str:ordonnance_requise>/', medicament_by_ordonnance, name='medicament-by-ordonnance'),
    path('search/<str:nom>/', recherche_medicament, name='recherche-medicament'),
    
    path('', include(router.urls)),
]