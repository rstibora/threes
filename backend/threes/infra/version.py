from logging import getLogger
import subprocess
from typing import Optional

from django.conf import settings


def git_tag() -> Optional[str]:
    """
    Retrieves and returns tag of the last commit. Returns None if the latest commit
    does not have a tag.
    """
    try:
        return = subprocess.run(
            ["git", "-C", f"{settings.BASE_DIR}", "tag", "--points-at", "HEAD"],
            stdout=subprocess.PIPE, check=True, text=True).stdout
    except Exception as e:
        getLogger(__name__).error(e)
        return None


def git_hash() -> Optional[str]:
    """
    Retrieves and return hash of the last commit.
    """
    try:
        return subprocess.run(
            ["git", "-C", f"{settings.BASE_DIR}", "log", "-1", "--pretty=format:%h"],
            stdout=subprocess.PIPE, check=True, text=True).stdout
    except Exception as e:
        getLogger(__name__).error(e)
        return None


def git_date() -> Optional[str]:
    """
    Retrieves and return date and time of the last commit.
    """
    try:
        return subprocess.run(
            ["git", "-C", f"{settings.BASE_DIR}", "log", "-1", "--pretty=format:%ci"],
            stdout=subprocess.PIPE, check=True, text=True).stdout
    except Exception as e:
        getLogger(__name__).error(e)
        return None


def git_is_clean() -> Optional[bool]:
    """
    Returns whether the git is clean.
    """
    try:
        changes = subprocess.run(
            ["git", "-C", f"{settings.BASE_DIR}", "status", "--untracked-files", "no",
             "--porcelain"],
            stdout=subprocess.PIPE, check=True, text=True).stdout
        return not changes
    except Exception as e:
        getLogger(__name__).error(e)
        return None
