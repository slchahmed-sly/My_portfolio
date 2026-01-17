from modeltranslation.translator import register, TranslationOptions
from .models import Project, Post, Skill, TimelineEvent, Tag

@register(Project)
class ProjectTranslationOptions(TranslationOptions):
    fields = ('title', 'short_description', 'full_description', 'category')

@register(Post)
class PostTranslationOptions(TranslationOptions):
    fields = ('title', 'content')

@register(Skill)
class SkillTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(TimelineEvent)
class TimelineEventTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

@register(Tag)
class TagTranslationOptions(TranslationOptions):
    fields = ('name',)
