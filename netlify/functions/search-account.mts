import { and, eq } from "drizzle-orm"

import { db } from "../../db/index.js"
import { schoolAccounts } from "../../db/schema.js"


type SearchAccountBody = {
  civilId: string
  userType: string
}


export default async (request: Request) => {
  try {

    if (request.method !== "POST") {
      return Response.json(
        {
          error: "Method not allowed",
        },
        {
          status: 405,
        }
      )
    }


    const {
      civilId,
      userType,
    } = await request.json() as SearchAccountBody


    if (!civilId || !userType) {
      return Response.json(
        {
          error:
            "Civil ID and user type are required",
        },
        {
          status: 400,
        }
      )
    }


    const accounts = await db
      .select()
      .from(schoolAccounts)
      .where(
        and(
          eq(
            schoolAccounts.civilId,
            civilId
          ),
          eq(
            schoolAccounts.userType,
            userType
          )
        )
      )
      .limit(1)


    if (accounts.length === 0) {
      return Response.json(
        {
          error: "Account not found",
        },
        {
          status: 404,
        }
      )
    }


    return Response.json({
      password:
        accounts[0].noorPassword,
    })

  } catch (error) {

    console.error(
      "SEARCH ACCOUNT ERROR:",
      error
    )

    return Response.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}