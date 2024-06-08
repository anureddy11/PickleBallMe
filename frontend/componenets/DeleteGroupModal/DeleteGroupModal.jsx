import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteGroup } from '../../src/store/groups';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const DeleteEventModal = ({ groupId, onClose }) => {
    const dispatch = useDispatch();
    // const navigate = useNavigate()

    const handleDelete = (e) => {
        e.preventDefault();
        let res =  dispatch(deleteGroup(groupId))

        // if(res){
        //     navigate('/groups')
        // }
    };

    return (
        <div>
            <h2>Are you sure you want to delete this group?</h2>
            <button onClick={handleDelete}>Yes (Delete group)</button>
            <button onClick={onClose}>No (Keep group)</button>
        </div>
    );
};

export default DeleteEventModal;
