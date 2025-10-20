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

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# PROPERLY CATEGORIZED IMAGES - NO REPETITION
MENS_IMAGES = [f"/api/images/mens_{i}.jpg" for i in range(1, 9)]  # 8 men's images
WOMENS_IMAGES = [f"/api/images/womens_{i}.jpg" for i in range(1, 8)]  # 7 women's images

# MEN'S PRODUCTS (Using ONLY men's images)
MENS_PRODUCTS = [
    {
        "name": "Classic Black Cotton Tee",
        "description": "Premium 100% cotton black T-shirt. Soft, breathable fabric perfect for everyday wear. Pre-shrunk material ensures long-lasting fit. Made in Tiruppur with superior quality control.",
        "price": 499.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black", "White", "Gray"],
        "stock": 150,
        "images": [MENS_IMAGES[0]]
    },
    {
        "name": "Premium White Crew Neck",
        "description": "Crisp white cotton crew neck T-shirt. Superior stitching quality with reinforced seams. Ideal for layering or standalone wear. Maintains brightness after multiple washes.",
        "price": 549.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Cream", "Light Gray"],
        "stock": 120,
        "images": [MENS_IMAGES[1]]
    },
    {
        "name": "Urban Streetwear Black Tee",
        "description": "Modern fit black T-shirt with contemporary styling. Crafted from premium knitted cotton. Perfect for urban lifestyle and casual outings. Comfortable all-day wear.",
        "price": 599.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Black", "Charcoal", "Navy"],
        "stock": 100,
        "images": [MENS_IMAGES[2]]
    },
    {
        "name": "Casual Comfort Fit Tee",
        "description": "Relaxed fit T-shirt for maximum comfort. Made from soft-touch cotton blend. Features taped neck and shoulders for durability. Ideal for weekend wear and casual occasions.",
        "price": 449.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Blue", "Green", "Maroon"],
        "stock": 130,
        "images": [MENS_IMAGES[3]]
    },
    {
        "name": "Athletic Performance Tee",
        "description": "High-performance T-shirt designed for active lifestyle. Moisture-wicking fabric keeps you dry. Quick-dry technology and breathable mesh panels. Perfect for gym and sports.",
        "price": 699.0,
        "sizes": ["M", "L", "XL"],
        "colors": ["Black", "Navy", "Royal Blue"],
        "stock": 80,
        "images": [MENS_IMAGES[4]]
    },
    {
        "name": "Plain Round Neck Essential",
        "description": "Wardrobe essential plain T-shirt. Classic round neck design with comfortable fit. Premium cotton fabric from Tiruppur mills. Available in multiple colors.",
        "price": 399.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Black", "Gray", "Navy", "Maroon"],
        "stock": 200,
        "images": [MENS_IMAGES[5]]
    },
    {
        "name": "Premium Polo Style Tee",
        "description": "Semi-formal T-shirt with polo-inspired design. Features quality buttons and collar. Suitable for smart casual occasions. Premium knit fabric with excellent drape.",
        "price": 799.0,
        "sizes": ["M", "L", "XL"],
        "colors": ["White", "Navy", "Burgundy"],
        "stock": 70,
        "images": [MENS_IMAGES[6]]
    },
    {
        "name": "Vintage Wash Casual Tee",
        "description": "Pre-washed vintage style T-shirt. Soft hand feel with lived-in comfort. Unique wash creates distinctive character. Perfect for casual everyday style.",
        "price": 649.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Faded Black", "Stone Wash", "Olive"],
        "stock": 90,
        "images": [MENS_IMAGES[7]]
    },
    {
        "name": "Henley Button Detail Tee",
        "description": "Stylish T-shirt with henley button placket. Adds subtle detail to classic design. Premium quality buttons and reinforced stitching. Versatile for various occasions.",
        "price": 699.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Gray", "Navy", "Olive Green"],
        "stock": 85,
        "images": [MENS_IMAGES[0], MENS_IMAGES[1]]
    },
    {
        "name": "Slim Fit Modern Tee",
        "description": "Contemporary slim fit design. Tailored for modern aesthetic without compromising comfort. High-quality cotton with stretch. Ideal for fitted styling.",
        "price": 599.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Navy"],
        "stock": 110,
        "images": [MENS_IMAGES[2], MENS_IMAGES[3]]
    },
    {
        "name": "Essential Plain White Tee",
        "description": "Versatile white T-shirt suitable for everyone. Premium cotton with superior quality. Classic design that never goes out of style. Made in Tiruppur with care.",
        "price": 399.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Off-White", "Cream"],
        "stock": 180,
        "images": [MENS_IMAGES[4], MENS_IMAGES[5]]
    },
    {
        "name": "Graphic Print Ready Tee",
        "description": "Plain T-shirt perfect for custom printing. High-quality base suitable for graphics. Smooth surface finish. Ideal for personalization and branding.",
        "price": 449.0,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["White", "Black", "Gray", "Navy"],
        "stock": 150,
        "images": [MENS_IMAGES[6], MENS_IMAGES[7]]
    },
    {
        "name": "Heavyweight Cotton Tee",
        "description": "Substantial heavyweight cotton T-shirt. Durable construction for long-lasting wear. Premium thick fabric with quality feel. Perfect for workwear and casual use.",
        "price": 649.0,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Black", "Navy", "Charcoal"],
        "stock": 90,
        "images": [MENS_IMAGES[0], MENS_IMAGES[2]]
    },
    {
        "name": "Luxury Pima Cotton Tee",
        "description": "Premium Pima cotton T-shirt. Extra-long staple cotton for superior softness. Luxurious feel with excellent durability. Investment piece for discerning customers.",
        "price": 999.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Black", "Navy"],
        "stock": 60,
        "images": [MENS_IMAGES[1], MENS_IMAGES[3]]
    },
]

