import { useState } from "react"

function AdminLogin() {

  const [username, setUsername] =
    useState("")

  const [password, setPassword] =
    useState("")

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      !username.trim() ||
      !password.trim()
    ) {
      return
    }

    console.log("Admin login test")
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


          <button
            type="submit"
            disabled={
              !username.trim() ||
              !password.trim()
            }
          >
            تسجيل الدخول
          </button>

        </form>

      </div>
    </main>
  )
}

export default AdminLogin