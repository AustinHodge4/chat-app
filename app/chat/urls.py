from django.urls import path
from chat.views import index, Messages, Rooms, login

urlpatterns = [
    path('home/', login),
    path('api/', index),
    path('api/rooms/', Rooms.as_view()),
    path('api/<slug:channel_id>/messages/', Messages.as_view()),
]