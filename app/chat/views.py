from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from chat.models import Channel, Message
from chat.serializers import ChannelSerializer, MessageSerializer, UserSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import json
from django.shortcuts import redirect

@login_required(login_url='/home/')
def index(request):
    if request.user.is_authenticated:
        print("Fail")
    channel, _ = Channel.objects.get_or_create(channel_name="generic")
    user = request.user
    if not Channel.objects.filter(channel_name="generic", users=user).exists():
        channel.users.add(user)
        channel.save()

    return render(request, 'index.html')

def loginuser(request):
    if request.method == 'POST':
        # login user
        payload = json.loads(request.body)
        username = payload['username']
        password = payload['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print("Logging in")
            return JsonResponse({'success': True})
        else:
            print(" Invalid Login")
            return JsonResponse({'success': False, 'error_message': 'Failed to login!'})
    else:
        return render(request, 'login.html')
def logoutuser(request):
    logout(request)
    return JsonResponse({'success': True})

class UserView(APIView):
    renderer_classes = (JSONRenderer, )
    
    def get(self, request, format=None):
        ''' Returns active signin user '''
        user = request.user

        user_serializer = UserSerializer(user)
        return Response(user_serializer.data)
        
class ChannelView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request, format=None):
        """
        Return a list of all rooms.
        """
        channels = Channel.objects.all()
        user = request.user

        subscribed_channels = Channel.objects.filter(users=user)
        print("Sub Channels: {}".format(subscribed_channels))
        print("All Channels: {}".format(channels))
    
        channels_serializer = ChannelSerializer(channels, many=True)
        sub_channel_serializer = ChannelSerializer(subscribed_channels, many=True)
        response = {
            'all_channels': channels_serializer.data,
            'subscribed_channels': sub_channel_serializer.data
        }
        return Response(response)

    def post(self, request, format=None):
        data = request.data
        if Channel.objects.filter(channel_name=data['channel_name']):
            return Response({'success': False, 'reason': 'Channel already exists!'})

        user = User.objects.get(username=data['user']['username'], password=data['user']['password'], first_name=data['user']['first_name'], last_name=data['user']['last_name'], email=data['user']['email'])
        new_channel = Channel(channel_name=data['channel_name'], creator=user)
        new_channel.save()

        new_channel.users.add(user)
        new_channel.save()
                
        return Response({'success': True, 'channel_name': data['channel_name']})

class MessageView(APIView):
    renderer_classes = (JSONRenderer, )
    
    def get(self, request, channel_name, format=None):
        """
        Return a list of all messages.
        """
        channel, created = Channel.objects.get_or_create(channel_name=channel_name)
        print("Created: {}".format(created))
        # We want to show the last 50 messages, ordered most-recent-last
        messages = Message.objects.filter(channel=channel).order_by('-timestamp')
        paginator = Paginator(messages, 10)
        page = int(request.GET.get('page', 1))

        if page >= paginator.num_pages+1:
            return Response({})

        m = paginator.get_page(page)
    
        serializer = MessageSerializer(m, many=True)
        return Response(serializer.data)

