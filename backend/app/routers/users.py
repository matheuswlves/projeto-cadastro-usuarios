from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from .. import crud, schemas, security

router = APIRouter(prefix="/api", tags=["Users & Authentication"])

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(email=form_data.username)
    if not user or not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = security.create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/users/", response_model=schemas.UserOut, status_code=201)
def create_user_route(user: schemas.UserCreate):
    new_user = crud.create_user(user=user)
    if "error" in new_user:
        raise HTTPException(status_code=400, detail=new_user["error"])
    return new_user

@router.get("/users/", response_model=List[schemas.UserOut])
def read_users():
    return crud.get_users()