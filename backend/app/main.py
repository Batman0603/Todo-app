# from fastapi import FastAPI
# from typing import List
# from .schemas import Todo, TodoCreate , TodoUpdate
# from fastapi import FastAPI, HTTPException, Path

# app = FastAPI()

# from fastapi.middleware.cors import CORSMiddleware


# # ✅ MUST be added RIGHT AFTER app creation
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # 🔥 IMPORTANT (Vite default)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# todos: List[Todo]=[]
# todo_id_counter = 1


# @app.get("/")
# def home():
#     return {"message": "Todo App is running successfully!"}

# @app.get("/todos", response_model = List[Todo])
# def get_todos():
#     return todos 

# @app.post("/todos", response_model=Todo)
# def create_todo(todo:TodoCreate):
#     global todo_id_counter 

#     try:
#         new_todo=Todo(
#             id=todo_id_counter,
#             title=todo.title,
#             completed=False
#         )
#         todos.append(new_todo)
#         todo_id_counter += 1

#         return new_todo

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # @app.put("/todos/{todo_id}", response_model=Todo)
# # def update_todo(
# #     todo_id: int = Path(..., gt=0),
# #     updated_data: TodoUpdate = None
# # ):
# #     try:
# #         for index, todo in enumerate(todos):
# #             if todo.id == todo_id:

# #                 # Update fields if provided
# #                 if updated_data.title is not None:
# #                     if len(updated_data.title.strip()) == 0:
# #                         raise HTTPException(
# #                             status_code=400,
# #                             detail="Title cannot be empty"
# #                         )
# #                     todo.title = updated_data.title

# #                 if updated_data.completed is not None:
# #                     todo.completed = updated_data.completed

# #                 todos[index] = todo
# #                 return todo

# #         # If not found
# #         raise HTTPException(status_code=404, detail="Todo not found")

# #     except HTTPException:
# #         raise
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
    
# @app.delete("/todos/{todo_id}")
# def delete_todo(todo_id: int = Path(..., gt=0)):
#     try:
#         for index, todo in enumerate(todos):
#             if todo.id == todo_id:
#                 todos.pop(index)
#                 return {"message": "Todo deleted successfully"}

#         raise HTTPException(status_code=404, detail="Todo not found")

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# @app.put("/todos/{todo_id}")
# def toggle_todo(todo_id: int):
#     found = False

#     for t in todos:
#         if int(t.id) == todo_id:
#             t["completed"] = not t["completed"]
#             found = True
#             return {"message": "Updated"}

#     if not found:
#         return {"error": "Todo not found"}

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from . import auth

# ✅ Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    # 🔍 check if user exists
    existing_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # 🔐 hash password
    hashed = auth.hash_password(user.password)

    new_user = models.User(
        username=user.username,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

# 🔐 LOGIN
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": db_user.username})

    return {"access_token": token}


# ✅ GET
@app.get("/todos", response_model=list[schemas.TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)

# ✅ ADD
@app.post("/todos", response_model=schemas.TodoResponse)
def add_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo.title)

# ✅ DELETE
@app.delete("/todos/{todo_id}")
def delete(todo_id: int, db: Session = Depends(get_db)):
    result = crud.delete_todo(db, todo_id)
    if not result:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Deleted"}

@app.put("/todos/{todo_id}")
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)

    return todo