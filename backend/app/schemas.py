# from pydantic import BaseModel , Field
# from typing import Optional 

# # Base
# class TodoBase(BaseModel):
#     title: str = Field(..., min_length=1 , max_length=100)

# #creating a new todo item 
# class TodoCreate(TodoBase):
#     pass

# class Todo(TodoBase):
#     id:int
#     completed:bool = False 

#     class Config :
#         from_attributes = True 

# class TodoUpdate(BaseModel):
#     title: Optional[str] = None
#     completed:Optional[bool]=None   

from pydantic import BaseModel

# ✅ For creating todo
class TodoCreate(BaseModel):
    title: str

# ✅ For returning todo
class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True  # ✅ IMPORTANT for SQLAlchemy

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
