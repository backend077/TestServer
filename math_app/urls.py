from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('register/login/', user_login, name='login'),
    path('login/', user_login, name='login'),
    path('level_list/', level_list, name='level_list'),
    path('add_level/', add_level, name='add_level'),
    path('add_question/', add_question, name='add_question'),
    path('admin_page/', admin_page, name='admin_page'),
    path('logout/', user_logout, name='logout'),
    path('ranked-users/', ranked_users, name='ranked_users'),
    path('level/<int:level_id>/', question_list, name='question_list'),
    path('level/<int:level_id>/submit/', submit_answers, name='submit_answers'),
    path('level_delete/', level_delete, name='level_delete'),
    path('', home, name='home'),
]
