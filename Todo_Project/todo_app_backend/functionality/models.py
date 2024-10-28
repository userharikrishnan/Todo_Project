from django.db import models

#database schema for projects table

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title




#databse schema for todos table


class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, related_name="todos", on_delete=models.CASCADE)
    description = models.TextField()
    status = models.BooleanField(default=False)  
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.description} - {'Complete' if self.status else 'Pending'}"

