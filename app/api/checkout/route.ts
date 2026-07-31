import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, items, totalAmount } = body

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json({ message: 'يرجى إكمال جميع الحقول المطلوبة' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'السلة فارغة' }, { status: 400 })
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

    // إنشاء جدول Orders الموحد
    db.exec(`
      CREATE TABLE IF NOT EXISTS "Orders" (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        city TEXT NOT NULL,
        address TEXT NOT NULL,
        notes TEXT,
        items TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT DEFAULT 'جديد',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)

    const stmt = db.prepare(`
      INSERT INTO "Orders" (id, customerName, customerPhone, city, address, notes, items, totalAmount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      orderId,
      customer.name,
      customer.phone,
      customer.city || 'عمان',
      customer.address,
      customer.notes || '',
      JSON.stringify(items),
      Number(totalAmount),
      'جديد'
    )

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك بنجاح!',
      orderId: orderId,
    })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json({ message: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 })
  }
}