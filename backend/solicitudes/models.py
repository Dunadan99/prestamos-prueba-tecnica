from decimal import Decimal
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, validate_email

from solicitudes.utils import Gender


class Solicitud(models.Model):
    id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=50, null=False, blank=False)
    last_name = models.CharField(max_length=50, null=False, blank=False)
    email = models.EmailField(validators=[validate_email], max_length=100, null=False, blank=False)
    gender = models.CharField(max_length=20, choices=Gender, null=False, blank=False)
    granted = models.BooleanField(default=False)
    dni = models.PositiveIntegerField(
        validators=[MaxValueValidator(9999999999)],
        null=False,
        blank=False
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal(1))],
        null=False, blank=False
    )


    class Meta:
        verbose_name = 'Solicitud'
        verbose_name_plural = 'Solicitudes'
        ordering = ['creation_date']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
