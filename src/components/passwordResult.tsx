import { useState } from "react"

type Props = {
  password: string
  onBack: () => void
}

function PasswordResult({
  password,
  onBack,
}: Props) {

  const [showPassword, setShowPassword] =
    useState(false)

  async function copyPassword() {
    await navigator.clipboard.writeText(
      password
    )
  }

  return (
    <div className="password-result">

      <div className="success-icon">
        ✓
      </div>

      <h2>
        تم العثور على الحساب
      </h2>

      <p>
        كلمة المرور الخاصة بمنصة نور
      </p>


      <div className="password-box">

        <span>
          {showPassword
            ? password
            : "••••••••"}
        </span>

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
        >
          {showPassword
            ? "إخفاء"
            : "إظهار"}
        </button>

      </div>


      <button
        type="button"
        className="copy-button"
        onClick={copyPassword}
      >
        نسخ كلمة المرور
      </button>


      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        رجوع
      </button>

    </div>
  )
}

export default PasswordResult