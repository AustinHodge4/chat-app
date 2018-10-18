from django.urls import path
from chat.consumers import ChatConsumer, RoomConsumer
websocket_urlpatterns = [
    path('ws/api/<slug:channel_name>/', ChatConsumer),
    path('ws/api/', RoomConsumer)
]