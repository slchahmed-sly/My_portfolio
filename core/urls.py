from django.urls import path
from . import views

urlpatterns = [
    # Skills
    path('skills/', views.SkillListView.as_view(), name='skill-list'),

    # Projects
    path('projects/', views.ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),

    # Blog Posts
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),

    # Contact & Comments
    path('contact/', views.ContactCreateView.as_view(), name='contact-create'),
    path('comments/', views.CommentCreateView.as_view(), name='comment-create'),
]