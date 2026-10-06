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


  // =========================
  // ADD ACCOUNT
  // =========================

  const [
    showAddForm,
    setShowAddForm,
  ] = useState(false)

  const [
    newCivilId,
    setNewCivilId,
  ] = useState("")

  const [
    newPassword,
    setNewPassword,
  ] = useState("")

  const [
    newUserType,
    setNewUserType,
  ] = useState("teacher")

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    formError,
    setFormError,
  ] = useState("")


  // =========================
  // EDIT ACCOUNT
  // =========================

  const [
    editingAccount,
    setEditingAccount,
  ] = useState<Account | null>(null)

  const [
    editCivilId,
    setEditCivilId,
  ] = useState("")

  const [
    editPassword,
    setEditPassword,
  ] = useState("")

  const [
    editUserType,
    setEditUserType,
  ] = useState("teacher")

  const [
    updating,
    setUpdating,
  ] = useState(false)

  const [
    editError,
    setEditError,
  ] = useState("")


  // =========================
  // LOAD ACCOUNTS
  // =========================

  useEffect(() => {
    loadAccounts()
  }, [])


  async function loadAccounts() {

    setLoading(true)
    setError("")

    try {

      const response =
        await fetch(
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


  // =========================
  // FILTER ACCOUNTS
  // =========================

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


  // =========================
  // ADD ACCOUNT
  // =========================

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

      const response =
        await fetch(
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


  // =========================
  // USER TYPE NAME
  // =========================

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


  // =========================
  // OPEN EDIT FORM
  // =========================

  function openEditForm(
    account: Account
  ) {

    setEditingAccount(account)

    setEditCivilId(
      account.civilId
    )

    setEditPassword(
      account.noorPassword
    )

    setEditUserType(
      account.userType
    )

    setEditError("")
  }


  // =========================
  // UPDATE ACCOUNT
  // =========================

  async function handleUpdateAccount(
    e: React.FormEvent
  ) {

    e.preventDefault()

    if (!editingAccount) {
      return
    }


    if (
      !editCivilId.trim() ||
      !editPassword.trim()
    ) {

      setEditError(
        "يرجى إدخال جميع البيانات."
      )

      return
    }


    setUpdating(true)
    setEditError("")


    try {

      const response =
        await fetch(
          "/.netlify/functions/admin-accounts",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id:
                editingAccount.id,

              civilId:
                editCivilId.trim(),

              noorPassword:
                editPassword.trim(),

              userType:
                editUserType,
            }),
          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        setEditError(
          data.message ||
          "تعذر تعديل الحساب."
        )

        return
      }


      setEditingAccount(null)

      await loadAccounts()

    } catch (error) {

      console.error(
        "UPDATE ACCOUNT ERROR:",
        error
      )

      setEditError(
        "حدث خطأ أثناء تعديل الحساب."
      )

    } finally {

      setUpdating(false)
    }
  }


  // =========================
  // DELETE ACCOUNT
  // =========================

  async function handleDeleteAccount(
    account: Account
  ) {

    const confirmed =
      window.confirm(
        `هل أنتِ متأكدة من حذف الحساب رقم ${account.civilId}؟`
      )


    if (!confirmed) {
      return
    }


    try {

      const response =
        await fetch(
          `/.netlify/functions/admin-accounts?id=${account.id}`,
          {
            method: "DELETE",
          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        window.alert(
          data.message ||
          "تعذر حذف الحساب."
        )

        return
      }


      await loadAccounts()

    } catch (error) {

      console.error(
        "DELETE ACCOUNT ERROR:",
        error
      )

      window.alert(
        "حدث خطأ أثناء حذف الحساب."
      )
    }
  }


  // =========================
  // PAGE
  // =========================

  return (

    <main
      className="admin-dashboard"
      dir="rtl"
    >

      <div className="admin-dashboard-container">


        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

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


        {/* ========================= */}
        {/* WELCOME */}
        {/* ========================= */}

        <section className="admin-welcome">

          <h2>
            مرحبًا بكِ 👋
          </h2>

          <p>
            يمكنكِ من هنا إدارة حسابات
            المعلمات والطالبات وأولياء الأمور.
          </p>

        </section>


        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}

        <section className="admin-actions">

          <input
            type="text"
            value={search}
            placeholder="🔎 البحث بالرقم المدني"
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          <button
            type="button"
            onClick={() => {

              setFormError("")

              setEditingAccount(null)

              setShowAddForm(true)
            }}
          >
            + إضافة حساب
          </button>

        </section>


        {/* ========================= */}
        {/* ADD FORM */}
        {/* ========================= */}

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
              onSubmit={
                handleAddAccount
              }
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


        {/* ========================= */}
        {/* EDIT FORM */}
        {/* ========================= */}

        {editingAccount && (

          <div className="admin-form-card">

            <div className="admin-form-header">

              <div>

                <h3>
                  تعديل الحساب
                </h3>

                <p>
                  عدّلي بيانات حساب منصة نور
                </p>

              </div>


              <button
                type="button"
                className="admin-close-button"
                onClick={() =>
                  setEditingAccount(null)
                }
              >
                ×
              </button>

            </div>


            <form
              className="admin-account-form"
              onSubmit={
                handleUpdateAccount
              }
            >

              <label>
                نوع المستخدم
              </label>


              <select
                value={editUserType}
                onChange={(e) =>
                  setEditUserType(
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
                value={editCivilId}
                onChange={(e) =>
                  setEditCivilId(
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
                value={editPassword}
                onChange={(e) =>
                  setEditPassword(
                    e.target.value
                  )
                }
              />


              {editError && (

                <div className="admin-error">
                  {editError}
                </div>

              )}


              <div className="admin-form-buttons">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() =>
                    setEditingAccount(null)
                  }
                >
                  إلغاء
                </button>


                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={updating}
                >
                  {updating
                    ? "جاري الحفظ..."
                    : "حفظ التعديلات"}
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ========================= */}
        {/* FILTERS */}
        {/* ========================= */}

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


        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (

          <div className="admin-error">
            {error}
          </div>

        )}


        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}

        <section className="admin-table-card">

          <table>

            <thead>

              <tr>

                <th>
                  الرقم المدني
                </th>

                <th>
                  نوع المستخدم
                </th>

                <th>
                  كلمة المرور
                </th>

                <th>
                  الإجراءات
                </th>

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
                          onClick={() => {

                            setShowAddForm(false)

                            openEditForm(
                              account
                            )
                          }}
                        >
                          تعديل
                        </button>


                        {" "}


                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAccount(
                              account
                            )
                          }
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