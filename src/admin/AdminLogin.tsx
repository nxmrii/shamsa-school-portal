import { useState } from "react"
import AdminDashboard from "./AdminDashboard"

function AdminLogin() {
  const [username, setUsername] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState(false)


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !username.trim() ||
      !password.trim()
    ) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        "/.netlify/functions/admin-login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
          "اسم المستخدم أو كلمة المرور غير صحيحة."
        )

        return
      }

      setSuccess(true)

    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      )

      setError(
        "حدث خطأ أثناء الاتصال بالخادم."
      )

    } finally {
      setLoading(false)
    }
  }


  if (success) {
  return <AdminDashboard />

  }


  return (
    <main
      className="admin-page"
      dir="rtl"
    >
      <div className="admin-login-card">

        <div className="admin-icon">
          🔐
        </div>

        <h1>
          لوحة إدارة الحسابات
        </h1>

        <p>
          مدرسة شمساء الخليلي
        </p>


        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <label htmlFor="username">
            اسم المستخدم
          </label>

          <input
            id="username"
            type="text"
            value={username}
            placeholder="أدخلي اسم المستخدم"
            autoComplete="username"
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />


          <label
            htmlFor="adminPassword"
            className="admin-password-label"
          >
            كلمة المرور
          </label>

          <input
            id="adminPassword"
            type="password"
            value={password}
            placeholder="أدخلي كلمة المرور"
            autoComplete="current-password"
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={
              loading ||
              !username.trim() ||
              !password.trim()
            }
          >
            {loading
              ? "جاري تسجيل الدخول..."
              : "تسجيل الدخول"}
          </button>

        </form>

      </div>
    </main>
  )
}

export default AdminLogin