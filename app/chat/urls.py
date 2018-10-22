from django.urls import path
from chat.views import index, loginuser, logoutuser, MessageView, ChannelView, UserView

urlpatterns = [
    path('home/', loginuser),
    path('api/', index),
    path('api/logout/',logoutuser),
    path('api/user/', UserView.as_view()),
    path('api/channels/', ChannelView.as_view()),
    path('api/<slug:channel_name>/messages/', MessageView.as_view()),
]