from rest_framework import serializers
from chat.models import Channel, Message

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['channel_id', 'name']

class MessageSerializer(serializers.ModelSerializer):
    channel = ChannelSerializer()
    class Meta:
        model = Message
        fields = ['id', 'channel', 'user', 'message', 'timestamp']


