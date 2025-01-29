from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class Communication(models.Model):
    channel_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_created=True, auto_now_add=True)


class Message(models.Model):
    communication = models.ForeignKey(
        Communication, on_delete=models.CASCADE, related_name='message')
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField(max_length=550)
    timestamp = models.DateTimeField(auto_now_add=True)
