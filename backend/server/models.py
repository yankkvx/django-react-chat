from django.db import models
from django.conf import settings
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=350, null=True, blank=True)

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
        upload_to='server_images/', blank=True, null=True)

    def __str__(self):
        return f'{self.name} (Owner: )'


class Channel(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=150, null=True, blank=True)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name='server_channel')

    def __str__(self):
        return self.name
