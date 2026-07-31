import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)

// إنشاء جدول التصنيفات إذا لم يكن موجوداً
db.exec(`
  CREATE TABLE IF NOT EXISTS Category (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

const categories = [
  { id: 'cat_1', name: 'أساور خرزية', slug: 'beaded-bracelets' },
  { id: 'cat_2', name: 'إكسسوارات', slug: 'accessories' },
  { id: 'cat_3', name: 'تيشيرتات', slug: 't-shirts' },
  { id: 'cat_4', name: 'هوديات', slug: 'hoodies' },
]

const insertCategory = db.prepare(`
  INSERT INTO Category (id, name, slug, createdAt, updatedAt)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  ON CONFLICT(slug) DO UPDATE SET name=excluded.name
`)

for (const cat of categories) {
  insertCategory.run(cat.id, cat.name, cat.slug)
}

console.log('✅ تم إضافة التصنيفات الأساسية بنجاح!')