from django.shortcuts import render
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator

from chat.models import Channel, Message
from chat.serializers import ChannelSerializer, MessageSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import json

def index(request):
    return render(request, 'index.html')

def login(request):
    if request.method == 'POST':
        # login user
        username = request['username']
        
        return render(request, 'index.html')
    else:
        return render(request, 'login.html')

class Rooms(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, format=None):
        """
        Return a list of all rooms.
        """
        channels = Channel.objects.all()
    
        serializer = ChannelSerializer(channels, many=True)
        return Response(serializer.data)
class Messages(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, channel_id, format=None):
        """
        Return a list of all messages.
        """
        channel, created = Channel.objects.get_or_create(channel_id=channel_id)
        print("Created: {}".format(created))
        # We want to show the last 50 messages, ordered most-recent-last
        messages = Message.objects.filter(channel=channel).order_by('-timestamp').reverse()
        paginator = Paginator(messages, 10)
        page =  (paginator.num_pages+1) - int(request.GET.get('page', 1))
        print(paginator.num_pages)
        print(page)
        if page <= 0:
            return Response({})

        m = paginator.get_page(page)
    
        serializer = MessageSerializer(m, many=True)
        return Response(serializer.data)

