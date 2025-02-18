from rest_framework import serializers
from .models import Message, Communication


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp', 'profile_image']

    def get_profile_image(self, obj):
        return obj.sender.profile_image.url if obj.sender.profile_image else None
