from django.db import models
from django.conf import settings
from PIL import Image
from django.core.exceptions import ValidationError
# Create your models here.


def validate_image_formant(image):
    img = Image.open(image)
    if img.format not in ['JPEG', 'PNG', 'WebP']:
        raise ValidationError(
            'Unsupported format. Please upload JPEG, PNG or WebP image.')


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=350, null=True, blank=True)
    icon = models.FileField(null=True, blank=True, upload_to='category_icons/')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Server(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='server_owner')
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='server_category')
    description = models.TextField(max_length=350, null=True, blank=True)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL)
    image = models.ImageField(
        upload_to='server_images/', blank=True, null=True, validators=[validate_image_formant])

    def __str__(self):
        return f'{self.name} (Owner: {self.owner.username})'


class Channel(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=150, null=True, blank=True)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name='server_channel')

    def __str__(self):
        return self.name
