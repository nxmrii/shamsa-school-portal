import type {
  PasswordRequest,
  PasswordResponse,
} from "../types/user"


export async function getNoorPassword(
  request: PasswordRequest
): Promise<PasswordResponse> {

  try {

    const response = await fetch(
      "/.netlify/functions/search-account",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          civilId: request.civilId,
          userType: request.userType,
        }),
      }
    )


    const data = await response.json()


    if (!response.ok) {

      if (response.status === 404) {
        return {
          success: false,
          message:
            "الرقم المدني غير موجود.",
        }
      }

      return {
        success: false,
        message:
          data.error ||
          "حدث خطأ أثناء البحث.",
      }
    }


    return {
      success: true,
      password: data.password,
    }

  } catch (error) {

    console.error(
      "GET NOOR PASSWORD ERROR:",
      error
    )

    return {
      success: false,
      message:
        "تعذر الاتصال بالخادم.",
    }

  }
}