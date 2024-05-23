from django.test import TestCase
from django.core.exceptions import ValidationError

from solicitudes.models import Solicitud
from solicitudes.utils import Gender


class SolicitudModelTest(TestCase):
    def setUp(self):
        self.default = {
            'first_name': 'Charly',
            'last_name': 'García',
            'email': 'charly-garcia@gmail.com',
            'gender': Gender.MALE,
            'dni': 987654321,
            'amount': 10000.50
        }

        self.solicitud = Solicitud.objects.create(**self.default)

    def verify_valid_inputs(self, field, valid_inputs):
        for input in valid_inputs:
            with self.subTest(input=input):
                setattr(self.solicitud, field, input)
                try:
                    self.solicitud.full_clean()
                except ValidationError:
                    self.fail(f"Unexpected ValidationError raised by {field} with input {input}")

    def verify_invalid_inputs(self, field, invalid_inputs):
        for input in invalid_inputs:
            with self.subTest(input=input):
                setattr(self.solicitud, field, input)
                self.assertRaises(ValidationError, self.solicitud.full_clean)

    def test_id_primary_key(self):
        self.assertIsNotNone(self.solicitud.creation_date)

    def test_creation_date_auto_now(self):
        self.assertIsNotNone(self.solicitud.creation_date)


    # Solo testeo el primer nombre porque el apellido tiene las mismas validaciones
    def test_first_name_success(self):
        valid_inputs = ['Charly', 'Carlos Alberto', 'García', 'Pingüino']

        self.verify_valid_inputs('first_name', valid_inputs)

    def test_first_name_error(self):
        invalid_inputs = ['Charly123', 'Charly!',
                            'Charly.', 'Charly_', 'Charly-', 'a' * 51]

        self.verify_invalid_inputs('first_name', invalid_inputs)


    def test_email_success(self):
        valid_inputs = ['example@gmail.com', 'charly-garcia@gmail.edu.arg']

        self.verify_valid_inputs('email', valid_inputs)

    def test_email_error(self):
        invalid_inputs = ['charly-garcia@gmail',
                            '@gmail.com', 'charlygmail.com']

        self.verify_invalid_inputs('email', invalid_inputs)


    def test_gender_success(self):
        valid_inputs = ['M', 'F', 'N', 'O']

        self.verify_valid_inputs('gender', valid_inputs)

    def test_gender_error(self):
        invalid_inputs = ['', 'mujer', 'no informado']

        self.verify_invalid_inputs('gender', invalid_inputs)

    def test_dni_success(self):
        valid_inputs = [1234567, 12345678, 123456789]

        self.verify_valid_inputs('dni', valid_inputs)

    def test_dni_error(self):
        invalid_inputs = ['', -1, 123456, 1234567890]

        self.verify_invalid_inputs('dni', invalid_inputs)


    def test_amount_success(self):
        valid_inputs = [1, 9999999999.99]

        self.verify_valid_inputs('amount', valid_inputs)

    def test_amount_error(self):
        invalid_inputs = ['', -1, 99999999999.99]

        self.verify_invalid_inputs('amount', invalid_inputs)

    def test_granted_default_value(self):
        self.assertFalse(self.solicitud.granted)


    def test_str_representation(self):
        expected_str = f"{self.solicitud.first_name} {self.solicitud.last_name}"
        self.assertEqual(str(self.solicitud), expected_str)
