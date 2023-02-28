from deta import Base, _Base
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from typing import TypeVar, Generic, Any, TypedDict

app = FastAPI()
# Connect to a Base to store user data
users_db = Base("users")

# Boilerplate to make the Base generic
T = TypeVar("T")


class Registry(Generic[T]):
    def __init__(self, base: _Base) -> None:
        self._base = base

    def get(self, key: str) -> T | None:
        untyped_value: Any = self._base.get(key)
        return untyped_value

    def insert(self, value: T, key: str):
        untyped_value: Any = value
        return self._base.insert(untyped_value, key)

    ...


# Define the user type
class User(TypedDict):
    id: str
    name: str
    email: str


# Use generics to create a typed registry
user_registry = Registry[User](users_db)

# Get a user from the Base
user = user_registry.get("123")

# If there is a typo in my code (email -> mail), my linting tool will catch it
user_registry.insert({"id": "123", "name": "John", "mail": "yolo"}, "123")


@app.get("/")
async def root():
    return JSONResponse({"message": "Hello World!"})


@app.get("/users/{user_id}")
async def get_user(user_id: str):
    # Get the user from the Base
    user = users_db.get(user_id)
    # If the user doesn't exist, return a 404 error
    if user is None:
        raise HTTPException(status_code=404)
    return user


@app.post("/users")
async def create_user(user: dict):
    try:
        # Insert the user into the Base. If the user already exists, this will raise an exception
        response = users_db.insert(user, user["id"])
        status = 201
    except Exception as exc:
        # If the user already exists, return a 409 error
        response = {"message": str(exc)}
        status = 409
    return JSONResponse(response, status_code=status)
