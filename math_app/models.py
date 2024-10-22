from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    STAFF_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
    ]
    type_staff = models.CharField(max_length=10, choices=STAFF_CHOICES, default='user')

    def __str__(self):
        return self.username


class Level(models.Model):
    level_name = models.CharField(max_length=255)
    start_date = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField()

    def __str__(self):
        return self.level_name


class Question(models.Model):
    text = models.CharField(max_length=255)
    answer_1 = models.CharField(max_length=255)
    answer_2 = models.CharField(max_length=255)
    answer_3 = models.CharField(max_length=255)
    answer_4 = models.CharField(max_length=255)
    is_correct = models.CharField(max_length=255)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    def __str__(self):
        return self.text


class QuestionTest(models.Model):
    level_id = models.ForeignKey(Level, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)


class Answer(models.Model):
    level_id = models.ForeignKey(Level, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user_name} - {self.answer}"
