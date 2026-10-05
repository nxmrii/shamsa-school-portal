import { jwtVerify } from "jose"

import { db } from "../../db/index.js"
import { schoolAccounts } from "../../db/schema.js"


async function isAdmin(
  request: Request
) {
  try {
    const sessionSecret =
      process.env.ADMIN_SESSION_SECRET

    if (!sessionSecret) {
      return false
    }

    const cookieHeader =
      request.headers.get("cookie")

    if (!cookieHeader) {
      return false
    }

    const cookies =
      Object.fromEntries(
        cookieHeader
          .split(";")
          .map((cookie) => {
            const [
              name,
              ...value
            ] = cookie.trim().split("=")

            return [
              name,
              value.join("="),
            ]
          })
      )

    const token =
      cookies.admin_session

    if (!token) {
      return false
    }

    const secret =
      new TextEncoder().encode(
        sessionSecret
      )

    const { payload } =
      await jwtVerify(
        token,
        secret
      )

    return payload.role === "admin"

  } catch {
    return false
  }
}


export default async (
  request: Request
) => {
  try {

    if (request.method !== "GET") {
      return Response.json(
        {
          success: false,
          message:
            "Method not allowed",
        },
        {
          status: 405,
        }
      )
    }


    const authenticated =
      await isAdmin(request)


    if (!authenticated) {
      return Response.json(
        {
          success: false,
          message:
            "غير مصرح لك بالدخول.",
        },
        {
          status: 401,
        }
      )
    }


    const accounts =
      await db
        .select({
          id:
            schoolAccounts.id,

          civilId:
            schoolAccounts.civilId,

          noorPassword:
            schoolAccounts.noorPassword,

          userType:
            schoolAccounts.userType,

          createdAt:
            schoolAccounts.createdAt,
        })
        .from(schoolAccounts)


    return Response.json({
      success: true,
      accounts,
    })

  } catch (error) {

    console.error(
      "ADMIN ACCOUNTS ERROR:",
      error
    )

    return Response.json(
      {
        success: false,
        message:
          "حدث خطأ أثناء جلب الحسابات.",
      },
      {
        status: 500,
      }
    )
  }
}