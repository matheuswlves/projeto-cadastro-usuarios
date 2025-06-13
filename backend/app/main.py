from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Cadastro de Usuários")

origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "API de Cadastro de Usuários funcionando"}