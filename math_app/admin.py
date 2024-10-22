from django.contrib import admin
from .models import Level, Question, Answer, CustomUser

# Register your models here.
admin.site.register(Level)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(CustomUser)
