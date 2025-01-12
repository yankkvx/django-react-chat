from rest_framework import serializers
from .models import Server, Category, Channel


# Serializer for Channel model, converting it into JSON format.
class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# Serializer for Channel model, converting it into JSON format.
class ServerSerializer(serializers.ModelSerializer):
    server_channel = ChannelSerializer(many=True)
    num_members = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.name')

    class Meta:
        model = Server
        fields = '__all__'

    # Custom method to retrieve the number of members in a server.
    def get_num_members(self, obj):
        if hasattr(obj, 'num_members'):
            return obj.num_members
        return None

    def to_representation(self, instance):
        # Calls the parent class method for basic serialization
        data = super().to_representation(instance)
        # Retrieves 'num_members' from the context
        num_members = self.context.get('num_members')
        # If num_members is not in the context, remove it from the serialized data.
        if not num_members:
            data.pop('num_members', None)
        # Returns the serialized data.
        return data
