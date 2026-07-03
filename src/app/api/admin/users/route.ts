import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle/connection"
import { customers, orders, admins, users } from "@/lib/db/drizzle/schema"
import { count, desc } from "drizzle-orm"
import { getSessionFromRequest } from "@/lib/auth/middleware"

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Get all auth users
    const authUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt))

    // Get all admins (by auth_user_id)
    const adminList = await db.select({ id: admins.id, auth_user_id: admins.auth_user_id, email: admins.email }).from(admins)
    const adminByAuthId = new Map(adminList.map(a => [a.auth_user_id, a.id]))
    const adminByEmail = new Map(adminList.map(a => [a.email, a.id]))

    // Get customers (to get phone)
    const customerList = await db.select({
      auth_user_id: customers.auth_user_id,
      phone: customers.phone,
    }).from(customers)
    const phoneByAuthId = new Map(customerList.map(c => [c.auth_user_id, c.phone]))

    // Get order counts by phone
    const orderCounts = await db.select({ phone: orders.phone, cnt: count() }).from(orders).groupBy(orders.phone)
    const orderByPhone = new Map(orderCounts.map(o => [o.phone, o.cnt]))

    return NextResponse.json(
      authUsers.map(u => {
        const phone = phoneByAuthId.get(u.id) ?? null
        const isAdmin = adminByAuthId.has(u.id) || adminByEmail.has(u.email)
        const adminId = adminByAuthId.get(u.id) ?? adminByEmail.get(u.email) ?? null
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          createdAt: u.createdAt,
          phone,
          orderCount: phone ? (orderByPhone.get(phone) ?? 0) : 0,
          isAdmin,
          adminId,
        }
      })
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json([], { status: 200 })
  }
}
