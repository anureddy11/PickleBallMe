import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import * as sessionActions from '../../src/store/session';
import './UserMenu.css';
import { NavLink } from 'react-router-dom';

function UserMenu({ user }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        setIsOpen(false);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <nav className="user-menu" ref={dropdownRef}>
            <button onClick={handleClick} className="dropdown-toggle">
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOpen && (
                <div className="dropdown-content" onClick={handleContentClick}>
                    <p className="menu-item">Hello, {user.firstName}</p>
                    <p className="menu-item">Email: {user.email}</p>
                    <button onClick={logout} className="menu-item">Log Out</button>
                    <div className="profile-details">
                        <p className="profile-item">Username: {user.username}</p>
                        <p className="profile-item">Name: {user.firstName} {user.lastName}</p>
                        <p className="profile-item">Email: {user.email}</p>
                    </div>
                    <NavLink to="/groups" className="menu-link">View All Groups</NavLink>
                    <NavLink to="/events" className="menu-link">View All Events</NavLink>
                </div>
            )}
        </nav>
    );
}

export default UserMenu;

