import type {
  UserType,
} from "../types/user"

type Props = {
  selected: UserType
  onChange: (type: UserType) => void
}

function UserTypeSelector({
  selected,
  onChange,
}: Props) {

  return (
    <div className="user-type-selector">

      {/* Teacher */}
      <button
        type="button"
        className={
          selected === "teacher"
            ? "user-type active"
            : "user-type"
        }
        onClick={() =>
          onChange("teacher")
        }
      >
        <span className="user-icon">
          👩‍🏫
        </span>

        <strong>معلمة</strong>

        <small>
          الدخول بالرقم المدني
        </small>
      </button>


      {/* Parent */}
      <button
        type="button"
        className={
          selected === "parent"
            ? "user-type active"
            : "user-type"
        }
        onClick={() =>
          onChange("parent")
        }
      >
        <span className="user-icon">
          👨‍👩‍👧
        </span>

        <strong>ولي أمر</strong>

        <small>
          الدخول بالرقم المدني
        </small>
      </button>


      {/* Student */}
      <button
        type="button"
        className={
          selected === "student"
            ? "user-type active"
            : "user-type"
        }
        onClick={() =>
          onChange("student")
        }
      >
        <span className="user-icon">
          👩‍🎓
        </span>

        <strong>طالبة</strong>

        <small>
          الدخول بالرقم المدني
        </small>
      </button>

    </div>
  )
}

export default UserTypeSelector