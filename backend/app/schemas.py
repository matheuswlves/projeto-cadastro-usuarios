from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    nome: str
    sobrenome: str

class UserCreate(UserBase):
    senha: str

class UserUpdate(UserBase):
    pass

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None