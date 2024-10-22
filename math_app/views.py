from django.contrib.auth import authenticate, login, logout
from .models import CustomUser
from django.shortcuts import get_object_or_404, redirect
from .models import Question
from django.shortcuts import render
from .models import Answer, Level
from datetime import timedelta


def home(request):
    return render(request, 'home.html')


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password == confirm_password:
            user = CustomUser.objects.create_user(username=username, password=password)
            user.save()
            return redirect('home')
        else:
            return render(request, 'register.html', {'error': 'Parollar bir xil emas'})
    return render(request, 'register.html')


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            if user.type_staff == 'admin':
                return redirect('admin_page')
            else:
                return redirect('level_list')
        else:
            return render(request, 'login.html', {'error': 'Login yoki parol noto‘g‘ri'})
    return render(request, 'login.html')


def admin_page(request):
    total_users = CustomUser.objects.count()
    total_question = Question.objects.count()
    total_level = Level.objects.count()
    context = {
        "total_users": total_users,
        'total_question': total_question,
        'total_level': total_level
    }

    return render(request, 'admin_page.html', context)


def add_level(request):
    if request.method == "POST":
        level_name = request.POST.get('level_name')
        duration_hours = request.POST.get('duration')
        try:
            duration = timedelta(minutes=int(duration_hours))  # Soatlarni timedelta ga aylantirish
        except ValueError:
            return render(request, 'add_level.html', {'error': 'Duration must be a valid number.'})

        level = Level.objects.create(level_name=level_name, duration=duration)
        level.save()

    return render(request, 'add_level.html')


def add_question(request):
    levels = Level.objects.all()
    if request.method == "POST":
        level_id = request.POST.get("level_id")
        level_instance = Level.objects.get(id=level_id)
        text = request.POST.get('text')
        answer_1 = request.POST.get('answer_1')
        answer_2 = request.POST.get('answer_2')
        answer_3 = request.POST.get('answer_3')
        answer_4 = request.POST.get('answer_4')
        is_correct = request.POST.get('is_correct')
        level = level_instance
        question = Question.objects.create(
            text=text, answer_1=answer_1, answer_2=answer_2, answer_3=answer_3, answer_4=answer_4,
            is_correct=is_correct, level=level
        )
        question.save()
    return render(request, 'add_question.html', {"levels": levels})


def user_logout(request):
    logout(request)
    return redirect('home')


def level_list(request):
    levels = Level.objects.all()
    return render(request, 'level_list.html', {'levels': levels})


def question_list(request, level_id):
    level = get_object_or_404(Level, id=level_id)
    questions = Question.objects.filter(level=level)
    duration = level.duration.total_seconds()
    return render(request, 'question_list.html', {'level': level, 'questions': questions, 'duration': duration})


def submit_answers(request, level_id):
    if request.method == 'POST':
        level = get_object_or_404(Level, id=level_id)
        questions = Question.objects.filter(level=level)

        score = 0
        total_questions = questions.count()

        for question in questions:
            user_answer = request.POST.get(f'question_{question.id}')
            if user_answer and user_answer == str(question.is_correct):
                score += 1

        Answer.objects.create(
            user_name=request.user,  # Changed to ForeignKey
            answer=score,  # Changed to correct field
            level_id=level,
        )

        return render(request, 'result.html', {
            'level': level,
            'score': score,
            'total_questions': total_questions,
        })

    return redirect('level_list')


def ranked_users(request):
    selected_level = request.GET.get('level_id')

    results = (
        Answer.objects
        .values('user_name', 'answer')
        .filter(level_id=selected_level)
        .order_by('answer')[::-1]
    )

    levels = Level.objects.all()

    context = {
        'levels': levels,
        'results': results,
        'selected_level': selected_level,
    }
    return render(request, 'ranked_users.html', context)


def level_delete(request):
    if request.method == "POST":
        level_id = request.POST.get('level_id')
        level = get_object_or_404(Level, id=level_id)
        level.delete()
    levels = Level.objects.all()
    if not levels.exists():
        return redirect('admin_page')

    levels = Level.objects.all()
    return render(request, 'level_deleted.html', {'level': levels})
