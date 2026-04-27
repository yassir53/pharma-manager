from django.contrib import admin
from django.urls import include, path
from .views import MedicamentViewSet, MedicamentListViewSet


urlpatterns = [
    path('', MedicamentListViewSet.as_view({'get': 'list'})),
    path('<int:pk>/', MedicamentViewSet.as_view({'get': 'retrieve'})),
    path('create/', MedicamentViewSet.as_view({'post': 'create'})),
    path('<int:pk>/update/', MedicamentViewSet.as_view({'put': 'update'})),
    path('<int:pk>/delete/', MedicamentViewSet.as_view({'delete': 'destroy'})),
]