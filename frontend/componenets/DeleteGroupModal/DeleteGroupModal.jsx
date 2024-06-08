import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteGroup } from '../../src/store/groups';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useModal } from '../../src/Context/Modal';

const DeleteEventModal = ({ groupId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        let res =  dispatch(deleteGroup(groupId))

        if(res){
            closeModal();
            navigate('/groups')
        }
    };

    const handleStay = (e) =>{
        e.preventDefault()
        closeModal();
        navigate(`/groups/${groupId}`).then(setOnModalClose)


    }

    return (
        <div>
            <h2>Are you sure you want to delete this group?</h2>
            <button onClick={handleDelete}>Yes (Delete group)</button>
            <button onClick={handleStay}>No (Keep group)</button>
        </div>
    );
};

export default DeleteEventModal;
