import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import * as sessionActions from '../../src/store/session';
import './UserMenu.css';

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
    };

    const handleClick = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="dropdown-menu" ref={dropdownRef}>
            <button onClick={handleClick} className="dropdown-toggle">
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOpen && (
                <div className="dropdown-content" onClick={handleContentClick}>
                    <span>Hello, {user.firstName}</span>
                    <span>Email: {user.email}</span>
                    <button onClick={logout}>Log Out</button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
