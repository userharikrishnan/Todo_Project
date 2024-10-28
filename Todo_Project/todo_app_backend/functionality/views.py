from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import Todo, Project
from .serializers import TodoSerializer, ProjectSerializer


#register

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = UserCreationForm(request.data)
    if form.is_valid():
        user = form.save()
        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    else:
        print(form.errors)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


# Login a User

@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if username is None or password is None or email is None:
        return Response({'error': 'Please provide username , email and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, email=email, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'id': user.id, 'username': user.username,'email': user.email, 'token': token.key}, status=HTTP_200_OK)



# User Logout

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response({'Message': 'You are logged out'},status=status.HTTP_200_OK)







# create a New project

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# List all projects

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Listprojects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


# Show a single project

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectSerializer(project)
    return Response(serializer.data)




# Edit a single project

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectSerializer(project, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# add a todo

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_todo(request, project_id):
    projects = get_object_or_404(Project, pk=project_id)
    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(project=projects)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#list todo

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def todo_list(request,project_id):
    projects = get_object_or_404(Project, pk=project_id)
    todos = Todo.objects.filter(project=projects)
    serializer = TodoSerializer(todos, many=True)
    return Response(serializer.data)




# Update todo

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    serializer = TodoSerializer(todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Todo updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# Delete todo

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_todo(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.delete()
    return Response({'message': 'Todo deleted successfully'}, status=status.HTTP_200_OK)




#update todo status


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_todo_status(request, todo_id):
    todo = get_object_or_404(Todo, pk=todo_id)
    new_status = request.data.get('status')  

    if new_status is not None:
        todo.status = new_status
        todo.save()
        return Response({'message': 'Todo status updated successfully', 'status': todo.status}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Status not provided'}, status=status.HTTP_400_BAD_REQUEST)