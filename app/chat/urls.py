from django.urls import path
from chat.views import index, loginuser,registeruser, logoutuser, MessageView, ChannelView, UserView

urlpatterns = [
    path('home/', loginuser),
    path('register/', registeruser),
    path('api/', index),
    path('api/logout/',logoutuser),
    path('api/user/', UserView.as_view()),
    path('api/channels/', ChannelView.as_view()),
    path('api/<slug:channel_url>/messages/', MessageView.as_view()),
]