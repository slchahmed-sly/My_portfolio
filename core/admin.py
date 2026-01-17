from django.contrib import admin
from .models import *
from markdownx.admin import MarkdownxModelAdmin
from modeltranslation.admin import TranslationAdmin

# Register your models here.

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo', 'is_key_skill')

class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'timestamp')

class ProjectAdmin(TranslationAdmin, MarkdownxModelAdmin):
    list_display = ('title', 'slug', 'category', 'short_description', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}

class PostAdmin(TranslationAdmin, MarkdownxModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'created_at')
    prepopulated_fields = {'slug': ('title',)}

class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author_name', 'body', 'created_at', 'is_approved')

class TimelineEventAdmin(TranslationAdmin):
    list_display = ('year', 'title', 'description', 'order')

admin.site.register(Tag, TagAdmin)
admin.site.register(TimelineEvent, TimelineEventAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(ContactMessage, ContactMessageAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
