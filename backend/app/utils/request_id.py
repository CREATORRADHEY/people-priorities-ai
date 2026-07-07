import threading
from datetime import datetime

_counter = 0
_counter_lock = threading.Lock()
_last_date_str = ""

def generate_request_id() -> str:
    """
    Generates a unique Request ID in the format: SUB-[YYYYMMDD]-[6-digit sequence]
    Example: SUB-20260707-000001
    The counter is thread-safe and resets when the date changes.
    """
    global _counter, _last_date_str
    
    # Use UTC date to avoid timezone offset discrepancies
    now = datetime.utcnow()
    date_str = now.strftime("%Y%m%d")
    
    with _counter_lock:
        if date_str != _last_date_str:
            _counter = 1
            _last_date_str = date_str
        else:
            _counter += 1
        seq = f"{_counter:06d}"
        
    return f"SUB-{date_str}-{seq}"
