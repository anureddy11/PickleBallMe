import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteGroup } from '../../src/store/groups';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { deleteEvent } from '../../src/store/events';

const DeleteEventModal = ({ groupId, onClose }) => {
    const dispatch = useDispatch();
    // const navigate = useNavigate()

    const handleDelete = (e) => {
        e.preventDefault();
        let res =  dispatch(deleteEvent(groupId))

        // if(res){
        //     navigate('/groups')
        // }
    };

    return (
        <div>
            <h2>Are you sure you want to delete this event?</h2>
            <button onClick={handleDelete}>Yes (Delete event)</button>
            <button onClick={onClose}>No (Keep event)</button>
        </div>
    );
};

export default DeleteEventModal;
