# MS TEX - Admin Image Upload Guide

## ✅ Image Upload Feature Added!

You can now upload your own product images directly from the admin panel!

---

## 🎯 How to Upload Images

### Step 1: Login as Admin
1. Go to: `https://your-domain.com/admin/login`
2. Email: `admin@mstex.com`
3. Password: `admin123`
4. Click **Admin Login**

### Step 2: Navigate to Products
1. After login, you'll see the Admin Dashboard
2. Click on **"Manage Products"** or go to `/admin/products`

### Step 3: Add New Product
1. Click the **"Add Product"** button (orange gradient button at top-right)
2. A modal will open with product form

### Step 4: Fill Product Details
1. **Product Name**: Enter product name (e.g., "Classic Black Tee")
2. **Category**: Select Men's or Women's
3. **Description**: Write product description
4. **Price (₹)**: Enter price in Indian Rupees (e.g., 499)
5. **Stock Quantity**: Enter available stock (e.g., 100)
6. **Sizes**: Click to select available sizes (S, M, L, XL, XXL)
7. **Colors**: Click to select available colors

### Step 5: Upload Images 📸
1. Scroll down to the **"Product Images"** section
2. Click the **"Upload Images from Computer"** button (blue button)
3. Select one or multiple image files from your computer
4. Supported formats: JPG, JPEG, PNG
5. Wait for upload to complete
6. You'll see thumbnails of uploaded images with green checkmarks
7. You can upload multiple images for each product
8. Click the red X button on any image to remove it

### Step 6: Save Product
1. After filling all details and uploading images
2. Click **"Add Product"** button at bottom
3. Product will be saved with your uploaded images
4. You'll see a success message

---

## 🖼️ Image Upload Features

### ✅ What Works:
- Upload multiple images at once
- Supports JPG, JPEG, PNG formats
- Images automatically resized if too large (max 1200px)
- Optimized for web (85% quality JPEG)
- Images stored securely on server
- Preview thumbnails before saving
- Remove unwanted images before saving

### 📏 Image Requirements:
- **Recommended Size**: 800x1000px (portrait)
- **Maximum Size**: Automatically resized to 1200px
- **File Formats**: JPG, JPEG, PNG
- **File Size**: Any size (auto-optimized)

### 💡 Best Practices:
- Use clear, well-lit product photos
- Show T-shirt from front view
- Use plain or simple backgrounds
- Upload 1-3 images per product
- Include different angles if possible

---

## 🔄 Edit Existing Products

1. Go to Admin Products page
2. Find the product you want to edit
3. Click the **"Edit"** button (blue button)
4. Modal opens with current product details
5. You can:
   - Add more images using upload button
   - Remove existing images
   - Update product details
6. Click **"Update Product"** to save changes

---

## 🗑️ Delete Products

1. Find the product in Admin Products page
2. Click the **"Delete"** button (red button)
3. Confirm deletion
4. Product and its images will be removed

---

## 📊 Backend API Endpoints

The admin panel uses these API endpoints:

### Upload Image:
```
POST /api/admin/upload-image?token={admin_token}
Content-Type: multipart/form-data
Body: file (image file)

Response:
{
  "url": "/api/images/unique-filename.jpg",
  "filename": "unique-filename.jpg",
  "size": 150000,
  "width": 800,
  "height": 1000
}
```

### Create Product:
```
POST /api/admin/products?token={admin_token}
Content-Type: application/json
Body: {
  "name": "Product Name",
  "description": "Description",
  "category": "men" or "women",
  "price": 499.0,
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "White"],
  "stock": 100,
  "images": [
    {
      "url": "/api/images/image1.jpg",
      "filename": "image1.jpg",
      "size": 150000,
      "width": 800,
      "height": 1000
    }
  ]
}
```

---

## 🔒 Security

- Only admin users can upload images
- Images are validated on server
- Only image file types accepted
- Files automatically resized for security
- Unique filenames prevent conflicts
- Stored in protected directory

---

## 📂 Where Images Are Stored

- **Server Path**: `/app/backend/uploads/products/`
- **URL Path**: `/api/images/filename.jpg`
- **Access**: Images served through FastAPI backend
- **Backup**: Remember to backup this folder regularly

---

## ❓ Troubleshooting

### Images Not Uploading?
1. Check file format (must be JPG, JPEG, or PNG)
2. Ensure you're logged in as admin
3. Check browser console for errors
4. Try smaller file sizes
5. Refresh the page and try again

### Images Not Showing After Upload?
1. Wait a few seconds after upload
2. Check if green checkmark appears on thumbnail
3. Ensure backend server is running
4. Check `/app/backend/uploads/products/` folder exists

### Can't Save Product?
1. Fill all required fields (name, category, description, price)
2. Select at least one size and color
3. Upload at least one image
4. Check for error messages

---

## 🎉 You're All Set!

You can now:
- ✅ Upload unlimited product images
- ✅ Add as many products as you want
- ✅ Edit existing products
- ✅ Delete unwanted products
- ✅ Manage your entire catalog

**Happy Uploading!** 🚀
