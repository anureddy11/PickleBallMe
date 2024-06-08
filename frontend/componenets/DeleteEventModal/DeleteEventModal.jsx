import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteGroup } from '../../src/store/groups';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { deleteEvent } from '../../src/store/events';
import { useModal } from '../../src/Context/Modal';

const DeleteEventModal = ({ eventId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        let res =  dispatch(deleteEvent(eventId))

        if(res){
            closeModal();
            navigate('/events')
        }
    };

    const handleStay = (e) =>{
        e.preventDefault()
        closeModal();
        navigate(`/events/${eventId}`)


    }

    return (
        <div>
            <h2>Are you sure you want to delete this event?</h2>
            <button onClick={handleDelete}>Yes (Delete event)</button>
            <button onClick={handleStay}>No (Keep event)</button>
        </div>
    );
};

export default DeleteEventModal;
