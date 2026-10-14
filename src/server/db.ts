import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  old_price?: number;
  discount?: number;
  description: string;
  sizes: string[];
  colors: string[];
  image_url: string;
  thumbnails: string[];
  is_featured: boolean;
  is_new: boolean;
  stock: number;
  outfit_layer_type?: 'jacket' | 'shirt' | 'pants' | 'shoes' | 'accessory';
  created_at: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  map_link?: string;
  notes?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'Yangi' | 'Tasdiqlandi' | 'Tayyorlanmoqda' | 'Yetkazilmoqda' | 'Bajarildi' | 'Bekor qilindi';
  telegram_sent: number;
  created_at: string;
}

const DB_DIR = path.resolve(process.cwd(), 'database');
const DB_PATH = path.join(DB_DIR, 'shu_brend.sqlite');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.error('Error reading sqlite file, initializing new DB:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  initTables(dbInstance);
  seedInitialData(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

export function saveDb(db: Database = dbInstance!) {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite DB to disk:', err);
  }
}

function initTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      old_price INTEGER DEFAULT 0,
      discount INTEGER DEFAULT 0,
      description TEXT,
      sizes TEXT,
      colors TEXT,
      image_url TEXT NOT NULL,
      thumbnails TEXT,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 1,
      stock INTEGER DEFAULT 50,
      outfit_layer_type TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      map_link TEXT,
      notes TEXT,
      items TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'Yangi',
      telegram_sent INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_tokens (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
}

function seedInitialData(db: Database) {
  const result = db.exec('SELECT COUNT(*) as count FROM products');
  const count = result[0]?.values[0]?.[0] as number || 0;

  if (count > 0) return;

  const now = new Date().toISOString();

  const initialProducts = [
    {
      name: "Klassik kurtka",
      category: "Kurtkalar",
      price: 599000,
      old_price: 699000,
      discount: 14,
      description: "Zamonaviy va qulay klassik kurtka. Har mavsum uchun mos, premium matodan tayyorlangan, shamoldan himoyalovchi va nafas oluvchi struktura.",
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["#18181B", "#C2B280", "#4B5563", "#1E293B"]),
      image_url: "/src/assets/images/product_classic_jacket_1791973132035.jpg",
      thumbnails: JSON.stringify([
        "/src/assets/images/product_classic_jacket_1791973132035.jpg",
        "/src/assets/images/hero_model_man_1791973131385.jpg"
      ]),
      is_featured: 1,
      is_new: 1,
      stock: 42,
      outfit_layer_type: "jacket",
      created_at: now
    },
    {
      name: "Erkaklar premium qora futbolkasi",
      category: "Kiyimlar",
      price: 189000,
      old_price: 220000,
      discount: 14,
      description: "100% og'ir vaznli zich paxtadan tikilgan, shaklini yo'qotmaydigan zamonaviy oversized siluetli erkaklar futbolkasi.",
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["#18181B", "#FFFFFF", "#9CA3AF"]),
      image_url: "/src/assets/images/outfit_model_base_1791973131662.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 1,
      is_new: 1,
      stock: 75,
      outfit_layer_type: "shirt",
      created_at: now
    },
    {
      name: "Klassik oq ko'ylak",
      category: "Ko'ylaklar",
      price: 249000,
      old_price: 290000,
      discount: 14,
      description: "Biznes uchrashuvlari va kundalik kiyish uchun mo'ljallangan nozik paxtali qulay oq erkaklar ko'ylagi.",
      sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["#FFFFFF", "#BFDBFE", "#CBD5E1"]),
      image_url: "/src/assets/images/outfit_model_base_1791973131662.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 1,
      is_new: 0,
      stock: 38,
      outfit_layer_type: "shirt",
      created_at: now
    },
    {
      name: "Premium klassik to'q shim",
      category: "Shimlar",
      price: 329000,
      old_price: 370000,
      discount: 11,
      description: "Mukammal tikuvli, qad-qomatni ko'rsatib turuvchi zamonaviy erkaklar shimi. Qulay stretch mato.",
      sizes: JSON.stringify(["30", "31", "32", "33", "34", "36"]),
      colors: JSON.stringify(["#18181B", "#1E293B", "#374151"]),
      image_url: "/src/assets/images/hero_model_man_1791973131385.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 1,
      is_new: 0,
      stock: 55,
      outfit_layer_type: "pants",
      created_at: now
    },
    {
      name: "Minimalist sport krossovkalari",
      category: "Oyoq kiyimlar",
      price: 499000,
      old_price: 590000,
      discount: 15,
      description: "Tabiiy yumshoq oq teridan ishlangan, amortizatsiyali engil taglikka ega yuqori sifatli krossovkalar.",
      sizes: JSON.stringify(["40", "41", "42", "43", "44", "45"]),
      colors: JSON.stringify(["#FFFFFF", "#F3F4F6", "#18181B"]),
      image_url: "/src/assets/images/product_white_sneakers_1791973133561.jpg",
      thumbnails: JSON.stringify([
        "/src/assets/images/product_white_sneakers_1791973133561.jpg"
      ]),
      is_featured: 1,
      is_new: 1,
      stock: 29,
      outfit_layer_type: "shoes",
      created_at: now
    },
    {
      name: "Ikki qismli dvoyka kostyum",
      category: "Dvoykalar",
      price: 1290000,
      old_price: 1450000,
      discount: 11,
      description: "Besh yulduzli tadbirlar, to'y va rasmiy marosimlar uchun Italiya uslubidagi jentlmen kostyum-shimi.",
      sizes: JSON.stringify(["48", "50", "52", "54", "56"]),
      colors: JSON.stringify(["#0F172A", "#18181B", "#334155"]),
      image_url: "/src/assets/images/product_classic_suit_1791973133736.jpg",
      thumbnails: JSON.stringify([
        "/src/assets/images/product_classic_suit_1791973133736.jpg"
      ]),
      is_featured: 1,
      is_new: 1,
      stock: 16,
      outfit_layer_type: "jacket",
      created_at: now
    },
    {
      name: "Qalin junli trikotaj sviter",
      category: "Sviterlar",
      price: 349000,
      old_price: 390000,
      discount: 10,
      description: "Muzdek ob-havoda o'zgacha qulaylik baxsh etuvchi, qizdirmaydigan nafis merinos junli sviter.",
      sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["#D1D5DB", "#1F2937", "#9A3412"]),
      image_url: "/src/assets/images/outfit_model_base_1791973131662.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 0,
      is_new: 1,
      stock: 24,
      outfit_layer_type: "jacket",
      created_at: now
    },
    {
      name: "Zamonaviy sport kostyumi",
      category: "Sport kiyimlari",
      price: 429000,
      old_price: 480000,
      discount: 10,
      description: "Uch ipli pishiq futerdan tayyorlangan, mashg'ulotlar va sayr uchun ideal sport to'plami.",
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["#18181B", "#6B7280", "#1E3A8A"]),
      image_url: "/src/assets/images/outfit_model_base_1791973131662.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 0,
      is_new: 1,
      stock: 35,
      outfit_layer_type: "jacket",
      created_at: now
    },
    {
      name: "Erkaklar atiri «SHU Noir Intense»",
      category: "Atirlar",
      price: 380000,
      old_price: 450000,
      discount: 15,
      description: "Yog'ochli, tamaki va amber notalaridan iborat uzoq saqlanuvchi erkaklar ifori. 100ml.",
      sizes: JSON.stringify(["100ml"]),
      colors: JSON.stringify(["#18181B"]),
      image_url: "/src/assets/images/product_classic_jacket_1791973132035.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 1,
      is_new: 0,
      stock: 40,
      outfit_layer_type: "accessory",
      created_at: now
    },
    {
      name: "SHU BREND xronograf soati",
      category: "Soatlar",
      price: 650000,
      old_price: 750000,
      discount: 13,
      description: "Yaponiya kvarts mexanizmi, qora zanglamaydigan po'lat korpus va safir shisha.",
      sizes: JSON.stringify(["42mm"]),
      colors: JSON.stringify(["#18181B", "#D4AF37", "#9CA3AF"]),
      image_url: "/src/assets/images/hero_model_man_1791973131385.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 1,
      is_new: 1,
      stock: 18,
      outfit_layer_type: "accessory",
      created_at: now
    },
    {
      name: "SHU BREND kashtali kepka",
      category: "Boshqa",
      price: 149000,
      old_price: 180000,
      discount: 17,
      description: "Qora premium paxta matosidan tayyorlangan SHU BREND logotipli zamonaviy kepka.",
      sizes: JSON.stringify(["Universal"]),
      colors: JSON.stringify(["#18181B", "#FFFFFF", "#4B5563"]),
      image_url: "/src/assets/images/hero_model_man_1791973131385.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 0,
      is_new: 1,
      stock: 60,
      outfit_layer_type: "accessory",
      created_at: now
    },
    {
      name: "Premium charm sayohat sumkasi",
      category: "Boshqa",
      price: 520000,
      old_price: 600000,
      discount: 13,
      description: "Tabiiy zich charm, suv o'tkazmaydigan astar va qulay yelkama tasmali keng sumka.",
      sizes: JSON.stringify(["Standard"]),
      colors: JSON.stringify(["#18181B", "#78350F"]),
      image_url: "/src/assets/images/product_classic_suit_1791973133736.jpg",
      thumbnails: JSON.stringify([]),
      is_featured: 0,
      is_new: 0,
      stock: 14,
      outfit_layer_type: "accessory",
      created_at: now
    }
  ];

  for (const p of initialProducts) {
    db.run(
      `INSERT INTO products (name, category, price, old_price, discount, description, sizes, colors, image_url, thumbnails, is_featured, is_new, stock, outfit_layer_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.name,
        p.category,
        p.price,
        p.old_price,
        p.discount,
        p.description,
        p.sizes,
        p.colors,
        p.image_url,
        p.thumbnails,
        p.is_featured,
        p.is_new,
        p.stock,
        p.outfit_layer_type,
        p.created_at
      ]
    );
  }

  // Seed initial demo orders matching mockup screen 5
  const initialOrders = [
    {
      order_number: "SB-104725",
      customer_name: "Aliyev Samandar",
      customer_phone: "+998 90 123 45 67",
      delivery_address: "Toshkent sh., Yunusobod tumani, 14-mavze, 22-uy",
      map_link: "https://yandex.uz/maps/-/CDuV5QpA",
      notes: "Eshik kodi: 45K. Iltimos, oldindan qo'ng'iroq qiling.",
      items: JSON.stringify([
        { id: 1, name: "Klassik kurtka", price: 599000, quantity: 1, size: "L", color: "#18181B" },
        { id: 8, name: "Zamonaviy sport kostyumi", price: 418000, quantity: 1, size: "XL", color: "#18181B" }
      ]),
      total_amount: 1017000,
      status: "Yangi",
      telegram_sent: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
    },
    {
      order_number: "SB-104722",
      customer_name: "Karimov Aziz",
      customer_phone: "+998 93 456 78 90",
      delivery_address: "Toshkent sh., Chilonzor tumani, Qatortol ko'chasi 5-uy",
      map_link: "https://yandex.uz/maps/-/CDuV5QzB",
      notes: "Ish joyiga yetkazish soat 17:00 gacha",
      items: JSON.stringify([
        { id: 10, name: "SHU BREND xronograf soati", price: 650000, quantity: 1, size: "42mm", color: "#18181B" }
      ]),
      total_amount: 650000,
      status: "Tasdiqlandi",
      telegram_sent: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      order_number: "SB-104721",
      customer_name: "Rustamov Shohruh",
      customer_phone: "+998 97 890 12 34",
      delivery_address: "Samarqand sh., Registon ko'chasi 18-uy",
      map_link: "https://yandex.uz/maps/-/CDuV5QxC",
      notes: "Tezkor BTS pochta orqali",
      items: JSON.stringify([
        { id: 6, name: "Ikki qismli dvoyka kostyum", price: 1290000, quantity: 1, size: "52", color: "#0F172A" }
      ]),
      total_amount: 1290000,
      status: "Yetkazilmoqda",
      telegram_sent: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
    },
    {
      order_number: "SB-104720",
      customer_name: "Saparov Dilshod",
      customer_phone: "+998 94 333 22 11",
      delivery_address: "Buxoro sh., I. Somoniy ko'chasi 112-uy",
      map_link: "",
      notes: "Kechqurun yetkazilsin",
      items: JSON.stringify([
        { id: 5, name: "Minimalist sport krossovkalari", price: 499000, quantity: 1, size: "42", color: "#FFFFFF" }
      ]),
      total_amount: 499000,
      status: "Bajarildi",
      telegram_sent: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 800).toISOString()
    },
    {
      order_number: "SB-104719",
      customer_name: "Abdullayev Behzod",
      customer_phone: "+998 91 999 88 77",
      delivery_address: "Toshkent sh., Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li 45-uy",
      map_link: "",
      notes: "",
      items: JSON.stringify([
        { id: 4, name: "Premium klassik to'q shim", price: 329000, quantity: 1, size: "32", color: "#18181B" },
        { id: 9, name: "Erkaklar atiri «SHU Noir Intense»", price: 380000, quantity: 1, size: "100ml", color: "#18181B" },
        { id: 11, name: "SHU BREND kashtali kepka", price: 149000, quantity: 1, size: "Universal", color: "#18181B" }
      ]),
      total_amount: 858000,
      status: "Yangi",
      telegram_sent: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 920).toISOString()
    }
  ];

  for (const ord of initialOrders) {
    db.run(
      `INSERT INTO orders (order_number, customer_name, customer_phone, delivery_address, map_link, notes, items, total_amount, status, telegram_sent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ord.order_number,
        ord.customer_name,
        ord.customer_phone,
        ord.delivery_address,
        ord.map_link,
        ord.notes,
        ord.items,
        ord.total_amount,
        ord.status,
        ord.telegram_sent,
        ord.created_at
      ]
    );
  }
}