# WOMEN'S PRODUCTS (Using ONLY women's images)
WOMENS_PRODUCTS = [
    {
        "name": "Women's Soft Cotton Tee",
        "description": "Ultra-soft cotton T-shirt designed for women. Feminine fit with comfortable neckline. Lightweight and breathable fabric. Perfect for everyday comfort and style.",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Pink", "Peach", "Mint"],
        "stock": 140,
        "images": [WOMENS_IMAGES[0]]
    },
    {
        "name": "Elegant V-Neck Women's Tee",
        "description": "Flattering V-neck design T-shirt. Soft touch fabric with excellent drape. Creates elegant silhouette while maintaining comfort. Versatile for casual and semi-formal wear.",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "Navy", "Wine", "White"],
        "stock": 120,
        "images": [WOMENS_IMAGES[1]]
    },
    {
        "name": "Casual Women's Crew Neck",
        "description": "Classic crew neck T-shirt for women. Comfortable relaxed fit with quality stitching. Made from breathable cotton blend. Essential wardrobe piece for any season.",
        "price": 449.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Light Pink", "Sky Blue", "Lemon"],
        "stock": 160,
        "images": [WOMENS_IMAGES[2]]
    },
    {
        "name": "Premium Long Sleeve Women's Tee",
        "description": "Elegant long sleeve T-shirt. Premium cotton with comfortable stretch. Perfect for layering or standalone wear. Timeless design that never goes out of style.",
        "price": 649.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Black", "White", "Gray", "Navy"],
        "stock": 95,
        "images": [WOMENS_IMAGES[3]]
    },
    {
        "name": "Fitted Women's Basic Tee",
        "description": "Body-conscious fitted design. High-quality stretchable cotton fabric. Maintains shape after washing. Ideal for layering under jackets or wearing solo.",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "White", "Red", "Royal Blue"],
        "stock": 130,
        "images": [WOMENS_IMAGES[4]]
    },
    {
        "name": "Women's Oversized Comfort Tee",
        "description": "Trendy oversized fit T-shirt. Relaxed and comfortable styling. Made from soft premium cotton. Perfect for contemporary casual look and loungewear.",
        "price": 599.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Beige", "Sage Green", "Lavender"],
        "stock": 110,
        "images": [WOMENS_IMAGES[5]]
    },
    {
        "name": "Scoop Neck Women's Tee",
        "description": "Feminine scoop neckline T-shirt. Flattering cut with comfortable fit. Lightweight fabric perfect for warm weather. Versatile piece for various styling options.",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Pink", "Coral", "Mint Green"],
        "stock": 125,
        "images": [WOMENS_IMAGES[6]]
    },
    {
        "name": "Women's Crop Fit Tee",
        "description": "Modern crop length T-shirt. Trendy design with comfortable fit. Made from soft cotton blend. Perfect for pairing with high-waist bottoms.",
        "price": 599.0,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Black", "White", "Pink", "Yellow"],
        "stock": 100,
        "images": [WOMENS_IMAGES[0], WOMENS_IMAGES[1]]
    },
    {
        "name": "Premium Women's Polo Tee",
        "description": "Sophisticated polo-style T-shirt for women. Features collar and quality buttons. Perfect for smart casual occasions. Premium knitted fabric with elegant finish.",
        "price": 749.0,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Navy", "Black", "Red"],
        "stock": 80,
        "images": [WOMENS_IMAGES[2], WOMENS_IMAGES[3]]
    },
    {
        "name": "Women's Striped Casual Tee",
        "description": "Classic striped pattern T-shirt. Timeless design with modern fit. Soft cotton fabric with comfortable feel. Adds visual interest to casual outfits.",
        "price": 549.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Navy/White", "Black/White", "Red/White"],
        "stock": 115,
        "images": [WOMENS_IMAGES[4], WOMENS_IMAGES[5]]
    },
    {
        "name": "Lightweight Summer Tee",
        "description": "Ultra-lightweight T-shirt perfect for hot weather. Breathable fabric with excellent airflow. Quick-dry properties. Ideal for summer and tropical climates.",
        "price": 499.0,
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White", "Sky Blue", "Mint", "Coral"],
        "stock": 135,
        "images": [WOMENS_IMAGES[6], WOMENS_IMAGES[0]]
    },
]

