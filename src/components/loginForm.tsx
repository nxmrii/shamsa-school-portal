import { useState } from "react"

type Props = {
  loading: boolean
  onSubmit: (civilId: string) => void
}

function LoginForm({
  loading,
  onSubmit,
}: Props) {

  const [civilId, setCivilId] =
    useState("")

  function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    const value =
      civilId.trim()

    if (!value) {
      return
    }

    onSubmit(value)
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >

      <label htmlFor="civilId">
        الرقم المدني
      </label>

      <input
        id="civilId"
        type="text"
        inputMode="numeric"
        value={civilId}
        placeholder="أدخل الرقم المدني"
        autoComplete="off"
        onChange={(e) =>
          setCivilId(
            e.target.value.replace(
              /\D/g,
              ""
            )
          )
        }
      />

      <button
        type="submit"
        disabled={
          loading ||
          !civilId.trim()
        }
      >
        {loading
          ? "جاري البحث..."
          : "عرض كلمة المرور"}
      </button>

    </form>
  )
}

export default LoginForm