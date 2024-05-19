from rest_framework import serializers

from solicitudes.models import Solicitud

class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'
        read_only_fields = ['id', 'creation_date', 'granted']