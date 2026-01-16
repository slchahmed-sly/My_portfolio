from rest_framework import serializers
from .models import Tag, Skill, Project, Post, Comment, ContactMessage, TimelineEvent

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'logo', 'is_key_skill', 'category']

class ProjectSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True) # <-- need to look this up 

    class Meta:
        model = Project
        fields = [
            'id', 
            'title', 
            'slug', 
            'short_description', 
            'full_description', 
            'thumbnail', 
            'repo_link', 
            'demo_link', 
            'tags', 
            'is_featured', 
            'category',
            'created_at'
        ]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author_name', 'body', 'created_at']
        read_only_fields = ['created_at']  # <-- need to look this up 

class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True) # <-- need to look this up 
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 
            'title', 
            'slug', 
            'content', 
            'tags', 
            'is_active', 
            'created_at',
            'comment_count'
        ]

    def get_comment_count(self, obj):
        return obj.comments.filter(is_approved=True).count()

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'timestamp']
        read_only_fields = ['timestamp']  # <-- need to look this up 

class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ['id', 'year', 'title', 'description', 'order']