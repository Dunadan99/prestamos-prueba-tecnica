from django.http import HttpResponse
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, permissions, filters
from rest_framework_simplejwt.authentication import JWTAuthentication

from solicitudes.models import Solicitud
from solicitudes.serializers import SolicitudSerializer
from solicitudes.utils import request_loan


def index(request):
    return HttpResponse('Hello, World!')


class SolicitudViewSet(ModelViewSet):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'dni']
    ordering = ['creation_date']

    def get_permissions(self):
        if self.action != 'create':
            return [permissions.IsAuthenticated()]
        return []

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            is_granted = request_loan(request.data.get('dni'))
        except Exception as e:
            return Response({
                'error': 'Error al intentar comunicarse con el servicio de Moni',
                'trace': str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        serializer.validated_data['granted'] = is_granted
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
