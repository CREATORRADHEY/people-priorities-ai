from firebase_admin import firestore
from google.cloud.firestore import Client

def get_firestore_client() -> Client:
    """
    Returns the initialized Firestore client instance.
    """
    return firestore.client()
