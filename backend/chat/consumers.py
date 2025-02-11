from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Communication, Message
from django.contrib.auth import get_user_model


User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):
    """
    This class handles WebSocket connettions for chat application.
    It manages connections, message reception and disconnections
    """

    def __init__(self, *args, **kwargs):
        # Initialize the consumer, setting up channel_id and user
        super().__init__(*args, **kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        self.user = self.scope['user']
        self.accept()  # Accept WebSocket connection
        if not self.user.is_authenticated:
            self.close(code=4001)
        # Extract channel id form the URL
        self.channel_id = self.scope['url_route']['kwargs']['channelId']
        # Set the user(currently hardcoded to user with ID 1 for testing)

        # Add WEbSocket connection to the group for real time communication
        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name,
        )

    def receive_json(self, text_data):
        channel_id = self.channel_id  # Get the current channel id
        sender = self.user  # Get the sender user
        # Extract the message content from the data
        content = text_data['message']

        # Get or create a communication object for the channel
        communication, _ = Communication.objects.get_or_create(
            channel_id=channel_id)

        # Create a new message object associated with Communication
        new_message = Message.objects.create(
            communication=communication, sender=sender, content=content)

        # Send the new message to all clients in the group for real-time updates
        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                'type': 'chat.message',
                'new_message': {
                    'id': new_message.id,
                    'sender': new_message.sender.username,
                    'content': new_message.content,
                    'timestamp': new_message.timestamp.isoformat()
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)  # Send the event data as JSON to the WebSocket

    def disconnect(self, close_code):
        # Remove the WebSocket connection from the group when the communication is closed
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_id, self.channel_name)
        super().disconnect(close_code)  # Disconnect the WebSocket
