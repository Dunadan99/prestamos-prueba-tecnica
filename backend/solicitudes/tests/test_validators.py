from django.test import TestCase
from django.core.exceptions import ValidationError

from solicitudes.validators import validate_only_letters


class ValidatorsTestCase(TestCase):
    # Solo se testea validate_only_letters porque es el unico validador implementado de mi parte.
    # El resto de validadores usados viene de Django, no creo necesario testearlos.

    def test_validate_only_letters_success(self):
        valid_inputs = ["Charly", "Carlos Alberto", "García", "Pingüino"]

        for input in valid_inputs:
            with self.subTest(input=input):
                try:
                    validate_only_letters(input)
                except ValidationError:
                    self.fail(
                        "Unexpected ValidationError raised by validate_only_letters()")

    def test_validate_only_letters_error(self):
        invalid_inputs = ["Charly123", "Charly!",
                            "Charly.García", "Charly_García", "Charly-García"]

        for input in invalid_inputs:
            with self.subTest(input=input):
                self.assertRaises(ValidationError, validate_only_letters, input)
