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

          <button type="button">
            + إضافة حساب
          </button>

        </section>


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

                      <td>
                        ••••••••
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