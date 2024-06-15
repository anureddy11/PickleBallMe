import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import './Navigation.css';
import SignUpFormModal from '../SignUpFormModal/SignUpFormModal';
import UserMenu from './UserMenu';
import logo from '../../../Images/logopb.jpeg'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    const sessionLinks = sessionUser ? (
        <div className="nav-item">
            <ProfileButton user={sessionUser} />
            <UserMenu user={sessionUser} />
            <NavLink to='/groups/createGroup'>Start a new Group</NavLink>
        </div>
    ) : (
        <>
            <div className="nav-item">
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
            </div>
            <div className="nav-item">
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignUpFormModal />}
                />
            </div>
        </>
    );

    return (
        <nav className='navbar'>
            <div className='nav-brand'>
                <NavLink to="/">
                  <img src ={logo} />
                </NavLink>
            </div>
            <div className='nav-links'>
                {isLoaded && sessionLinks}
            </div>
        </nav>
    );
}

export default Navigation;
