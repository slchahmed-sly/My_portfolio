"""
For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""
# All setting that are were not in the initial settings will be marked with a comment "# <-- need to look this up"

from pathlib import Path
import os
import dj_database_url
from pathlib import Path
import datetime
# from dotenv import load_dotenv  
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# load_dotenv() # <-- need to look this up 



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-nvri5(7pn!ofrjw0q)9l#g!0e42he%(7qyd#yh0-i$v^q5%lgr'
SECRET_KEY = os.environ.get('SECRET_KEY', '7pn!ofrjw0q)9l#g!0e42he%(7qyd#yh0-i$v^q5%lgr') # <-- need to look this up 
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=True)

ALLOWED_HOSTS = ['*'] 


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 3rd parties
    'cloudinary_storage', # <-- need to look this up 
    'rest_framework',
    'corsheaders',
    'markdownx',

    # apps 
    'core',
    'cloudinary',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware", # <-- need to look this up 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://*.up.railway.app', # This allows any railway subdomain
]


ROOT_URLCONF = 'portfolio.urls' 

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'portfolio.wsgi.application' # <-- need to look this up 


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

database_url = os.environ.get("DATABASE_URL") # <-- need to look this up 
if database_url:
    DATABASES["default"] = dj_database_url.parse(database_url) # <-- need to look this up 
# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)


STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # Added MEDIA_ROOT
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


 # <-- need to look this up 

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Markdownx settings
MARKDOWNX_IMAGE_MAX_SIZE = {'size': (4000, 4000), 'quality': 100}
MARKDOWNX_MEDIA_PATH = datetime.datetime.now().strftime('markdownx/%Y/%m/%d')
MARKDOWNX_UPLOAD_MAX_SIZE = 50 * 1024 * 1024 # 50 MB
MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']


CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'), # <-- need to look this up 
    'API_KEY': env('CLOUDINARY_API_KEY'), # <-- need to look this up 
    'API_SECRET': env('CLOUDINARY_API_SECRET'), # <-- need to look this up 
    'MDX_UPLOAD_DATA': {'unique_filename': False},
    'EXTRA_PARAMS': {
       'unique_filename': False,
    }
}
print(env('CLOUDINARY_API_KEY'))

# STATICFILES_STORAGE = "cloudinary_storage.storage.StaticHashedCloudinaryStorage"
# DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage' # <-- need to look this up 

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}