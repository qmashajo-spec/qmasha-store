import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    const db = new Database(dbPath)

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

    const stmt = db.prepare('SELECT * FROM "Orders" ORDER BY createdAt DESC')
    const orders = stmt.all()

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ success: false, orders: [] })
  }
}