from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    profile_image = models.ImageField(
        upload_to='user_images/', blank=True, null=True)