// Product Helpers
export async function getAllProducts(filters?: { category?: string; search?: string; sort?: string; is_new?: boolean; is_featured?: boolean }): Promise<Product[]> {
  const db = await getDb();
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (filters?.category && filters.category !== 'Barchasi' && filters.category !== 'Barcha mahsulotlar') {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters?.search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters?.is_new) {
    sql += ' AND is_new = 1';
  }

  if (filters?.is_featured) {
    sql += ' AND is_featured = 1';
  }

  if (filters?.sort === 'price_asc') {
    sql += ' ORDER BY price ASC';
  } else if (filters?.sort === 'price_desc') {
    sql += ' ORDER BY price DESC';
  } else if (filters?.sort === 'newest') {
    sql += ' ORDER BY id DESC';
  } else {
    // Default Ommabop / featured
    sql += ' ORDER BY is_featured DESC, id DESC';
  }

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const products: Product[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as any;
    products.push(formatProduct(row));
  }
  stmt.free();

  return products;
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  stmt.bind([id]);

  let product: Product | null = null;
  if (stmt.step()) {
    product = formatProduct(stmt.getAsObject());
  }
  stmt.free();
  return product;
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const db = await getDb();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO products (name, category, price, old_price, discount, description, sizes, colors, image_url, thumbnails, is_featured, is_new, stock, outfit_layer_type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.category,
      data.price,
      data.old_price || 0,
      data.discount || 0,
      data.description || '',
      JSON.stringify(data.sizes || []),
      JSON.stringify(data.colors || []),
      data.image_url,
      JSON.stringify(data.thumbnails || []),
      data.is_featured ? 1 : 0,
      data.is_new ? 1 : 0,
      data.stock || 50,
      data.outfit_layer_type || '',
      now
    ]
  );
  saveDb(db);

  const res = db.exec('SELECT MAX(id) as id FROM products');
  const newId = Number(res[0].values[0][0]);
  return (await getProductById(newId))!;
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
  const db = await getDb();
  const existing = await getProductById(id);
  if (!existing) return null;

  const updated = { ...existing, ...data };

  db.run(
    `UPDATE products SET
      name = ?,
      category = ?,
      price = ?,
      old_price = ?,
      discount = ?,
      description = ?,
      sizes = ?,
      colors = ?,
      image_url = ?,
      thumbnails = ?,
      is_featured = ?,
      is_new = ?,
      stock = ?,
      outfit_layer_type = ?
    WHERE id = ?`,
    [
      updated.name,
      updated.category,
      updated.price,
      updated.old_price || 0,
      updated.discount || 0,
      updated.description,
      JSON.stringify(updated.sizes),
      JSON.stringify(updated.colors),
      updated.image_url,
      JSON.stringify(updated.thumbnails),
      updated.is_featured ? 1 : 0,
      updated.is_new ? 1 : 0,
      updated.stock,
      updated.outfit_layer_type || '',
      id
    ]
  );
  saveDb(db);

  return getProductById(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDb();
  db.run('DELETE FROM products WHERE id = ?', [id]);
  saveDb(db);
  return true;
}

