from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users
from . import crud, schemas

app = FastAPI(title="API de Cadastro de Usuários com JSON DB")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://projeto-cadastro-usuarios-zpdi.vercel.app", # Sua URL da Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(users.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "API de Cadastro de Usuários funcionando com JSON DB"}

@app.on_event("startup")
def create_first_user_if_needed():
    users = crud.get_users()
    if not users:
        print("Criando usuário administrador padrão...")
        admin_user = schemas.UserCreate(
            email="admin@admin.com",
            nome="Admin",
            sobrenome="User",
            senha="admin"
        )
        crud.create_user(user=admin_user)
        print("Usuário 'admin@admin.com' criado.")