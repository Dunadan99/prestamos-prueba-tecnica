from django.db import models
from requests import get


class Gender(models.TextChoices):
    MALE = 'M', 'Hombre'
    FEMALE = 'F', 'Mujer'
    OTHER = 'O', 'Otro'
    NOT_INFORMED = 'N', 'No informado'


def request_loan(dni):
    url = f'https://api.moni.com.ar/api/v4/scoring/pre-score/{dni}'
    headers = {'credential': 'ZGpzOTAzaWZuc2Zpb25kZnNubm5u'}

    try:
        response = get(url, headers=headers)
        response.raise_for_status()

        match response.json()['status']:
            case 'approve':
                return True
            case 'rejected':
                return False
            case _:
                raise Exception('Error en la respuesta del servicio de Moni')
    except Exception as e:
        raise e
