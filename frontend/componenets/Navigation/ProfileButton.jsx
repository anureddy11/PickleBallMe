// frontend/src/components/Navigation/ProfileButton.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../src/store/session';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false)

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  //toggle function for user drop down

  const toggleUser = () =>{
    setIsOpen(!isOpen)
  }

  return (
    <div className="profile-button-container">
        <button className="profile-button" onClick={toggleUser}>
            <FaUserCircle />
        </button>
        {isOpen && (
            <ul className="profile-dropdown">
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            </ul>
        )}
        {/* <div className="logout-button">
            <button onClick={logout}>Log Out</button>
        </div> */}

    </div>
  );
}

export default ProfileButton;
