import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignUpFormModal/SignUpFormModal';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    ) : (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          {/* <NavLink to="/signup">Sign Up</NavLink> */}
          <OpenModalButton
            buttonText= "Sign Up"
            modalComponent={<SignUpFormModal />}
            />
        </li>
      </>
    );

    return (
       <nav className='navbar'>
            <ul >
                <li >
                <NavLink to="/">Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
        </nav>
    );
  }

  export default Navigation;
