from PIL import Image
from rest_framework.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


def validation_icon(file):
    try:
        if file:
            if file.name[-4:].lower() != '.svg':
                 raise ValidationError('Only SVG files are allowed.')
    except Exception as e:
        raise ValidationError(f'Error in validating the file: {str(e)}')


def validate_image_formant(image):
    try:
        with Image.open(image) as img:
            if img.format not in ['JPEG', 'PNG', 'WEBP']:
                raise ValidationError(f'Invalid image format. Only JPEG, PNG, and WEBP formats are supported. Your file format is {img.format}.')
    except Exception:
        raise ValidationError('Invalid image file.')