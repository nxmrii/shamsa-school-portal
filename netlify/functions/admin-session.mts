import { jwtVerify } from "jose"

export default async (request: Request) => {
  try {
    if (request.method !== "GET") {
      return Response.json(
        {
          authenticated: false,
          message: "Method not allowed",
        },
        {
          status: 405,
        }
      )
    }

    const sessionSecret =
      process.env.ADMIN_SESSION_SECRET

    if (!sessionSecret) {
      console.error(
        "ADMIN_SESSION_SECRET is missing"
      )

      return Response.json(
        {
          authenticated: false,
        },
        {
          status: 500,
        }
      )
    }

    const cookieHeader =
      request.headers.get("cookie")

    if (!cookieHeader) {
      return Response.json(
        {
          authenticated: false,
        },
        {
          status: 401,
        }
      )
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
      return Response.json(
        {
          authenticated: false,
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

    const { payload } =
      await jwtVerify(
        token,
        secret
      )

    if (payload.role !== "admin") {
      return Response.json(
        {
          authenticated: false,
        },
        {
          status: 401,
        }
      )
    }

    return Response.json({
      authenticated: true,
    })

  } catch (error) {
    console.error(
      "ADMIN SESSION ERROR:",
      error
    )

    return Response.json(
      {
        authenticated: false,
      },
      {
        status: 401,
      }
    )
  }
}