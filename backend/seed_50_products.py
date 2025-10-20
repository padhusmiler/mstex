import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Local image paths (downloaded images)
LOCAL_IMAGES = [f"/uploads/products/tshirt_{i}.jpg" for i in range(1, 13)]

# Product templates for variety
PRODUCT_NAMES = [
    "Classic Cotton T-Shirt", "Premium Polo Shirt", "V-Neck Casual Tee", 
    "Round Neck Basic Tee", "Striped Cotton Shirt", "Solid Color T-Shirt",
    "Printed Graphic Tee", "Sports Performance Shirt", "Casual Henley Tee",
    "Long Sleeve T-Shirt", "Crew Neck Essential", "Vintage Wash Tee",
    "Urban Style Shirt", "Comfort Fit T-Shirt", "Athletic Fit Tee",
    "Relaxed Fit Casual", "Slim Fit T-Shirt", "Oversized Comfort Tee",
    "Pocket Style Shirt", "Button Down Casual", "Raglan Sleeve Tee",
    "Ringer Style Shirt", "Baseball Tee", "Scoop Neck T-Shirt",
    "Tank Top Style"
]

DESCRIPTIONS = [
    "Premium quality cotton t-shirt made in Tiruppur. Soft, breathable, and comfortable for all-day wear.",
    "High-grade knitted fabric with superior finish. Perfect for casual and semi-formal occasions.",
    "Durable and stylish t-shirt crafted with care. Ideal for everyday comfort and style.",
    "Expertly woven cotton fabric from Tiruppur's finest mills. Combines comfort with durability.",
    "Soft-touch finish with excellent color retention. A wardrobe essential for any season.",
    "Premium knitted wear designed for maximum comfort. Made with attention to every detail.",
    "Classic fit with modern styling. Perfect blend of comfort and fashion.",
    "Breathable cotton fabric ideal for warm weather. Maintains shape after multiple washes.",
    "Handpicked quality cotton processed in Tiruppur. Exceptionally soft and long-lasting.",
    "Contemporary design meets traditional craftsmanship. A perfect addition to your collection."
]

COLORS = [
    "Black", "White", "Navy Blue", "Gray", "Red", "Royal Blue", 
    "Dark Green", "Maroon", "Charcoal", "Sky Blue", "Olive Green",
    "Burgundy", "Steel Gray", "Forest Green", "Cream", "Beige",
    "Light Gray", "Dark Blue", "Wine", "Teal"
]

SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

async def seed_database():
    print("="*60)
    print("MS TEX - Database Seeding")
    print("="*60)
    print()
    
    # Clear existing products
    await db.products.delete_many({})
    print("✓ Cleared existing products")
    
    # Create admin user
    admin_email = "admin@mstex.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password": pwd_context.hash("admin123"),
            "name": "MS TEX Admin",
            "phone": "+91 421-1234567",
            "address": "17/1, Karuparayan Kovil Veethi, Velampalayam, Tiruppur, Tamil Nadu - 641652",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        print(f"✓ Created admin user: {admin_email}")
    else:
        # Update existing admin
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {
                "name": "MS TEX Admin",
                "phone": "+91 421-1234567",
                "address": "17/1, Karuparayan Kovil Veethi, Velampalayam, Tiruppur, Tamil Nadu - 641652"
            }}
        )
        print(f"✓ Updated admin user: {admin_email}")
    
    # Create sample user
    user_email = "customer@example.com"
    existing_user = await db.users.find_one({"email": user_email})
    
    if not existing_user:
        sample_user = {
            "id": str(uuid.uuid4()),
            "email": user_email,
            "password": pwd_context.hash("password123"),
            "name": "Sample Customer",
            "phone": "+91 98765 43210",
            "address": "123 Main Street, Chennai, Tamil Nadu",
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(sample_user)
        print(f"✓ Created sample user: {user_email}")
    else:
        print(f"✓ Sample user exists: {user_email}")
    
    print()
    print("Creating 50+ products...")
    print("-" * 60)
    
    products_created = 0
    
    # Generate 50+ products
    for i in range(55):
        category = "men" if i % 2 == 0 else "women"
        # Indian prices in Rupees (₹299 to ₹1999)
        base_price = random.randint(299, 1999)
        
        # Select random name and description
        name_template = random.choice(PRODUCT_NAMES)
        name = f"{name_template} - {category.title()}'s"
        description = random.choice(DESCRIPTIONS)
        
        # Random sizes (at least 4)
        num_sizes = random.randint(4, 6)
        sizes = random.sample(SIZES, num_sizes)
        
        # Random colors (at least 3)
        num_colors = random.randint(3, 6)
        colors = random.sample(COLORS, num_colors)
        
        # Random images (1-3 images per product)
        num_images = random.randint(1, 3)
        selected_images = random.sample(LOCAL_IMAGES, num_images)
        
        images = []
        for img_url in selected_images:
            images.append({
                "url": img_url,
                "filename": img_url.split('/')[-1],
                "size": 150000,
                "width": 800,
                "height": 1000
            })
        
        product = {
            "id": str(uuid.uuid4()),
            "name": name,
            "description": description,
            "category": category,
            "price": float(base_price),
            "sizes": sorted(sizes, key=lambda x: SIZES.index(x)),
            "colors": colors,
            "stock": random.randint(50, 200),
            "images": images,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.products.insert_one(product)
        products_created += 1
        
        if products_created % 10 == 0:
            print(f"  Created {products_created} products...")
    
    print(f"✓ Successfully created {products_created} products!")
    print()
    print("="*60)
    print("Database seeding completed!")
    print("="*60)
    print()
    print("Login Credentials:")
    print("-" * 60)
    print("Admin Access:")
    print(f"  Email: admin@mstex.com")
    print(f"  Password: admin123")
    print(f"  URL: /admin/login")
    print()
    print("Sample Customer:")
    print(f"  Email: customer@example.com")
    print(f"  Password: password123")
    print("-" * 60)
    print()
    print(f"Total Products: {products_created}")
    print(f"Categories: Men's & Women's")
    print(f"Images: Locally stored in /uploads/products/")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(seed_database())
