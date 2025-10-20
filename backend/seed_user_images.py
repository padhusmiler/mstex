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

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Your uploaded product images
PRODUCT_IMAGES = [f"/api/images/product_{i:03d}.jpg" for i in range(1, 32)]

# Product data with your uploaded images - Mixed gender categories
PRODUCTS_DATA = [
    # Men's Products (Using first half of images)
    {"name": "Classic Cotton Crew Neck", "category": "men", "price": 499, "desc": "Premium cotton everyday T-shirt. Comfortable fit perfect for daily wear. Made in Tiruppur with superior quality.", "images": [PRODUCT_IMAGES[0]]},
    {"name": "Urban Graphic Tee", "category": "men", "price": 599, "desc": "Trendy graphic print T-shirt. Modern design with soft cotton fabric. Perfect for casual outings.", "images": [PRODUCT_IMAGES[1]]},
    {"name": "Solid Black Essentials", "category": "men", "price": 449, "desc": "Wardrobe essential black T-shirt. Classic fit with reinforced stitching. Versatile and durable.", "images": [PRODUCT_IMAGES[2]]},
    {"name": "Premium White Round Neck", "category": "men", "price": 549, "desc": "Crisp white cotton T-shirt. Professional quality with soft finish. Ideal for layering or standalone.", "images": [PRODUCT_IMAGES[3]]},
    {"name": "Casual Comfort Fit", "category": "men", "price": 479, "desc": "Relaxed fit T-shirt for maximum comfort. Breathable fabric perfect for all-day wear.", "images": [PRODUCT_IMAGES[4]]},
    {"name": "Statement Slogan Tee", "category": "men", "price": 629, "desc": "Bold slogan print T-shirt. Express yourself with style. Premium print quality that lasts.", "images": [PRODUCT_IMAGES[5]]},
    {"name": "Vintage Wash Tee", "category": "men", "price": 699, "desc": "Pre-washed vintage style T-shirt. Unique character with soft hand feel. Trendy and comfortable.", "images": [PRODUCT_IMAGES[6]]},
    {"name": "Athletic Performance Tee", "category": "men", "price": 749, "desc": "High-performance active wear T-shirt. Moisture-wicking fabric for sports and gym.", "images": [PRODUCT_IMAGES[7]]},
    {"name": "Plain Navy Essential", "category": "men", "price": 429, "desc": "Classic navy blue T-shirt. Timeless color with quality fabric. Everyday essential.", "images": [PRODUCT_IMAGES[8]]},
    {"name": "Slim Fit Modern Tee", "category": "men", "price": 599, "desc": "Contemporary slim fit design. Tailored cut without compromising comfort. Modern styling.", "images": [PRODUCT_IMAGES[9]]},
    {"name": "Oversized Street Style", "category": "men", "price": 679, "desc": "Trendy oversized fit T-shirt. Urban streetwear aesthetic. Comfortable and stylish.", "images": [PRODUCT_IMAGES[10]]},
    {"name": "Printed Graphic Design", "category": "men", "price": 649, "desc": "Eye-catching graphic print. Creative design with premium print quality. Stand out style.", "images": [PRODUCT_IMAGES[11]]},
    {"name": "Basic Gray Melange", "category": "men", "price": 459, "desc": "Versatile gray melange T-shirt. Neutral tone perfect for any outfit. Quality basics.", "images": [PRODUCT_IMAGES[12]]},
    {"name": "Polo Collar Style", "category": "men", "price": 799, "desc": "Semi-formal polo style T-shirt. Collar and button details. Smart casual wear.", "images": [PRODUCT_IMAGES[13]]},
    {"name": "Henley Button Tee", "category": "men", "price": 729, "desc": "Stylish henley design with button placket. Adds detail to classic style. Versatile piece.", "images": [PRODUCT_IMAGES[14]]},
    
    # Women's Products (Using second half of images)
    {"name": "Women's Soft Cotton Tee", "category": "women", "price": 499, "desc": "Ultra-soft cotton designed for women. Feminine fit with comfortable neckline. Perfect everyday wear.", "images": [PRODUCT_IMAGES[15]]},
    {"name": "Elegant V-Neck Top", "category": "women", "price": 549, "desc": "Flattering V-neck design. Soft touch fabric with elegant drape. Versatile styling.", "images": [PRODUCT_IMAGES[16]]},
    {"name": "Women's Crew Neck Classic", "category": "women", "price": 479, "desc": "Classic crew neck for women. Comfortable fit with quality stitching. Essential wardrobe piece.", "images": [PRODUCT_IMAGES[17]]},
    {"name": "Fitted Women's Basic", "category": "women", "price": 519, "desc": "Body-conscious fitted design. Stretchable cotton fabric. Maintains shape beautifully.", "images": [PRODUCT_IMAGES[18]]},
    {"name": "Oversized Comfort Tee", "category": "women", "price": 629, "desc": "Trendy oversized fit for women. Relaxed comfortable styling. Contemporary look.", "images": [PRODUCT_IMAGES[19]]},
    {"name": "Scoop Neck Feminine Tee", "category": "women", "price": 549, "desc": "Feminine scoop neckline T-shirt. Flattering cut with soft fabric. Lightweight and breathable.", "images": [PRODUCT_IMAGES[20]]},
    {"name": "Women's Crop Fit Top", "category": "women", "price": 599, "desc": "Modern crop length T-shirt. Trendy design for high-waist pairing. Stylish and comfortable.", "images": [PRODUCT_IMAGES[21]]},
    {"name": "Premium Women's Polo", "category": "women", "price": 749, "desc": "Sophisticated polo style for women. Collar and button details. Smart casual elegance.", "images": [PRODUCT_IMAGES[22]]},
    {"name": "Striped Casual Top", "category": "women", "price": 579, "desc": "Classic striped pattern. Timeless design with modern fit. Adds visual interest.", "images": [PRODUCT_IMAGES[23]]},
    {"name": "Women's Long Sleeve", "category": "women", "price": 649, "desc": "Elegant long sleeve T-shirt. Premium cotton with stretch. Perfect for layering.", "images": [PRODUCT_IMAGES[24]]},
    {"name": "Lightweight Summer Tee", "category": "women", "price": 499, "desc": "Ultra-lightweight for hot weather. Breathable with excellent airflow. Summer essential.", "images": [PRODUCT_IMAGES[25]]},
    {"name": "Women's Graphic Print", "category": "women", "price": 629, "desc": "Stylish graphic print design. Creative and expressive. Premium print quality.", "images": [PRODUCT_IMAGES[26]]},
    {"name": "Casual Round Neck Women's", "category": "women", "price": 479, "desc": "Comfortable round neck design. Relaxed fit for everyday wear. Soft and breathable.", "images": [PRODUCT_IMAGES[27]]},
    {"name": "Premium Tank Style", "category": "women", "price": 449, "desc": "Stylish tank top design. Perfect for layering or solo wear. Lightweight fabric.", "images": [PRODUCT_IMAGES[28]]},
    {"name": "Women's Printed Tee", "category": "women", "price": 599, "desc": "Beautiful printed T-shirt. Unique design with soft cotton. Express your style.", "images": [PRODUCT_IMAGES[29]]},
    {"name": "Luxury Pima Cotton Women's", "category": "women", "price": 899, "desc": "Premium Pima cotton T-shirt. Extra-long staple for superior softness. Luxury quality.", "images": [PRODUCT_IMAGES[30]]},
]

