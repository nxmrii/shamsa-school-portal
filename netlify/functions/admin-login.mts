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


    return Response.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح.",
    })

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