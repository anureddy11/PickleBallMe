import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchGroupById } from '../../src/store/groups';
import {fetchEventById} from '../../src/store/events'
import EventsByGroupPage from "../EventsByGroupPage";

const EventDetailsPage = () => {
    const dispatch = useDispatch();
    const currEvent = useSelector((state) =>state.events.currEvent)
    const { eventId } = useParams();


    useEffect(() => {
        dispatch(fetchEventById(eventId));
    }, [dispatch, eventId]);

    return(
        <div>
            Event Details
            <div>
                <NavLink to = '/events'>Events</NavLink>
            </div>
            {/* eventName, hostName,image,event Info box, groupInfoBox */}
            <div>

            </div>
        </div>

    )



}

export default EventDetailsPage
