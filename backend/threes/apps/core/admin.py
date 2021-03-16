from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import EmailUser


class EmailUserAdmin(UserAdmin):
    model = EmailUser
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_active")})
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "field": ("username", "password1", "password2"),
        }),
    )
    list_display = ("email", "is_staff", "is_active")
    list_filter = ("email", "is_staff", "is_active")
    search_fields = ("email",)
    ordering = ("email",)

admin.site.register(EmailUser, EmailUserAdmin)