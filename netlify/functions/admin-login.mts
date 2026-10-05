import { SignJWT } from "jose"

type AdminLoginBody = {
  username: string
  password: string
}

export default async (request: Request) => {
  try {
    if (request.method !== "POST") {
      return Response.json(
        {
          success: false,
          message: "Method not allowed",
        },
        {
          status: 405,
        }
      )
    }

    const {
      username,
      password,
    } = await request.json() as AdminLoginBody

    if (!username || !password) {
      return Response.json(
        {
          success: false,
          message:
            "اسم المستخدم وكلمة المرور مطلوبان.",
        },
        {
          status: 400,
        }
      )
    }

    const adminUsername =
      process.env.ADMIN_USERNAME

    const adminPassword =
      process.env.ADMIN_PASSWORD

    const sessionSecret =
      process.env.ADMIN_SESSION_SECRET

    if (
      !adminUsername ||
      !adminPassword ||
      !sessionSecret
    ) {
      console.error(
        "Admin environment variables are missing"
      )

      return Response.json(
        {
          success: false,
          message:
            "إعدادات الإدارة غير مكتملة.",
        },
        {
          status: 500,
        }
      )
    }

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return Response.json(
        {
          success: false,
          message:
            "اسم المستخدم أو كلمة المرور غير صحيحة.",
        },
        {
          status: 401,
        }
      )
    }

    const secret =
      new TextEncoder().encode(
        sessionSecret
      )

    const token =
      await new SignJWT({
        role: "admin",
      })
        .setProtectedHeader({
          alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret)

    return Response.json(
      {
        success: true,
        message:
          "تم تسجيل الدخول بنجاح.",
      },
      {
        headers: {
          "Set-Cookie":
            `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200`,
        },
      }
    )

  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error
    )

    return Response.json(
      {
        success: false,
        message:
          "حدث خطأ أثناء تسجيل الدخول.",
      },
      {
        status: 500,
      }
    )
  }
}