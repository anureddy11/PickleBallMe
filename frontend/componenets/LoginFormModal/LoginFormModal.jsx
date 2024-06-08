// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useEffect, useState } from 'react';
import * as sessionActions from '../../src/store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../src/Context/Modal';


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  //form validation for username>=4 and password>=6
  const [errors, setErrors] = useState({
    credential:'',
    password: ''
  });

  useEffect(()=>{

    const newErrors ={credential:'',password:''}
    if(credential.length<4){
      newErrors.credential = "Credential must be 4 or more charectors"
    }else if(password.length<6){
      newErrors.password = "Password must be 6 or more charectors"
    }

    setErrors(newErrors)

  },[credential,password])

  // console.log(errors)



  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = (e) =>{
    e.preventDefault();
    closeModal()
    dispatch(sessionActions.login({credential:"Demo-lition", password:"password"}))

  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button
        type="submit"
        disabled = {errors.credential || errors.password}
        >

          Log In</button>

        <button onClick={handleDemoLogin}>Log in as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
