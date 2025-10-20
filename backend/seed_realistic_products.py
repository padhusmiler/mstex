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

# Product images via API
IMAGES = [f"/api/images/product_{i}.jpg" for i in range(1, 15)]

# Realistic T-shirt products with matching descriptions
PRODUCTS = [
    # Men's T-Shirts
    {
        "name": "Classic Black Cotton Tee",
        "description": "Premium 100% cotton black T-shirt. Soft, breathable fabric perfect for everyday wear. Pre-shrunk material ensures long-lasting fit. Made in Tiruppur with superior quality control.",
        "category": "men",
        "price": 499.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "White", "Gray"],
        "stock": 150,
        "images": [IMAGES[0], IMAGES[1]]
    },
    {
        "name": "Premium White Crew Neck",
        "description": "Crisp white cotton crew neck T-shirt. Superior stitching quality with reinforced seams. Ideal for layering or standalone wear. Maintains brightness after multiple washes.",
        "category": "men",
        "price": 549.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Cream", "Light Gray"],
        "stock": 120,
        "images": [IMAGES[3], IMAGES[4]]
    },
    {
        "name": "Urban Streetwear Black Tee",
        "description": "Modern fit black T-shirt with contemporary styling. Crafted from premium knitted cotton. Perfect for urban lifestyle and casual outings. Comfortable all-day wear.",
        "category": "men",
        "price": 599.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Black", "Charcoal", "Navy"],
        "stock": 100,
        "images": [IMAGES[5], IMAGES[6]]
    },
    {
        "name": "Casual Comfort Fit Tee",
        "description": "Relaxed fit T-shirt for maximum comfort. Made from soft-touch cotton blend. Features taped neck and shoulders for durability. Ideal for weekend wear and casual occasions.",
        "category": "men",
        "price": 449.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Blue", "Green", "Maroon"],
        "stock": 130,
        "images": [IMAGES[6]]
    },
    {
        "name": "Athletic Performance Tee",
        "description": "High-performance T-shirt designed for active lifestyle. Moisture-wicking fabric keeps you dry. Quick-dry technology and breathable mesh panels. Perfect for gym and sports.",
        "category": "men",
        "price": 699.0,
        "sizes": ["M", "L", "XL"],
        "colors": ["Black", "Navy", "Royal Blue"],
        "stock": 80,
        "images": [IMAGES[0], IMAGES[5]]
    },
    {
        "name": "Plain Round Neck Essential",
        "description": "Wardrobe essential plain T-shirt. Classic round neck design with comfortable fit. Premium cotton fabric from Tiruppur mills. Available in multiple colors.",
        "category": "men",
        "price": 399.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Black", "Gray", "Navy", "Maroon"],
        "stock": 200,
        "images": [IMAGES[3], IMAGES[4]]
    },
    {
        "name": "Premium Polo Style Tee",
        "description": "Semi-formal T-shirt with polo-inspired design. Features quality buttons and collar. Suitable for smart casual occasions. Premium knit fabric with excellent drape.",
        "category": "men",
        "price": 799.0,
        "sizes": ["M", "L", "XL"],
        "colors": ["White", "Navy", "Burgundy"],
        "stock": 70,
        "images": [IMAGES[4]]
    },
    {
        "name": "Vintage Wash Casual Tee",
        "description": "Pre-washed vintage style T-shirt. Soft hand feel with lived-in comfort. Unique wash creates distinctive character. Perfect for casual everyday style.",
        "category": "men",
        "price": 649.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Faded Black", "Stone Wash", "Olive"],
        "stock": 90,
        "images": [IMAGES[5], IMAGES[6]]
    },
    {
        "name": "Henley Button Detail Tee",
        "description": "Stylish T-shirt with henley button placket. Adds subtle detail to classic design. Premium quality buttons and reinforced stitching. Versatile for various occasions.",
        "category": "men",
        "price": 699.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Gray", "Navy", "Olive Green"],
        "stock": 85,
        "images": [IMAGES[0]]
    },
    {
        "name": "Slim Fit Modern Tee",
        "description": "Contemporary slim fit design. Tailored for modern aesthetic without compromising comfort. High-quality cotton with stretch. Ideal for fitted styling.",
        "category": "men",
        "price": 599.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Navy"],
        "stock": 110,
        "images": [IMAGES[5]]
    },
    
    # Women's T-Shirts
    {
        "name": "Women's Soft Cotton Tee",
        "description": "Ultra-soft cotton T-shirt designed for women. Feminine fit with comfortable neckline. Lightweight and breathable fabric. Perfect for everyday comfort and style.",
        "category": "women",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Pink", "Peach", "Mint"],
        "stock": 140,
        "images": [IMAGES[7], IMAGES[8]]
    },
    {
        "name": "Elegant V-Neck Women's Tee",
        "description": "Flattering V-neck design T-shirt. Soft touch fabric with excellent drape. Creates elegant silhouette while maintaining comfort. Versatile for casual and semi-formal wear.",
        "category": "women",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "Navy", "Wine", "White"],
        "stock": 120,
        "images": [IMAGES[8], IMAGES[9]]
    },
    {
        "name": "Casual Women's Crew Neck",
        "description": "Classic crew neck T-shirt for women. Comfortable relaxed fit with quality stitching. Made from breathable cotton blend. Essential wardrobe piece for any season.",
        "category": "women",
        "price": 449.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Light Pink", "Sky Blue", "Lemon"],
        "stock": 160,
        "images": [IMAGES[9]]
    },
    {
        "name": "Premium Long Sleeve Women's Tee",
        "description": "Elegant long sleeve T-shirt. Premium cotton with comfortable stretch. Perfect for layering or standalone wear. Timeless design that never goes out of style.",
        "category": "women",
        "price": 649.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Gray", "Navy"],
        "stock": 95,
        "images": [IMAGES[10]]
    },
    {
        "name": "Fitted Women's Basic Tee",
        "description": "Body-conscious fitted design. High-quality stretchable cotton fabric. Maintains shape after washing. Ideal for layering under jackets or wearing solo.",
        "category": "women",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "White", "Red", "Royal Blue"],
        "stock": 130,
        "images": [IMAGES[8], IMAGES[9]]
    },
    {
        "name": "Women's Oversized Comfort Tee",
        "description": "Trendy oversized fit T-shirt. Relaxed and comfortable styling. Made from soft premium cotton. Perfect for contemporary casual look and loungewear.",
        "category": "women",
        "price": 599.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Beige", "Sage Green", "Lavender"],
        "stock": 110,
        "images": [IMAGES[11]]
    },
    {
        "name": "Scoop Neck Women's Tee",
        "description": "Feminine scoop neckline T-shirt. Flattering cut with comfortable fit. Lightweight fabric perfect for warm weather. Versatile piece for various styling options.",
        "category": "women",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Pink", "Coral", "Mint Green"],
        "stock": 125,
        "images": [IMAGES[7], IMAGES[12]]
    },
    {
        "name": "Women's Crop Fit Tee",
        "description": "Modern crop length T-shirt. Trendy design with comfortable fit. Made from soft cotton blend. Perfect for pairing with high-waist bottoms.",
        "category": "women",
        "price": 599.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "White", "Pink", "Yellow"],
        "stock": 100,
        "images": [IMAGES[12]]
    },
    {
        "name": "Premium Women's Polo Tee",
        "description": "Sophisticated polo-style T-shirt for women. Features collar and quality buttons. Perfect for smart casual occasions. Premium knitted fabric with elegant finish.",
        "category": "women",
        "price": 749.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Navy", "Black", "Red"],
        "stock": 80,
        "images": [IMAGES[11]]
    },
    {
        "name": "Women's Striped Casual Tee",
        "description": "Classic striped pattern T-shirt. Timeless design with modern fit. Soft cotton fabric with comfortable feel. Adds visual interest to casual outfits.",
        "category": "women",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Navy/White", "Black/White", "Red/White"],
        "stock": 115,
        "images": [IMAGES[9], IMAGES[13]]
    },
    
    # Additional Unisex/Mixed Products
    {
        "name": "Essential Plain White Tee",
        "description": "Versatile white T-shirt suitable for everyone. Premium cotton with superior quality. Classic design that never goes out of style. Made in Tiruppur with care.",
        "category": "men",
        "price": 399.0,
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Off-White", "Cream"],
        "stock": 180,
        "images": [IMAGES[3], IMAGES[4]]
    },
    {
        "name": "Graphic Print Ready Tee",
        "description": "Plain T-shirt perfect for custom printing. High-quality base suitable for graphics. Smooth surface finish. Ideal for personalization and branding.",
        "category": "men",
        "price": 449.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Black", "Gray", "Navy"],
        "stock": 150,
        "images": [IMAGES[0], IMAGES[1]]
    },
    {
        "name": "Heavyweight Cotton Tee",
        "description": "Substantial heavyweight cotton T-shirt. Durable construction for long-lasting wear. Premium thick fabric with quality feel. Perfect for workwear and casual use.",
        "category": "men",
        "price": 649.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Black", "Navy", "Charcoal"],
        "stock": 90,
        "images": [IMAGES[0], IMAGES[5]]
    },
    {
        "name": "Lightweight Summer Tee",
        "description": "Ultra-lightweight T-shirt perfect for hot weather. Breathable fabric with excellent airflow. Quick-dry properties. Ideal for summer and tropical climates.",
        "category": "women",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Sky Blue", "Mint", "Coral"],
        "stock": 135,
        "images": [IMAGES[7], IMAGES[8]]
    },
    {
        "name": "Luxury Pima Cotton Tee",
        "description": "Premium Pima cotton T-shirt. Extra-long staple cotton for superior softness. Luxurious feel with excellent durability. Investment piece for discerning customers.",
        "category": "men",
        "price": 999.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Black", "Navy"],
        "stock": 60,
        "images": [IMAGES[3], IMAGES[4]]
    },
]

