from django.urls import include, path
from rest_framework.routers import DefaultRouter

from solicitudes import views

router = DefaultRouter()
router.register(r'solicitudes', views.SolicitudViewSet, basename='solicitud')

urlpatterns = [
    path('', views.index, name='index'),
    path('', include(router.urls)),
]