// Order Helpers
export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
  const orders: Order[] = [];
  while (stmt.step()) {
    orders.push(formatOrder(stmt.getAsObject()));
  }
  stmt.free();
  return orders;
}

export async function getOrderById(id: number): Promise<Order | null> {
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  stmt.bind([id]);
  let order: Order | null = null;
  if (stmt.step()) {
    order = formatOrder(stmt.getAsObject());
  }
  stmt.free();
  return order;
}

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  map_link?: string;
  notes?: string;
  items: OrderItem[];
}): Promise<Order> {
  const db = await getDb();
  const now = new Date().toISOString();

  // Recalculate true prices on server to prevent client-side manipulation
  let verifiedTotal = 0;
  const verifiedItems: OrderItem[] = [];

  for (const item of data.items) {
    const prod = await getProductById(item.id);
    const itemPrice = prod ? prod.price : item.price;
    const quantity = Math.max(1, Math.min(99, item.quantity || 1));
    verifiedTotal += itemPrice * quantity;
    verifiedItems.push({
      id: item.id,
      name: prod ? prod.name : item.name,
      price: itemPrice,
      quantity,
      size: item.size || 'Universal',
      color: item.color || '#18181B',
      image_url: prod ? prod.image_url : item.image_url
    });
  }

  // Generate unique order number
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SB-${Date.now().toString().slice(-4)}${randomSuffix}`;

  db.run(
    `INSERT INTO orders (order_number, customer_name, customer_phone, delivery_address, map_link, notes, items, total_amount, status, telegram_sent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderNumber,
      data.customer_name,
      data.customer_phone,
      data.delivery_address,
      data.map_link || '',
      data.notes || '',
      JSON.stringify(verifiedItems),
      verifiedTotal,
      'Yangi',
      0,
      now
    ]
  );
  saveDb(db);

  const res = db.exec('SELECT MAX(id) as id FROM orders');
  const newId = Number(res[0].values[0][0]);
  return (await getOrderById(newId))!;
}

