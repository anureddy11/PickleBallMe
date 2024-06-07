import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchGroupById } from '../../src/store/groups';
import { fetchEventById } from '../../src/store/events';
import EventsByGroupPage from "../EventsByGroupPage";

const EventDetailsPage = () => {
    const dispatch = useDispatch();
    const currEvent = useSelector((state) => state.events.currEvent);
    const { eventId } = useParams();

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchEventById(eventId)).then(() => setIsLoaded(true));
    }, [dispatch, eventId]);

    return (
        isLoaded && currEvent ? (
            <div>
                <div>
                    <NavLink to='/events'>Events</NavLink>
                </div>
                <br />
                {/* eventName, hostName,image,event Info box, groupInfoBox */}
                <div>
                    <span>Event Name: {currEvent.name}</span><br />
                    <span>Group Name: {currEvent.Group.name}</span><br />
                    <span>Group is private? : {currEvent.Group.type ? 'true' : 'false'}</span><br />
                    <span>Group Image: {currEvent.Group.image}</span><br />
                    <span>Start Date: {currEvent.startDate.split(',')[0]}</span><br />
                    <span>Start Time: {currEvent.startDate.split(',')[1]}</span><br />
                    <span>End Date: {currEvent.endDate.split(',')[0]}</span><br />
                    <span>End Time: {currEvent.endDate.split(',')[1]}</span><br />
                    <span>Host Name: {currEvent.hostName}</span><br />
                    <span>Image: <img src={currEvent.previewImage} alt="event" /></span><br />
                    <span>Event Price: {currEvent.price===0 ? 'Free' : currEvent.price}</span><br />
                    <span>Event Info: {currEvent.about}</span><br />
                    <span>Event Location: {currEvent.Venue.city}, {currEvent.Venue.state}</span><br />
                    <span>Group Info: {currEvent.Group.about}</span><br />
                </div>
            </div>
        ) : (
            <div>Loading...</div>
        )
    );
};

export default EventDetailsPage;
