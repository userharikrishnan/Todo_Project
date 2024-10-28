from functionality import views
from django.urls import path

urlpatterns = [
    path('register', views.signup, name='register'),             
    path('login', views.login, name='login'),            
    path('logout', views.logout, name='logout'),           
    
    # Project paths
    path('projects/', views.Listprojects, name='list_projects'),  
    path('projects/create', views.create_project, name='create_project'),  
    path('projects/<int:project_id>/', views.get_project, name='get_project'),  
    path('projects/<int:project_id>/edit', views.edit_project, name='edit_project'),  
    path('projects/<int:project_id>/todos', views.todo_list, name='todo_list'), 
    path('projects/<int:project_id>/todos/create', views.create_todo, name='create_todo'), 
    
    
    # Todo paths
    path('todos/<int:pk>/update', views.update_todo, name='update_todo'),  
    path('todos/<int:pk>/delete', views.delete_todo, name='delete_todo'), 
    path('todos/<int:todo_id>/status', views.update_todo_status, name='update_todo_status'),  
]
