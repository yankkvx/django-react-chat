from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Communication, Message
from .serializers import MessageSerializer
from .schema import message_docs


class MessageViewSet(viewsets.ViewSet):
    @message_docs
    def list(self, request):
        channel_id = request.query_params.get('channel_id')

        try:
            communication = Communication.objects.get(channel_id=channel_id)
            messages = communication.message.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Communication.DoesNotExist:
            return Response({"detail": "Communication not found."}, status=status.HTTP_404_NOT_FOUND)
