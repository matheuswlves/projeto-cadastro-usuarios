import json
import threading
from typing import List, Dict, Optional

from . import schemas, security

DATABASE_FILE = "database.json"
db_lock = threading.Lock()

def _read_db() -> List[Dict]:
    with db_lock:
        try:
            with open(DATABASE_FILE, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

def _write_db(data: List[Dict]):
    with db_lock:
        with open(DATABASE_FILE, "w") as f:
            json.dump(data, f, indent=4)

def get_users() -> List[schemas.UserOut]:
    users_db = _read_db()
    users_out = []
    for user in users_db:
        user_copy = user.copy()
        user_copy.pop("hashed_password", None)
        users_out.append(user_copy)
    return users_out

def get_user_by_email(email: str) -> Optional[Dict]:
    for user in _read_db():
        if user.get("email") == email:
            return user
    return None

def create_user(user: schemas.UserCreate) -> Dict:
    users_db = _read_db()
    if get_user_by_email(user.email):
        return {"error": "Email already registered"}
    
    new_id = max([u.get('id', 0) for u in users_db] + [0]) + 1
    hashed_password = security.get_password_hash(user.senha)
    new_user = {
        "id": new_id,
        "nome": user.nome,
        "sobrenome": user.sobrenome,
        "email": user.email,
        "hashed_password": hashed_password
    }
    users_db.append(new_user)
    _write_db(users_db)
    user_out = new_user.copy()
    user_out.pop("hashed_password")
    return user_out

def update_user(user_id: int, user_update: schemas.UserUpdate) -> Optional[Dict]:
    users_db = _read_db()
    user_found = False
    for i, user in enumerate(users_db):
        if user.get("id") == user_id:
            users_db[i]["nome"] = user_update.nome
            users_db[i]["sobrenome"] = user_update.sobrenome
            users_db[i]["email"] = user_update.email
            user_found = True
            break
    
    if user_found:
        _write_db(users_db)
        user_out = users_db[i].copy()
        user_out.pop("hashed_password", None)
        return user_out
    return None

def delete_user(user_id: int) -> Optional[Dict]:
    users_db = _read_db()
    user_to_delete = None
    for user in users_db:
        if user.get("id") == user_id:
            user_to_delete = user
            break

    if user_to_delete:
        users_db.remove(user_to_delete)
        _write_db(users_db)
        user_out = user_to_delete.copy()
        user_out.pop("hashed_password", None)
        return user_out
    return None