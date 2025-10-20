from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext
import jwt
from PIL import Image
import io
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Create upload directory
UPLOAD_DIR = ROOT_DIR / "uploads" / "products"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Create the main app
app = FastAPI()

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = "user"  # user or admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str]
    address: Optional[str]
    role: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

class ImageMetadata(BaseModel):
    url: str
    filename: str
    size: int  # in bytes
    width: int
    height: int

class ProductBase(BaseModel):
    name: str
    description: str
    category: str  # men or women
    price: float
    sizes: List[str]
    colors: List[str]
    stock: int = 100

class ProductCreate(ProductBase):
    images: List[ImageMetadata] = []

class Product(ProductBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    images: List[ImageMetadata] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str
    price: float

class CartBase(BaseModel):
    user_id: str
    items: List[CartItem] = []

class Cart(CartBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    size: str
    color: str
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping_address: str
    total_amount: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[OrderItem]
    total_amount: float
    shipping_address: str
    status: str = "pending"  # pending, processing, shipped, delivered
    payment_status: str = "pending"  # pending, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # men or women

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(token: str) -> dict:
    payload = decode_token(token)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.model_dump()
    user_dict["password"] = hash_password(user_dict["password"])
    user = User(**{k: v for k, v in user_dict.items() if k != "password"})
    
    doc = user.model_dump()
    doc["password"] = user_dict["password"]
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.users.insert_one(doc)
    
    token = create_token(user.id, user.email, user.role)
    
    return TokenResponse(
        token=token,
        user=UserResponse(**user.model_dump())
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"], user["role"])
    
    return TokenResponse(
        token=token,
        user=UserResponse(**{k: v for k, v in user.items() if k != "password"})
    )

@api_router.get("/auth/profile", response_model=UserResponse)
async def get_profile(token: str):
    user = await get_current_user(token)
    return UserResponse(**{k: v for k, v in user.items() if k != "password"})

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_profile(token: str, update_data: UserBase):
    user = await get_current_user(token)
    
    update_dict = update_data.model_dump()
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": update_dict}
    )
    
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    return UserResponse(**{k: v for k, v in updated_user.items() if k != "password"})

# ==================== PRODUCT ROUTES ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    size: Optional[str] = None,
    color: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None
):
    query = {}
    
    if category:
        query["category"] = category
    if size:
        query["sizes"] = size
    if color:
        query["colors"] = color
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product.get("created_at"), str):
        product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    return product

@api_router.post("/admin/products", response_model=Product)
async def create_product(token: str, product_data: ProductCreate):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    product = Product(**product_data.model_dump())
    doc = product.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.products.insert_one(doc)
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(token: str, product_id: str, product_data: ProductCreate):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_dict = product_data.model_dump()
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated_product.get("created_at"), str):
        updated_product["created_at"] = datetime.fromisoformat(updated_product["created_at"])
    
    return updated_product

@api_router.delete("/admin/products/{product_id}")
async def delete_product(token: str, product_id: str):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

@api_router.post("/admin/products/{product_id}/images")
async def upload_product_image(token: str, product_id: str, file: UploadFile = File(...)):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Read and validate image
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents))
        width, height = img.size
    except:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Save image
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Create metadata
    image_meta = ImageMetadata(
        url=f"/uploads/products/{filename}",
        filename=filename,
        size=len(contents),
        width=width,
        height=height
    )
    
    # Update product
    await db.products.update_one(
        {"id": product_id},
        {"$push": {"images": image_meta.model_dump()}}
    )
    
    return image_meta

# ==================== CART ROUTES ====================

@api_router.get("/cart", response_model=Cart)
async def get_cart(token: str):
    user = await get_current_user(token)
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    
    if not cart:
        # Create empty cart
        new_cart = Cart(user_id=user["id"])
        doc = new_cart.model_dump()
        doc["updated_at"] = doc["updated_at"].isoformat()
        await db.carts.insert_one(doc)
        return new_cart
    
    if isinstance(cart.get("updated_at"), str):
        cart["updated_at"] = datetime.fromisoformat(cart["updated_at"])
    
    return cart

@api_router.post("/cart/add")
async def add_to_cart(token: str, item: CartItem):
    user = await get_current_user(token)
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    
    if not cart:
        new_cart = Cart(user_id=user["id"], items=[item])
        doc = new_cart.model_dump()
        doc["updated_at"] = doc["updated_at"].isoformat()
        await db.carts.insert_one(doc)
    else:
        await db.carts.update_one(
            {"user_id": user["id"]},
            {
                "$push": {"items": item.model_dump()},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
    
    return {"message": "Item added to cart"}

@api_router.put("/cart/update")
async def update_cart(token: str, items: List[CartItem]):
    user = await get_current_user(token)
    
    await db.carts.update_one(
        {"user_id": user["id"]},
        {
            "$set": {
                "items": [item.model_dump() for item in items],
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Cart updated"}

@api_router.delete("/cart/remove/{product_id}")
async def remove_from_cart(token: str, product_id: str):
    user = await get_current_user(token)
    
    await db.carts.update_one(
        {"user_id": user["id"]},
        {
            "$pull": {"items": {"product_id": product_id}},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    return {"message": "Item removed from cart"}

@api_router.delete("/cart/clear")
async def clear_cart(token: str):
    user = await get_current_user(token)
    
    await db.carts.update_one(
        {"user_id": user["id"]},
        {
            "$set": {
                "items": [],
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Cart cleared"}

# ==================== ORDER ROUTES ====================

@api_router.post("/orders/create", response_model=Order)
async def create_order(token: str, order_data: OrderCreate):
    user = await get_current_user(token)
    
    order = Order(
        user_id=user["id"],
        **order_data.model_dump()
    )
    
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.orders.insert_one(doc)
    
    # Clear cart
    await db.carts.update_one(
        {"user_id": user["id"]},
        {"$set": {"items": []}}
    )
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_user_orders(token: str):
    user = await get_current_user(token)
    orders = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        if isinstance(order.get("created_at"), str):
            order["created_at"] = datetime.fromisoformat(order["created_at"])
    
    return orders

@api_router.get("/admin/orders", response_model=List[Order])
async def get_all_orders(token: str):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        if isinstance(order.get("created_at"), str):
            order["created_at"] = datetime.fromisoformat(order["created_at"])
    
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(token: str, order_id: str, status: str, payment_status: Optional[str] = None):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_dict = {"status": status}
    if payment_status:
        update_dict["payment_status"] = payment_status
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated"}

# ==================== CATEGORY ROUTES ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(1000)
    return categories

@api_router.post("/admin/categories", response_model=Category)
async def create_category(token: str, name: str, type: str):
    user = await get_current_user(token)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    category = Category(name=name, type=type)
    await db.categories.insert_one(category.model_dump())
    
    return category

# Include the router in the main app
app.include_router(api_router)

# Mount static files AFTER routes
app.mount("/uploads", StaticFiles(directory=str(ROOT_DIR / "uploads")), name="uploads")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()