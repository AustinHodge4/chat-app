from django.urls import path
from chat.views import index, login, MessageView, ChannelView, UserView

urlpatterns = [
    path('home/', login),
    path('api/', index),
    path('api/user/', UserView.as_view()),
    path('api/channels/', ChannelView.as_view()),
    path('api/<slug:channel_name>/messages/', MessageView.as_view()),
]