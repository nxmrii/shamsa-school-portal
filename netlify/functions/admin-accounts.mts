import { jwtVerify } from "jose"
import { desc } from "drizzle-orm"

import { db } from "../../db/index.js"
import { schoolAccounts } from "../../db/schema.js"


type CreateAccountBody = {
  civilId: string
  noorPassword: string
  userType: string
}


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


    // =========================
    // GET ACCOUNTS
    // =========================

    if (request.method === "GET") {

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
          .orderBy(
            desc(
              schoolAccounts.createdAt
            )
          )


      return Response.json({
        success: true,
        accounts,
      })
    }


    // =========================
    // CREATE ACCOUNT
    // =========================

    if (request.method === "POST") {
const body =
  await request.json() as CreateAccountBody

const {
  civilId,
  noorPassword,
  userType,
} = body


      const cleanCivilId =
        civilId?.trim()

      const cleanPassword =
        noorPassword?.trim()


      if (
        !cleanCivilId ||
        !cleanPassword ||
        !userType
      ) {
        return Response.json(
          {
            success: false,
            message:
              "جميع البيانات مطلوبة.",
          },
          {
            status: 400,
          }
        )
      }


      if (
        ![
          "teacher",
          "student",
          "parent",
        ].includes(userType)
      ) {
        return Response.json(
          {
            success: false,
            message:
              "نوع المستخدم غير صحيح.",
          },
          {
            status: 400,
          }
        )
      }


      if (!/^\d+$/.test(cleanCivilId)) {
        return Response.json(
          {
            success: false,
            message:
              "الرقم المدني يجب أن يحتوي على أرقام فقط.",
          },
          {
            status: 400,
          }
        )
      }


      const [newAccount] =
        await db
          .insert(schoolAccounts)
          .values({
            civilId:
              cleanCivilId,

            noorPassword:
              cleanPassword,

            userType,
          })
          .returning()


      return Response.json(
        {
          success: true,
          message:
            "تمت إضافة الحساب بنجاح.",
          account: newAccount,
        },
        {
          status: 201,
        }
      )
    }


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

  } catch (error) {

    console.error(
      "ADMIN ACCOUNTS ERROR:",
      error
    )


    const message =
      error instanceof Error
        ? error.message
        : ""


    if (
      message.includes(
        "school_accounts_civil_id_idx"
      ) ||
      message.includes(
        "duplicate key"
      )
    ) {
      return Response.json(
        {
          success: false,
          message:
            "هذا الرقم المدني موجود مسبقًا.",
        },
        {
          status: 409,
        }
      )
    }


    return Response.json(
      {
        success: false,
        message:
          "حدث خطأ أثناء معالجة الحساب.",
      },
      {
        status: 500,
      }
    )
  }
}