from django.urls import path, include
from .views import VenteViewSet, Vente_by_date
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', VenteViewSet, basename='vente')

urlpatterns = [

    path('list/<str:date>/', Vente_by_date, name='vente-by-date'),
    path('', include(router.urls)),
   
]