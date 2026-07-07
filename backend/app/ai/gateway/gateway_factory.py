"""
gateway_factory.py

Returns the active AI gateway implementation.

The pipeline always obtains its gateway through this factory — never
by instantiating GeminiGateway directly. This allows the concrete
implementation to be replaced (e.g. for a different AI provider or a
mock in tests) without touching pipeline code.
"""
from app.ai.gateway.base_gateway import BaseAIGateway

_gateway_instance: BaseAIGateway | None = None


def get_gateway() -> BaseAIGateway:
    """
    Return the singleton AI gateway instance.

    Lazy-initialises GeminiGateway on first call.
    Tests override this by calling set_gateway().
    """
    global _gateway_instance
    if _gateway_instance is None:
        from app.ai.gateway.gemini_gateway import GeminiGateway
        _gateway_instance = GeminiGateway()
    return _gateway_instance


def set_gateway(gateway: BaseAIGateway) -> None:
    """
    Replace the active gateway instance.

    Used in tests to inject a mock gateway without modifying application code.
    """
    global _gateway_instance
    _gateway_instance = gateway


def reset_gateway() -> None:
    """
    Reset the singleton — forces lazy re-initialisation on next call.

    Used in test teardown to prevent state leaking between tests.
    """
    global _gateway_instance
    _gateway_instance = None
