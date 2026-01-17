from modeltranslation.translator import register, TranslationOptions
from .models import Project, Post, Skill, TimelineEvent, Tag

@register(Project)
class ProjectTranslationOptions(TranslationOptions):
    fields = ('title', 'short_description', 'full_description')

@register(Post)
class PostTranslationOptions(TranslationOptions):
    fields = ('title', 'content')

@register(TimelineEvent)
class TimelineEventTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

