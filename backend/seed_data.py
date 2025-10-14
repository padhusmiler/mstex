import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Sample T-shirt images
tshirt_images = [
    'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450',
    'https://images.unsplash.com/photo-1516442719524-a603408c90cb',
    'https://images.unsplash.com/photo-1516082669438-2d2bb5082626',
    'https://images.unsplash.com/photo-1516177609387-9bad55a45194',
    'https://images.unsplash.com/photo-1509003124559-eb6678fe452b',
    'https://images.unsplash.com/photo-1589408871633-685343fb36b2',
    'https://images.unsplash.com/photo-1564430362299-113976f94001',
    'https://images.unsplash.com/photo-1533793735164-12065733b215',
    'https://images.pexels.com/photos/34253791/pexels-photo-34253791.jpeg',
    'https://images.pexels.com/photos/34277461/pexels-photo-34277461.jpeg',
    'https://images.pexels.com/photos/34277458/pexels-photo-34277458.jpeg',
    'https://images.pexels.com/photos/34286724/pexels-photo-34286724.jpeg'
]

async def seed_database():
    print("Starting database seeding...")
    
    # Create admin user
    admin_email = "admin@trendyshirts.com"
    existing_admin = await db.users.find_one({"email": admin_email})
    
    if not existing_admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password": pwd_context.hash("admin123"),
            "name": "Admin User",
            "phone": "+1 (555) 000-0000",
            "address": "123 Admin Street, NY",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        print(f"✓ Created admin user: {admin_email} / admin123")
    else:
        print(f"✓ Admin user already exists: {admin_email}")
    
    # Create sample user
    user_email = "user@example.com"
    existing_user = await db.users.find_one({"email": user_email})
    
    if not existing_user:
        sample_user = {
            "id": str(uuid.uuid4()),
            "email": user_email,
            "password": pwd_context.hash("password123"),
            "name": "John Doe",
            "phone": "+1 (555) 123-4567",
            "address": "456 Main Street, NY",
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(sample_user)
        print(f"✓ Created sample user: {user_email} / password123")
    else:
        print(f"✓ Sample user already exists: {user_email}")
    
    # Sample products data
    products_data = [
        {
            "name": "Classic Black T-Shirt",
            "description": "Premium quality black cotton t-shirt. Comfortable, stylish, and perfect for everyday wear.",
            "category": "men",
            "price": 24.99,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Black", "White", "Gray"],
            "stock": 150,
            "images": [tshirt_images[0], tshirt_images[1]]
        },
        {
            "name": "Urban Style Tee",
            "description": "Modern fit t-shirt with urban street style. Made from soft, breathable fabric.",
            "category": "men",
            "price": 29.99,
            "sizes": ["M", "L", "XL"],
            "colors": ["Blue", "Navy", "Black"],
            "stock": 100,
            "images": [tshirt_images[2], tshirt_images[3]]
        },
        {
            "name": "Sport Performance T-Shirt",
            "description": "Athletic fit t-shirt designed for active lifestyles. Moisture-wicking and quick-dry.",
            "category": "men",
            "price": 34.99,
            "sizes": ["S", "M", "L", "XL"],
            "colors": ["Red", "Blue", "Black"],
            "stock": 80,
            "images": [tshirt_images[8], tshirt_images[9]]
        },
        {
            "name": "Vintage Gray Tee",
            "description": "Retro-inspired gray t-shirt with a relaxed fit. Soft and comfortable for all-day wear.",
            "category": "men",
            "price": 27.99,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["Gray", "Black", "White"],
            "stock": 120,
            "images": [tshirt_images[3]]
        },
        {
            "name": "Women's Essential White Tee",
            "description": "Timeless white t-shirt for women. Versatile and elegant, perfect for any occasion.",
            "category": "women",
            "price": 22.99,
            "sizes": ["XS", "S", "M", "L", "XL"],
            "colors": ["White", "Black", "Pink"],
            "stock": 200,
            "images": [tshirt_images[4]]
        },
        {
            "name": "Striped Fashion Tee",
            "description": "Trendy striped t-shirt for fashion-forward women. Comfortable and stylish.",
            "category": "women",
            "price": 28.99,
            "sizes": ["S", "M", "L", "XL"],
            "colors": ["Black", "White", "Blue"],
            "stock": 90,
            "images": [tshirt_images[5], tshirt_images[6]]
        },
        {
            "name": "Casual Black Women's Tee",
            "description": "Simple yet elegant black t-shirt. A wardrobe essential for every woman.",
            "category": "women",
            "price": 25.99,
            "sizes": ["XS", "S", "M", "L", "XL"],
            "colors": ["Black", "Gray", "White"],
            "stock": 150,
            "images": [tshirt_images[7]]
        },
        {
            "name": "Premium Cotton Tee - Women's",
            "description": "Luxury cotton t-shirt with superior quality. Soft, comfortable, and durable.",
            "category": "women",
            "price": 32.99,
            "sizes": ["S", "M", "L", "XL"],
            "colors": ["White", "Pink", "Blue"],
            "stock": 75,
            "images": [tshirt_images[10], tshirt_images[11]]
        }
    ]
    
    # Check if products already exist
    existing_products = await db.products.count_documents({})
    
    if existing_products == 0:
        for product_data in products_data:
            # Convert image URLs to metadata
            images = []
            for img_url in product_data["images"]:
                images.append({
                    "url": img_url,
                    "filename": img_url.split('/')[-1],
                    "size": 150000,
                    "width": 800,
                    "height": 1000
                })
            
            product = {
                "id": str(uuid.uuid4()),
                "name": product_data["name"],
                "description": product_data["description"],
                "category": product_data["category"],
                "price": product_data["price"],
                "sizes": product_data["sizes"],
                "colors": product_data["colors"],
                "stock": product_data["stock"],
                "images": images,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.products.insert_one(product)
            print(f"✓ Created product: {product_data['name']}")
        
        print(f"\n✓ Successfully created {len(products_data)} products!")
    else:
        print(f"\n✓ Products already exist ({existing_products} products in database)")
    
    print("\n" + "="*50)
    print("Database seeding completed!")
    print("="*50)
    print("\nLogin Credentials:")
    print("-" * 50)
    print("Admin Access:")
    print(f"  Email: admin@trendyshirts.com")
    print(f"  Password: admin123")
    print(f"  URL: /admin/login")
    print("\nSample User:")
    print(f"  Email: user@example.com")
    print(f"  Password: password123")
    print("-" * 50)

if __name__ == "__main__":
    asyncio.run(seed_database())
