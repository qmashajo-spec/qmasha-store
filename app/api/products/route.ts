import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const categorySlug = formData.get('categorySlug') as string
    const imageFile = formData.get('imageFile') as File | null
    let imageUrl = formData.get('imageUrl') as string || ''

    // إذا تم رفع ملف صورة من الجهاز
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`
      const filePath = path.join(uploadDir, fileName)
      await writeFile(filePath, buffer)

      imageUrl = `/uploads/${fileName}`
    }

    const db = new Database(dbPath)

    db.exec(`
      CREATE TABLE IF NOT EXISTS Product (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        categorySlug TEXT NOT NULL,
        imageUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const id = 'prod_' + Date.now()
    const insert = db.prepare(`
      INSERT INTO Product (id, title, price, description, categorySlug, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    insert.run(id, title, parseFloat(price), description, categorySlug, imageUrl)

    return NextResponse.json({ success: true, message: 'تم حفظ المنتج والصورة بنجاح!' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء الحفظ' }, { status: 500 })
  }
}