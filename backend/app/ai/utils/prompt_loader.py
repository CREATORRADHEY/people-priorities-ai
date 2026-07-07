"""
prompt_loader.py

Reads prompt template files from the versioned prompts directory.
Raises PromptException if the file or version directory cannot be found.

Responsibilities (split from prompt_builder.py):
  - Locate the correct version directory using manifest.json
  - Read the raw markdown template string
  - Return the unmodified template for injection by prompt_builder
"""
import json
from pathlib import Path

from app.ai.exceptions import PromptException

# Root of the prompts directory, relative to this file
_PROMPTS_ROOT = Path(__file__).parent.parent / "prompts"


def load_manifest(version: str = "v1") -> dict:
    """
    Load and return the manifest.json for the given prompt version.

    Raises PromptException if the version directory or manifest is missing.
    """
    manifest_path = _PROMPTS_ROOT / version / "manifest.json"
    if not manifest_path.exists():
        raise PromptException(
            f"Prompt manifest not found for version '{version}': {manifest_path}"
        )
    try:
        return json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise PromptException(
            f"Prompt manifest for version '{version}' contains invalid JSON: {exc}"
        ) from exc


def load_prompt_template(prompt_name: str, version: str = "v1") -> str:
    """
    Load the raw markdown template for the named prompt.

    Args:
        prompt_name: Key in manifest.json prompts dict (e.g. "stage1_normalize").
        version:     Prompt version directory (default "v1").

    Returns:
        The raw template string with {variable} placeholders intact.

    Raises:
        PromptException: If the manifest entry or file cannot be found.
    """
    manifest = load_manifest(version)
    prompts = manifest.get("prompts", {})
    if prompt_name not in prompts:
        raise PromptException(
            f"Prompt '{prompt_name}' not found in manifest version '{version}'. "
            f"Available: {list(prompts.keys())}"
        )
    filename = prompts[prompt_name]["file"]
    template_path = _PROMPTS_ROOT / version / filename
    if not template_path.exists():
        raise PromptException(
            f"Prompt file '{filename}' for '{prompt_name}' not found at {template_path}"
        )
    return template_path.read_text(encoding="utf-8")


def get_prompt_version_from_manifest(prompt_name: str, version: str = "v1") -> str:
    """
    Return the individual prompt version string from the manifest.

    Used by the pipeline to record promptVersion in AnalysisResult.
    """
    manifest = load_manifest(version)
    prompts = manifest.get("prompts", {})
    if prompt_name not in prompts:
        raise PromptException(
            f"Prompt '{prompt_name}' not found in manifest version '{version}'."
        )
    return prompts[prompt_name].get("version", "unknown")