async def seed_database():
    print("="*70)
    print("MS TEX - PROPERLY CATEGORIZED PRODUCTS")
    print("="*70)
    print()
    
    await db.products.delete_many({})
    print("✓ Cleared existing products")
    
    # Ensure admin
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
        print(f"✓ Created admin: {admin_email}")
    else:
        print(f"✓ Admin exists: {admin_email}")
    
    print()
    print("Creating MEN'S PRODUCTS (Male Models Only)...")
    print("-" * 70)
    
    for product_data in MENS_PRODUCTS:
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
            "category": "men",
            "price": product_data["price"],
            "sizes": product_data["sizes"],
            "colors": product_data["colors"],
            "stock": product_data["stock"],
            "images": images,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.products.insert_one(product)
        print(f"✓ {product_data['name']}")
    
    print()
    print("Creating WOMEN'S PRODUCTS (Female Models Only)...")
    print("-" * 70)
    
    for product_data in WOMENS_PRODUCTS:
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
            "category": "women",
            "price": product_data["price"],
            "sizes": product_data["sizes"],
            "colors": product_data["colors"],
            "stock": product_data["stock"],
            "images": images,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.products.insert_one(product)
        print(f"✓ {product_data['name']}")
    
    print()
    print("="*70)
    print("✅ PROPERLY CATEGORIZED DATABASE COMPLETE!")
    print("="*70)
    print()
    print(f"✓ Men's Products: {len(MENS_PRODUCTS)} (ONLY male models)")
    print(f"✓ Women's Products: {len(WOMENS_PRODUCTS)} (ONLY female models)")
    print(f"✓ Total Products: {len(MENS_PRODUCTS) + len(WOMENS_PRODUCTS)}")
    print()
    print("✓ NO image repetition between categories")
    print("✓ Each category shows ONLY appropriate gender models")
    print()
    print("Login: admin@mstex.com / admin123")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(seed_database())
