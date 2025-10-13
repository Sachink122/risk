"""
A simple in-memory user store for demonstration purposes.
In a production environment, this would be replaced with database operations.
"""

from typing import Dict, Optional, List

# In-memory user store
# Format: {email: {user_data}}
_user_store: Dict[str, Dict] = {}
_next_user_id = 2  # Start from 2 as ID 1 is reserved for the default admin

def register_user(
    email: str,
    password: str,
    full_name: str,
    department: str,
    is_admin: bool = False,
    is_reviewer: bool = False
) -> Dict:
    """
    Register a new user in the memory store
    """
    global _next_user_id
    
    if email in _user_store:
        return None  # User already exists
    
    user_data = {
        'id': _next_user_id,
        'email': email,
        'password': password,  # In production, this would be hashed!
        'full_name': full_name,
        'department': department,
        'is_admin': is_admin,
        'is_reviewer': is_reviewer,
        'is_active': True
    }
    
    _user_store[email] = user_data
    _next_user_id += 1
    
    return user_data

def get_registered_user(email: str) -> Optional[Dict]:
    """
    Get a registered user by email
    """
    return _user_store.get(email)

def get_all_users() -> List[Dict]:
    """
    Get all registered users
    """
    return list(_user_store.values())