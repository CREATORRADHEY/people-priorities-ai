"""
prompt_builder.py

Injects runtime variables into a loaded prompt template.

Responsibilities (split from prompt_loader.py):
  - Accept a raw template string and a variables dict
  - Substitute {variable} placeholders using str.format_map
  - Raise PromptException on missing or extra variables
"""
from app.ai.exceptions import PromptException


def build_prompt(template: str, variables: dict) -> str:
    """
    Inject variables into a prompt template.

    Uses str.format_map with a safe mapping that raises PromptException
    for missing keys instead of the default KeyError.

    Args:
        template:  Raw template string loaded by prompt_loader.
        variables: Dict of variable names to string values.

    Returns:
        The final prompt string ready to send to the AI gateway.

    Raises:
        PromptException: If a required placeholder is missing from variables.
    """
    class _StrictMap(dict):
        def __missing__(self, key: str) -> str:
            raise PromptException(
                f"Prompt template requires variable '{{{key}}}' "
                f"but it was not provided. Supplied keys: {list(self.keys())}"
            )

    try:
        return template.format_map(_StrictMap(variables))
    except PromptException:
        raise
    except Exception as exc:
        raise PromptException(
            f"Unexpected error during prompt variable injection: {exc}"
        ) from exc
