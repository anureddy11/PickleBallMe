import { useState,useEffect } from 'react';
import { useDispatch} from 'react-redux';
import * as sessionActions from '../../src/store/session'

function SignUpFormModal() {

  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      closeModal()
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      ).catch(async (res) => {
        const data = await res.json();
        console.log(Object.values(data.errors))
        if (data?.errors) {
          Object.values(data.errors).forEach(error => {
            alert(error);
            // Handle each error as needed
          });
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  useEffect(() => {
    const newErrors ={ email:'', username:'', firstName:'', lastName:'', password:'', confirmPassword:''}

    // Check for empty fields
    const fields = { email, username, firstName, lastName, password, confirmPassword };
    for (const [key, value] of Object.entries(fields)) {
        if (value.length < 1) {
            newErrors[key] = `${key} cannot be empty`;
        }
    }

    // Additional validations only if the fields are not empty
    if (email.length >= 1 && username.length >= 1 && firstName.length >= 1 && lastName.length >= 1 && password.length >= 1 && confirmPassword.length >= 1) {
        if (username.length < 4) {
            newErrors.username = "Username must be 4 or more characters";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be 6 or more characters";
        }
    }

    setErrors(newErrors)

  },[email,username,firstName,lastName,password,confirmPassword])

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button
        type="submit"
        disabled = {errors.username || errors.firstName || errors.lastName || errors.password || errors.email || errors.confirmPassword}
        >Sign Up</button>
      </form>
    </>
  );
}


export default SignUpFormModal
