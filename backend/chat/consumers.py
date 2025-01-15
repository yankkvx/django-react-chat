from channels.generic.websocket import WebsocketConsumer


class MyConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        # self.close()

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data=text_data)
        # self.close()

    def disconnect(self, close_code):
        pass
