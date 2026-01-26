from pathlib import Path
import os
import datetime
import environ
import dj_database_url

# 1. Initialize Environ
env = environ.Env()
# Read .env if it exists (useful for local dev)
environ.Env.read_env(os.path.join(Path(__file__).resolve().parent.parent, '.env'))

BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Security: Never default SECRET_KEY or DEBUG to insecure values in production
SECRET_KEY = env('SECRET_KEY') # Will raise error if missing in Railway variables
DEBUG = env.bool('DEBUG', default=False)

# 3. Allowed Hosts: Who can VISIT this Django app?
# This strictly needs to be the Railway URL (where Django lives)
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1', 
    '.up.railway.app' # Covers your Railway generated URL
]

# Application definition
INSTALLED_APPS = [
    'modeltranslation',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 3rd parties
    'cloudinary_storage',
    'rest_framework',
    'corsheaders',
    'markdownx',
    'cloudinary', # Moved up to group 3rd parties together

    # apps 
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware", 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 4. CORS: Who can ASK for data? (Frontend Domains)
# We disable "Allow All" for security.
CORS_ALLOW_ALL_ORIGINS = False 
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://souleimane.com',
    'https://www.souleimane.com',
]

# 5. CSRF: Trusted origins for POST requests
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://souleimane.com',
    'https://www.souleimane.com',
    'https://*.up.railway.app',
]

ROOT_URLCONF = 'portfolio.urls' 

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'portfolio.wsgi.application'

# 6. Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

database_url = os.environ.get("DATABASE_URL") 
if database_url:
    DATABASES["default"] = dj_database_url.parse(database_url) 

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 7. Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('fr', 'French'),
    ('ar', 'Arabic'),
]
MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'

# 8. Static & Media Files
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') 
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# 9. Storage Settings (Optimized for Railway/WhiteNoise)
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        # Using CompressedManifest enables hashing and caching for better performance
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Markdownx settings
MARKDOWNX_IMAGE_MAX_SIZE = {'size': (4000, 4000), 'quality': 100}
MARKDOWNX_MEDIA_PATH = datetime.datetime.now().strftime('markdownx/%Y/%m/%d')
MARKDOWNX_UPLOAD_MAX_SIZE = 50 * 1024 * 1024 
MARKDOWNX_UPLOAD_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'), 
    'MDX_UPLOAD_DATA': {'unique_filename': False},
    'EXTRA_PARAMS': {
       'unique_filename': False,
    }
}

