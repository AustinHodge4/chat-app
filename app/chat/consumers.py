from chat.models import Channel, Message
from chat.serializers import  MessageSerializer
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['channel_id']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        print(message_type)
        if message_type == 'message_event':
            message = text_data_json['message']
            user = text_data_json['name']
            channel_id = self.room_name

            print("User: {}".format(user))
            print("Message: {}".format(message))
            print("Channel: {}".format(channel_id))

            channel = Channel.objects.get(channel_id=channel_id)
            message_obj = Message()
            message_obj.channel = channel
            message_obj.user = user
            message_obj.message = message
            message_obj.save()

            serializer = MessageSerializer(message_obj)
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': message_type,
                    'message': serializer.data,
                }
            )

    # Receive message from room group
    def message_event(self, event):
        print(json.dumps(event))
        # Send message to WebSocket
        self.send(text_data=json.dumps(event))

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'rooms'
        self.room_group_name = 'default_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print("Message: {}".format(message))

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'room_event',
                'message': message
            }
        )

    # Receive message from room group
    def room_event(self, event):
        print(json.dumps(event))
        # Send message to WebSocket
        self.send(text_data=json.dumps(event))