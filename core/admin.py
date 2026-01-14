from django.contrib import admin
from .models import *
from markdownx.admin import MarkdownxModelAdmin
# Register your models here.

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo', 'is_key_skill')

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'timestamp')

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'short_description', 'is_featured', 'created_at')
    prepopulated_fields = {'slug': ('title',)}

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('title',)}

class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author_name', 'body', 'created_at', 'is_approved')

admin.site.register(Tag, TagAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(ContactMessage, ContactMessageAdmin)
admin.site.register(Project,MarkdownxModelAdmin)
admin.site.register(Post,MarkdownxModelAdmin)
admin.site.register(Comment, CommentAdmin)
