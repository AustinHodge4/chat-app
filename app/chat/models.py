from django.db import models
from django.utils import timezone
# Create your models here.
class Channel(models.Model):
    channel_id = models.SlugField(unique=True, db_index=True)
    name = models.TextField()
    def __str__(self):
        return "Channel ID: {} - Name: {}".format(self.channel_id, self.name)
class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    user = models.TextField()
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    def __str__(self):
        return "Channel: {} - User: {} - Timestamp: {} - Message: {}".format(self.channel, self.user, self.timestamp, self.message)