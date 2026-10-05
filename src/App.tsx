import { useState } from "react"

import "./App.css"

import UserTypeSelector
  from "./components/userTypeSelector"

import LoginForm
  from "./components/loginForm"

import PasswordResult
  from "./components/passwordResult"

import {
  getNoorPassword,
} from "./services/api"

import type {
  UserType,
} from "./types/user"


function App() {

  const [userType, setUserType] =
    useState<UserType>("teacher")

  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")

  const [loading, setLoading] =
    useState(false)


  async function handleSubmit(
    civilId: string
  ) {

    setLoading(true)
    setError("")

    const response =
      await getNoorPassword({
        userType,
        civilId,
      })

    setLoading(false)

    if (!response.success) {

      setError(
        response.message ||
        "لم يتم العثور على الحساب."
      )

      return
    }

    setPassword(
      response.password || ""
    )
  }


  function handleUserTypeChange(
    type: UserType
  ) {

    setUserType(type)

    setError("")
    setPassword("")
  }


  function handleBack() {
    setPassword("")
    setError("")
  }


  return (
    <main
      className="school-page"
      dir="rtl"
    >

      <div className="school-card">

        <header className="school-header">

          <div className="school-logo">
            ش
          </div>

          <h1>
            مدرسة شمساء الخليلي
          </h1>

          <p>
          ٥-١٠ لتعليم الأساسي 
          </p>

        </header>


        {!password ? (
          <>

            <div className="welcome-text">

              <h2>
                 للإستعلام الفوري لكلمة المرور لمستخدمي منصة نور
              </h2>

              <p>
                اختر نوع المستخدم ثم
                أدخل بياناتك لعرض كلمة المرور.
              </p>

            </div>


            <UserTypeSelector
              selected={userType}
              onChange={
                handleUserTypeChange
              }
            />


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            <LoginForm
              key={userType}
              loading={loading}
              onSubmit={handleSubmit}
            />

          </>
        ) : (

          <PasswordResult
            password={password}
            onBack={handleBack}
          />

        )}

      </div>

    </main>
  )
}

export default App