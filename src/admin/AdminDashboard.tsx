import {
  useEffect,
  useState,
} from "react"


type Account = {
  id: number
  civilId: string
  noorPassword: string
  userType: string
}


function AdminDashboard() {

  const [accounts, setAccounts] =
    useState<Account[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [filter, setFilter] =
    useState("all")

    const [showAddForm, setShowAddForm] =
  useState(false)

const [newCivilId, setNewCivilId] =
  useState("")

const [newPassword, setNewPassword] =
  useState("")

const [newUserType, setNewUserType] =
  useState("teacher")

const [saving, setSaving] =
  useState(false)

const [formError, setFormError] =
  useState("")


  useEffect(() => {
    loadAccounts()
  }, [])


  async function loadAccounts() {
    setLoading(true)
    setError("")

    try {

      const response = await fetch(
        "/.netlify/functions/admin-accounts"
      )

      const data =
        await response.json()


      if (!response.ok) {

        setError(
          data.message ||
          "تعذر تحميل الحسابات."
        )

        return
      }


      setAccounts(
        data.accounts || []
      )

    } catch (error) {

      console.error(
        "LOAD ACCOUNTS ERROR:",
        error
      )

      setError(
        "حدث خطأ أثناء الاتصال بالخادم."
      )

    } finally {

      setLoading(false)
    }
  }


  const filteredAccounts =
    accounts.filter((account) => {

      const matchesSearch =
        account.civilId.includes(
          search.trim()
        )

      const matchesFilter =
        filter === "all" ||
        account.userType === filter

      return (
        matchesSearch &&
        matchesFilter
      )
    })


    async function handleAddAccount(
  e: React.FormEvent
) {
  e.preventDefault()

  if (
    !newCivilId.trim() ||
    !newPassword.trim()
  ) {
    setFormError(
      "يرجى إدخال جميع البيانات."
    )

    return
  }


  setSaving(true)
  setFormError("")


  try {

    const response = await fetch(
      "/.netlify/functions/admin-accounts",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          civilId:
            newCivilId.trim(),

          noorPassword:
            newPassword.trim(),

          userType:
            newUserType,
        }),
      }
    )


    const data =
      await response.json()


    if (!response.ok) {

      setFormError(
        data.message ||
        "تعذر إضافة الحساب."
      )

      return
    }


    setNewCivilId("")
    setNewPassword("")
    setNewUserType("teacher")

    setShowAddForm(false)

    await loadAccounts()


  } catch (error) {

    console.error(
      "ADD ACCOUNT ERROR:",
      error
    )

    setFormError(
      "حدث خطأ أثناء الاتصال بالخادم."
    )

  } finally {

    setSaving(false)
  }
}

  function getUserTypeName(
    type: string
  ) {
    if (type === "teacher") {
      return "معلمة"
    }

    if (type === "student") {
      return "طالبة"
    }

    if (type === "parent") {
      return "ولي أمر"
    }

    return type
  }


  return (
    <main
      className="admin-dashboard"
      dir="rtl"
    >
      <div className="admin-dashboard-container">

        <header className="admin-dashboard-header">

          <div>
            <h1>
              لوحة إدارة حسابات منصة نور
            </h1>

            <p>
              مدرسة شمساء الخليلي
            </p>
          </div>

          <button
            className="admin-logout-button"
            type="button"
          >
            تسجيل الخروج
          </button>

        </header>


        <section className="admin-welcome">

          <h2>
            مرحبًا بكِ 👋
          </h2>

          <p>
            يمكنكِ من هنا إدارة حسابات
            المعلمات والطالبات وأولياء الأمور.
          </p>

        </section>


        <section className="admin-actions">

          <input
            type="text"
            value={search}
            placeholder="🔎 البحث بالرقم المدني"
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

         <button
  type="button"
  onClick={() => {
    setFormError("")
    setShowAddForm(true)
  }}
>
  + إضافة حساب
</button>

        </section>

        {showAddForm && (

  <div className="admin-form-card">

    <div className="admin-form-header">

      <div>
        <h3>
          إضافة حساب جديد
        </h3>

        <p>
          أدخلي بيانات حساب منصة نور
        </p>
      </div>

      <button
        type="button"
        className="admin-close-button"
        onClick={() =>
          setShowAddForm(false)
        }
      >
        ×
      </button>

    </div>


    <form
      onSubmit={handleAddAccount}
      className="admin-account-form"
    >

      <label>
        نوع المستخدم
      </label>

      <select
        value={newUserType}
        onChange={(e) =>
          setNewUserType(
            e.target.value
          )
        }
      >
        <option value="teacher">
          معلمة
        </option>

        <option value="student">
          طالبة
        </option>

        <option value="parent">
          ولي أمر
        </option>
      </select>


      <label>
        الرقم المدني
      </label>

      <input
        type="text"
        inputMode="numeric"
        value={newCivilId}
        placeholder="أدخل الرقم المدني"
        onChange={(e) =>
          setNewCivilId(
            e.target.value.replace(
              /\D/g,
              ""
            )
          )
        }
      />


      <label>
        كلمة مرور منصة نور
      </label>

      <input
        type="text"
        value={newPassword}
        placeholder="أدخل كلمة المرور"
        onChange={(e) =>
          setNewPassword(
            e.target.value
          )
        }
      />


      {formError && (
        <div className="admin-error">
          {formError}
        </div>
      )}


      <div className="admin-form-buttons">

        <button
          type="button"
          className="admin-cancel-button"
          onClick={() =>
            setShowAddForm(false)
          }
        >
          إلغاء
        </button>


        <button
          type="submit"
          className="admin-save-button"
          disabled={saving}
        >
          {saving
            ? "جاري الإضافة..."
            : "إضافة الحساب"}
        </button>

      </div>

    </form>

  </div>

)}


        <section className="admin-filters">

          <button
            className={
              filter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("all")
            }
          >
            الكل
          </button>

          <button
            className={
              filter === "teacher"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("teacher")
            }
          >
            المعلمات
          </button>

          <button
            className={
              filter === "student"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("student")
            }
          >
            الطالبات
          </button>

          <button
            className={
              filter === "parent"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("parent")
            }
          >
            أولياء الأمور
          </button>

        </section>


        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        <section className="admin-table-card">

          <table>

            <thead>
              <tr>
                <th>الرقم المدني</th>
                <th>نوع المستخدم</th>
                <th>كلمة المرور</th>
                <th>الإجراءات</th>
              </tr>
            </thead>


            <tbody>

              {loading ? (

                <tr>
                  <td colSpan={4}>
                    جاري تحميل الحسابات...
                  </td>
                </tr>

              ) : filteredAccounts.length === 0 ? (

                <tr>
                  <td colSpan={4}>
                    لا توجد حسابات.
                  </td>
                </tr>

              ) : (

                filteredAccounts.map(
                  (account) => (

                    <tr key={account.id}>

                      <td>
                        {account.civilId}
                      </td>

                      <td>
                        {getUserTypeName(
                          account.userType
                        )}
                      </td>

                     <td className="noor-password">
  {account.noorPassword}
</td>

                      <td>
                        <button
                          type="button"
                        >
                          تعديل
                        </button>

                        {" "}

                        <button
                          type="button"
                        >
                          حذف
                        </button>
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </section>

      </div>
    </main>
  )
}

export default AdminDashboard