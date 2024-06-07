import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignUpFormModal/SignUpFormModal';
import UserMenu from './UserMenu';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
      <li>
        <ProfileButton user={sessionUser} />
        <UserMenu user={sessionUser} />
        <NavLink to ='/groups/createGroup'>Start a new Group</NavLink>
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
            </ul>

            <div >
                {isLoaded && sessionLinks}
             </div>

        </nav>
    );
  }

  export default Navigation;
