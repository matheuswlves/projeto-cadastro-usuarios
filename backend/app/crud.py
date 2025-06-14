import json
import threading
from typing import List, Dict, Optional

from . import schemas, security

DATABASE_FILE = "database.json"
db_lock = threading.Lock()


def _read_db() -> List[Dict]:
    """Lê todo o conteúdo do arquivo JSON."""
    with db_lock:
        try:
            with open(DATABASE_FILE, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

def _write_db(data: List[Dict]):
    """Escreve a lista completa de dados de volta no arquivo JSON."""
    with db_lock:
        with open(DATABASE_FILE, "w") as f:
            json.dump(data, f, indent=4)


def get_users() -> List[schemas.UserOut]:
    """Retorna todos os usuários."""
    users_db = _read_db()
    return users_db

def get_user_by_email(email: str) -> Optional[Dict]:
    print("--------------------------------------------------")
    print(f"--- CRUD: Iniciando busca pelo e-mail: '{email}' ---")
    
    users_db = _read_db()
    
    print(f"--- CRUD: Conteúdo lido do database.json: {users_db} ---")
    
    for user in users_db:
        print(f"--- CRUD: Comparando o e-mail recebido '{email}' com o e-mail do usuário no DB '{user.get('email')}' ---")
        if user.get("email") == email:
            print("--- CRUD: SUCESSO! Usuário ENCONTRADO. ---")
            print("--------------------------------------------------")
            return user

    print("--- CRUD: FALHA! Usuário NÃO encontrado após verificar todos os registros. ---")
    print("--------------------------------------------------")
    return None

def create_user(user: schemas.UserCreate) -> Dict:
    """Cria um novo usuário."""
    users_db = _read_db()

    if get_user_by_email(user.email):
        return {"error": "Email already registered"}

    new_id = len(users_db) + 1
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