export async function updateOrderStatus(id: number, status: Order['status'], telegramSent?: number): Promise<Order | null> {
  const db = await getDb();
  if (typeof telegramSent === 'number') {
    db.run('UPDATE orders SET status = ?, telegram_sent = ? WHERE id = ?', [status, telegramSent, id]);
  } else {
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  }
  saveDb(db);
  return getOrderById(id);
}

export async function updateOrderTelegramSent(id: number, sent: boolean): Promise<void> {
  const db = await getDb();
  db.run('UPDATE orders SET telegram_sent = ? WHERE id = ?', [sent ? 1 : 0, id]);
  saveDb(db);
}

// Stats Helper
export async function getAdminStats() {
  const db = await getDb();
  const allOrders = await getAllOrders();
  const products = await getAllProducts();

  const totalOrders = allOrders.length;
  const newOrders = allOrders.filter(o => o.status === 'Yangi').length;
  const inProgressOrders = allOrders.filter(o => o.status === 'Tayyorlanmoqda' || o.status === 'Tasdiqlandi' || o.status === 'Yetkazilmoqda').length;
  const completedOrders = allOrders.filter(o => o.status === 'Bajarildi').length;
  const canceledOrders = allOrders.filter(o => o.status === 'Bekor qilindi').length;

  // Total sales MUST exclude canceled orders
  const totalSales = allOrders
    .filter(o => o.status !== 'Bekor qilindi')
    .reduce((sum, o) => sum + o.total_amount, 0);

  return {
    totalProducts: products.length,
    totalOrders,
    newOrders,
    inProgressOrders,
    completedOrders,
    canceledOrders,
    totalSales
  };
}

