from django.urls import path, re_path
from chat.consumers import ChatConsumer
websocket_urlpatterns = [
    path('ws/api/<slug:channel_name>/', ChatConsumer)
]