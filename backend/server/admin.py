from django.contrib import admin
from .models import Server, Channel, Category
# Register your models here.

admin.site.register(Server)
admin.site.register(Channel)
admin.site.register(Category)
