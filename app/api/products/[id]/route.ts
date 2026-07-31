import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = new Database(dbPath)

    const stmt = db.prepare('DELETE FROM Product WHERE id = ?')
    stmt.run(id)

    return NextResponse.json({ success: true, message: 'تم حذف المنتج بنجاح' })
  } catch (error) {
    console.error('Delete Error:', error)
    return NextResponse.json({ success: false, error: 'فشل حذف المنتج' }, { status: 500 })
  }
}