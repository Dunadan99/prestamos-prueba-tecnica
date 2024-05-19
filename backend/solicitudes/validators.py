from django.core.validators import RegexValidator


def validate_only_letters(value):
    return RegexValidator(r'^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$', 'Only letters and spaces are allowed')(value)
