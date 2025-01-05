from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.conf import settings
from .models import Category, Server
import os


@receiver(pre_save, sender=Category)
def delete_old_icon(sender, instance, **kwargs):
    if instance.pk:
        old_instance = Category.objects.get(pk=instance.pk)
        if old_instance.icon != instance.icon:
            if old_instance.icon:
                old_icon_path = old_instance.icon.path
                if os.path.isfile(old_icon_path):
                    os.remove(old_icon_path)


@receiver(pre_save, sender=Server)
def delete_old_image(sender, instance, **kwargs):
    if instance.pk:
        old_instance = Server.objects.get(pk=instance.pk)
        if old_instance.image != instance.image:
            if old_instance.image:
                old_image_path = old_instance.image.path
                if os.path.isfile(old_image_path):
                    os.remove(old_image_path)
