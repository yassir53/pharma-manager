from django.urls import path
import categories.views as category_views


urlpatterns = [
    path('', category_views.CategoryListViewSet.as_view({'get': 'get'}), name='category-list'),
    path('<str:pk>/', category_views.CategoryViewSet.as_view({'get': 'get', 'put': 'put', 'delete': 'delete'}), name='category-detail'),
    path('create/', category_views.CategoryViewSet.as_view({'post': 'post'}), name='category-create'),
]