from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Communication, Message
from django.contrib.auth import get_user_model
from server.models import Server
from .validation import custom_censor

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
        self.server_id = self.scope['url_route']['kwargs']['serverId']

        # Retrieve the Server object using the server_id and check if the user is a member of the server
        server = Server.objects.get(id=self.server_id)
        self.is_member = server.member.filter(id=self.user.id).exists()

        # Add WEbSocket connection to the group for real time communication
        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name,
        )

    def receive_json(self, text_data):

        # If the user is not a member of the server, dont process the message
        if not self.is_member:
            return

        channel_id = self.channel_id  # Get the current channel id
        sender = self.user  # Get the sender user
        # Extract the message content from the data
        content = text_data['message']

        cencored_content = custom_censor(content)

        # Get or create a communication object for the channel
        communication, _ = Communication.objects.get_or_create(
            channel_id=channel_id)

        # Create a new message object associated with Communication
        new_message = Message.objects.create(
            communication=communication, sender=sender, content=cencored_content)

        # Get a profile image url
        profile_image_url = sender.profile_image.url if sender.profile_image else ''

        # Send the new message to all clients in the group for real-time updates
        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                'type': 'chat.message',
                'new_message': {
                    'id': new_message.id,
                    'sender': new_message.sender.username,
                    'sender_id': new_message.sender.id,
                    'content': new_message.content,
                    'timestamp': new_message.timestamp.isoformat(),
                    'profile_image': profile_image_url,
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
