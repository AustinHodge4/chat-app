from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.
class Channel(models.Model):
    channel_name = models.SlugField(unique=True, db_index=True)
    users = models.ManyToManyField(User, blank=True, related_name='subscribers')
    creator = models.ForeignKey(User, null=True, blank=True, related_name='creator', on_delete=models.CASCADE)
    def __str__(self):
        return "Channel ID: {} - Users: {} - Creator: {}".format(self.channel_name, self.users, self.creator)

class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    def __str__(self):
        return "Channel: {} - User: {} - Timestamp: {} - Message: {}".format(self.channel, self.user, self.timestamp, self.message)