from django.db import models
from django.utils.text import slugify
from markdownx.models import MarkdownxField 

# The Tag Model
class Tag(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(db_index=True, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

# Skill Model
class Skill(models.Model):
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='skills') 
    is_key_skill = models.BooleanField(default=False)

    def __str__(self):
        return self.name

# Contact Message
class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Projects Model
class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(db_index=True, unique=True)
    short_description = models.TextField()
    full_description = MarkdownxField() 
    
    thumbnail = models.ImageField(upload_to='projects')
    repo_link = models.URLField()
    demo_link = models.URLField()
    tags = models.ManyToManyField(Tag, related_name='projects') 
    
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

# Post (Blog) Model
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(db_index=True, unique=True)
    content = MarkdownxField() 
    tags = models.ManyToManyField(Tag, related_name='posts') 
    
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

# Comment Model
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.author_name} on {self.post.title}"