// Admin Token Helpers
export async function storeAdminToken(token: string, username: string): Promise<void> {
  const db = await getDb();
  db.run('INSERT OR REPLACE INTO admin_tokens (token, username, created_at) VALUES (?, ?, ?)', [
    token,
    username,
    Date.now()
  ]);
  saveDb(db);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const db = await getDb();
  const stmt = db.prepare('SELECT * FROM admin_tokens WHERE token = ?');
  stmt.bind([token]);
  const exists = stmt.step();
  stmt.free();
  return exists;
}

export async function removeAdminToken(token: string): Promise<void> {
  const db = await getDb();
  db.run('DELETE FROM admin_tokens WHERE token = ?', [token]);
  saveDb(db);
}

function formatProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: String(row.name),
    category: String(row.category),
    price: Number(row.price),
    old_price: Number(row.old_price || 0),
    discount: Number(row.discount || 0),
    description: String(row.description || ''),
    sizes: safeJsonParse(row.sizes, ["S", "M", "L", "XL"]),
    colors: safeJsonParse(row.colors, ["#18181B"]),
    image_url: String(row.image_url),
    thumbnails: safeJsonParse(row.thumbnails, []),
    is_featured: Boolean(row.is_featured),
    is_new: Boolean(row.is_new),
    stock: Number(row.stock || 0),
    outfit_layer_type: row.outfit_layer_type || undefined,
    created_at: String(row.created_at)
  };
}

function formatOrder(row: any): Order {
  return {
    id: Number(row.id),
    order_number: String(row.order_number),
    customer_name: String(row.customer_name),
    customer_phone: String(row.customer_phone),
    delivery_address: String(row.delivery_address),
    map_link: String(row.map_link || ''),
    notes: String(row.notes || ''),
    items: safeJsonParse(row.items, []),
    total_amount: Number(row.total_amount),
    status: row.status as Order['status'],
    telegram_sent: Number(row.telegram_sent || 0),
    created_at: String(row.created_at)
  };
}

function safeJsonParse(str: string | null | undefined, fallback: any) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
