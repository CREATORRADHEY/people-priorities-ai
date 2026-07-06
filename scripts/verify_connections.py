#!/usr/bin/env python
import os
import sys
from dotenv import load_dotenv

# Ensure we can load app
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai

def verify_firebase():
    print("--- Verifying Firebase SDK Connection ---")
    firebase_project_id = os.getenv("FIREBASE_PROJECT_ID", "mock-firebase-project-id")
    google_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    try:
        # Check if initialized
        try:
            app = firebase_admin.get_app()
            print("Firebase Admin already initialized.")
        except ValueError:
            if google_creds and os.path.exists(google_creds):
                print(f"Initializing Firebase using credentials file: {google_creds}")
                cred = credentials.Certificate(google_creds)
                app = firebase_admin.initialize_app(cred)
            else:
                print(f"Initializing Firebase with project ID: {firebase_project_id}")
                os.environ.setdefault("GOOGLE_CLOUD_PROJECT", firebase_project_id)
                app = firebase_admin.initialize_app(options={"projectId": firebase_project_id})
        
        db = firestore.client()
        print("Firebase SDK: Connection Successful.")
        return True
    except Exception as e:
        print(f"Firebase SDK: Initialization failed: {e}")
        return False

def verify_gemini():
    print("--- Verifying Gemini SDK Connection ---")
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or gemini_key == "mock_gemini_key":
        print("Warning: GEMINI_API_KEY is not set or is using placeholder 'mock_gemini_key'.")
        print("Using dummy credentials for validation...")
        genai.configure(api_key="MOCK_API_KEY_VAL")
    else:
        print("Gemini API key is configured.")
        genai.configure(api_key=gemini_key)
        
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print(f"Gemini SDK: Model '{model.model_name}' initialized successfully.")
        return True
    except Exception as e:
        print(f"Gemini SDK: Initialization failed: {e}")
        return False

def main():
    fb_ok = verify_firebase()
    gemini_ok = verify_gemini()
    
    print("--- Verification Summary ---")
    print(f"Firebase SDK Status: {'SUCCESS' if fb_ok else 'FAILED'}")
    print(f"Gemini SDK Status:   {'SUCCESS' if gemini_ok else 'FAILED'}")
    
    if fb_ok and gemini_ok:
        print("All system connection tests passed.")
        sys.exit(0)
    else:
        print("Some connection tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
