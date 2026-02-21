import os
import re

from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from django_ckeditor_5.fields import CKEditor5Field
from django_ckeditor_5.storage_utils import get_django_storage

import logging

logger = logging.getLogger(__name__)

__all__ = [
    "cleanup_ckeditor_images_on_delete",
    "cleanup_unused_ckeditor_images_on_update",
]


def extract_image_paths(html_content):
    """
    Extracts image paths from the HTML content stored in CKEditor5Field.
    """
    if not html_content:
        return []
    return re.findall(r'<img[^>]*\ssrc=["\']([^"\']+)["\']', html_content)


def delete_images(storage, image_paths):
    """
    Deletes images from disk based on the provided paths.
    """
    if hasattr(storage, "location"):
        for img_path in image_paths:
            file_name = os.path.basename(img_path)
            abs_path = os.path.join(storage.location, file_name)
            if os.path.exists(abs_path):
                os.remove(abs_path)
    else:
        logger.warning(
            "Storage does not have 'location' attribute, skipping file deletion."
        )


def get_safe_storage():
    """Safely returns a storage instance based on Django settings."""
    try:
        return get_django_storage()
    except Exception as e:
        logger.error(f"Could not initialize storage class: {e}")
        return None


@receiver(pre_delete)
def cleanup_ckeditor_images_on_delete(sender, instance, **kwargs):
    """
    Removes images from disk when an object is deleted.
    If an error occurs, it is logged, but the deletion process continues.
    """
    if not any(isinstance(f, CKEditor5Field) for f in instance._meta.fields):
        return
    try:
        storage = get_safe_storage()
        if not storage:
            return

        # Find CKEditor5Field dynamically
        images_to_delete = []
        for field in instance._meta.fields:
            if isinstance(field, CKEditor5Field):
                images_to_delete.extend(
                    extract_image_paths(getattr(instance, field.name, ""))
                )

        try:
            delete_images(storage, images_to_delete)
        except Exception as e:
            logger.warning(f"Failed to delete images on object deletion: {e}")
    except Exception as e:
        logger.error(f"Error in cleanup_ckeditor_images_on_delete: {e}")


@receiver(pre_save)
def cleanup_unused_ckeditor_images_on_update(sender, instance, **kwargs):
    """
    Removes unused images when an object is updated.
    If any unexpected error occurs, it will be logged, but the deletion process won't break the update.
    """
    ckeditor_fields = [
        f for f in instance._meta.fields if isinstance(f, CKEditor5Field)
    ]
    if not ckeditor_fields:
        return
    if instance._state.adding or instance.pk is None:
        return
    try:
        storage = get_safe_storage()
        if not storage:
            return

        try:
            old_instance = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            return

        for field in ckeditor_fields:
            old_images = set(extract_image_paths(getattr(old_instance, field.name, "")))
            new_images = set(extract_image_paths(getattr(instance, field.name, "")))
            unused_images = old_images - new_images

            try:
                delete_images(storage, unused_images)
            except Exception as e:
                logger.warning(f"Failed to delete unused images: {e}")
    except Exception as e:
        logger.error(f"Error in cleanup_unused_ckeditor_images_on_update: {e}")
