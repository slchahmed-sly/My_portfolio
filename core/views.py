from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Project, Skill, Post, ContactMessage, Comment
from .serializers import (
    ProjectSerializer, 
    SkillSerializer, 
    PostSerializer, 
    ContactMessageSerializer,
    CommentSerializer
)

# -----------------
# SKILLS
# -----------------
class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


# -----------------
# PROJECTS
# -----------------
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


# -----------------
# BLOG POSTS
# -----------------
class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(is_active=True)
    serializer_class = PostSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


# -----------------
# CONTACT & COMMENTS
# -----------------
class ContactCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]