async def seed_database():
    print("="*70)
    print("MS TEX - Realistic Product Database Creation")
    print("="*70)
    print()
    
    # Clear existing products
    await db.products.delete_many({})
    print("✓ Cleared existing products")
    
    # Ensure admin user exists
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
        print(f"✓ Admin user exists: {admin_email}")
    
    print()
    print("Creating realistic products with matching descriptions...")
    print("-" * 70)
    
    men_count = 0
    women_count = 0
    
    for product_data in PRODUCTS:
        # Convert image paths to metadata
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
        
        if product_data["category"] == "men":
            men_count += 1
        else:
            women_count += 1
        
        print(f"✓ {product_data['name']} ({product_data['category']})")
    
    print()
    print("="*70)
    print("Database seeding completed!")
    print("="*70)
    print()
    print(f"✓ Total Products Created: {len(PRODUCTS)}")
    print(f"  - Men's Products: {men_count}")
    print(f"  - Women's Products: {women_count}")
    print()
    print("Login Credentials:")
    print("-" * 70)
    print("Admin Access:")
    print(f"  Email: admin@mstex.com")
    print(f"  Password: admin123")
    print(f"  URL: /admin/login")
    print()
    print("Sample Customer:")
    print(f"  Email: customer@example.com")
    print(f"  Password: password123")
    print("-" * 70)
    print()
    print("Features:")
    print("  ✓ Realistic product names and descriptions")
    print("  ✓ Properly categorized (Men's/Women's)")
    print("  ✓ Professional product images")
    print("  ✓ Indian Rupee (₹) pricing")
    print("  ✓ Multiple sizes and colors per product")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(seed_database())
