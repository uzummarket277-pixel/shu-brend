import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';
import crypto from 'crypto';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderTelegramSent,
  getAdminStats,
  storeAdminToken,
  verifyAdminToken,
  removeAdminToken
} from './src/server/db.js';
import { sendTelegramOrderNotification, sendTestTelegramMessage } from './src/server/telegram.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure uploads folder exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Faqat rasm fayllari (JPG, PNG, WEBP) qabul qilinadi!"));
    }
  }
});

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin authentication middleware
async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Ruxsat etilmagan: Token mavjud emas" });
  }

  const isValid = await verifyAdminToken(token);
  if (!isValid) {
    return res.status(401).json({ error: "Yaroqsiz yoki muddati o'tgan sessiya" });
  }

  next();
}

// --- API ROUTES ---

// 1. Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, is_new, is_featured } = req.query;
    const products = await getAllProducts({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      is_new: is_new === 'true',
      is_featured: is_featured === 'true'
    });
    res.json(products);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: "Mahsulotlarni yuklashda xatolik yuz berdi" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }
    res.json(product);
  } catch (err: any) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: "Mahsulot ma'lumotlarini yuklashda xatolik" });
  }
});

app.post('/api/products', requireAdminAuth, async (req, res) => {
  try {
    const { name, category, price, old_price, discount, description, sizes, colors, image_url, thumbnails, is_featured, is_new, stock, outfit_layer_type } = req.body;
    if (!name || !category || !price || !image_url) {
      return res.status(400).json({ error: "Nomi, kategoriya, narxi va rasmi to'ldirilishi shart" });
    }

    const newProduct = await createProduct({
      name,
      category,
      price: Number(price),
      old_price: old_price ? Number(old_price) : 0,
      discount: discount ? Number(discount) : 0,
      description: description || '',
      sizes: Array.isArray(sizes) ? sizes : ["S", "M", "L", "XL"],
      colors: Array.isArray(colors) ? colors : ["#18181B"],
      image_url,
      thumbnails: Array.isArray(thumbnails) ? thumbnails : [],
      is_featured: Boolean(is_featured),
      is_new: is_new !== undefined ? Boolean(is_new) : true,
      stock: stock ? Number(stock) : 50,
      outfit_layer_type: outfit_layer_type || undefined
    });

    res.status(201).json(newProduct);
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: "Mahsulot qo'shishda xatolik" });
  }
});

app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }
    res.json(updated);
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: "Mahsulotni tahrirlashda xatolik" });
  }
});

app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    res.json({ success: true, message: "Mahsulot muvaffaqiyatli o'chirildi" });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: "Mahsulotni o'chirishda xatolik" });
  }
});

// 2. Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, customer_phone, delivery_address, map_link, notes, items } = req.body;

    if (!customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({ error: "Ism, telefon raqami va yetkazib berish manzili kiritilishi shart" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Savatda kamida 1 ta mahsulot bo'lishi kerak" });
    }

    // Save order in SQLite DB (server verifies prices)
    const newOrder = await createOrder({
      customer_name,
      customer_phone,
      delivery_address,
      map_link,
      notes,
      items
    });

    // Send Telegram Notification in background, preserving order in DB on error
    sendTelegramOrderNotification(newOrder)
      .then(async (tgResult) => {
        if (tgResult.success) {
          await updateOrderTelegramSent(newOrder.id, true);
        }
      })
      .catch((tgErr) => {
        console.error("Telegram notification exception:", tgErr);
      });

    res.status(201).json({
      success: true,
      order: newOrder,
      message: "Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada mutaxassisimiz siz bilan bog'lanadi."
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: "Buyurtma berishda xatolik yuz berdi. Iltimos qayta urinib ko'ring." });
  }
});

app.get('/api/orders', requireAdminAuth, async (_req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: "Buyurtmalarni yuklashda xatolik" });
  }
});

app.put('/api/orders/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const validStatuses = ['Yangi', 'Tasdiqlandi', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Bajarildi', 'Bekor qilindi'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Noto'g'ri buyurtma holati" });
    }

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Buyurtma topilmadi" });
    }

    res.json(updated);
  } catch (err: any) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: "Buyurtma holatini yangilashda xatolik" });
  }
});

// 3. Admin Authentication & Stats
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const expectedUsername = process.env.ADMIN_LOGIN || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'shu_brend_secure_password_2026';

    if (username === expectedUsername && password === expectedPassword) {
      const token = crypto.randomBytes(32).toString('hex');
      await storeAdminToken(token, username);
      return res.json({
        success: true,
        token,
        username,
        message: "Admin paneliga xush kelibsiz!"
      });
    }

    return res.status(401).json({ error: "Login yoki parol noto'g'ri kiritildi" });
  } catch (err: any) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: "Tizimga kirishda xatolik" });
  }
});

app.post('/api/admin/logout', requireAdminAuth, async (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    await removeAdminToken(token);
  }
  res.json({ success: true, message: "Sessiya yakunlandi" });
});

app.get('/api/admin/verify', async (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (!token) return res.json({ authenticated: false });
  const valid = await verifyAdminToken(token);
  res.json({ authenticated: valid });
});

app.get('/api/admin/stats', requireAdminAuth, async (_req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err: any) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: "Statistikalarni olishda xatolik" });
  }
});

app.post('/api/admin/telegram-test', requireAdminAuth, async (_req, res) => {
  const result = await sendTestTelegramMessage();
  res.json(result);
});

// 4. File Upload API
app.post('/api/upload', requireAdminAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Hech qanday rasm fayli tanlanmadi" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: err.message || "Rasm yuklashda xatolik" });
  }
});

// Development vs Production Setup
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SHU BREND server running on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
