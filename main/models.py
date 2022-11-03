from django.db import models

# Create your models here.

class Place(models.Model):
	city 	= models.CharField(max_length = 25)
	country		= models.CharField(max_length = 25)

	def __str__(self):
		return self.city