SIZES_MEN = ["S", "M", "L", "XL", "XXL"]
SIZES_WOMEN = ["XS", "S", "M", "L", "XL"]
COLORS = ["Black", "White", "Navy", "Gray", "Maroon", "Olive", "Blue", "Beige"]

async def seed_database():
    print("="*70)
    print("MS TEX - Loading Your Product Images")
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
        print(f"✓ Created admin: {admin_email}\n")
    else:
        print(f"✓ Admin exists: {admin_email}\n")
    
    print("Creating products with your uploaded images...")
    print("-" * 70)
    
    men_count = 0
    women_count = 0
    
    for prod_data in PRODUCTS_DATA:
        images = []
        for img_url in prod_data["images"]:
            images.append({
                "url": img_url,
                "filename": img_url.split('/')[-1],
                "size": 150000,
                "width": 800,
                "height": 1000
            })
        
        sizes = SIZES_MEN if prod_data["category"] == "men" else SIZES_WOMEN
        colors = random.sample(COLORS, random.randint(3, 5))
        
        product = {
            "id": str(uuid.uuid4()),
            "name": prod_data["name"],
            "description": prod_data["desc"],
            "category": prod_data["category"],
            "price": float(prod_data["price"]),
            "sizes": sizes,
            "colors": colors,
            "stock": random.randint(80, 200),
            "images": images,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.products.insert_one(product)
        
        if prod_data["category"] == "men":
            men_count += 1
        else:
            women_count += 1
        
        print(f"✓ {prod_data['name']} ({prod_data['category']})")
    
    print()
    print("="*70)
    print("✅ YOUR PRODUCT IMAGES LOADED SUCCESSFULLY!")
    print("="*70)
    print()
    print(f"✓ Men's Products: {men_count}")
    print(f"✓ Women's Products: {women_count}")
    print(f"✓ Total Products: {len(PRODUCTS_DATA)}")
    print()
    print("✓ All images from your uploads (T-shirt, Oversized, Everyday)")
    print("✓ Products properly categorized")
    print("✓ Indian Rupee (₹) pricing")
    print()
    print("Login: admin@mstex.com / admin123")
    print("="*70)

if __name__ == "__main__":
    asyncio.run(seed_database())
