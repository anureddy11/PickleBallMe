import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchEventById } from '../../src/store/events';
import DeleteEventModal from "../../Componenets/DeleteEventModal/DeleteEventModal"
import OpenModalButton from '../../Componenets/OpenModalButton/OpenModalButton'
import { CiMapPin } from "react-icons/ci";
import { FaMoneyBillWave } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";





const EventDetailsPage = () => {
    const dispatch = useDispatch();
    const currEvent = useSelector((state) => state.events.currEvent);
    const currGroup = useSelector((state) => state.groups.currGroup);
    const hostFirstName = useSelector((state) =>state.groups.currGroup.Organizer.firstName)
    const hostLastName = useSelector((state) =>state.groups.currGroup.Organizer.lastName)
    const sessionUser = useSelector((state) => state.session)
    const { eventId } = useParams();



    // Check if sessionUser is not null before accessing its properties
    let organizerLoggedIn = sessionUser && sessionUser.user && sessionUser.user.id === currGroup.organizerId;

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchEventById(eventId)).then(() => setIsLoaded(true));
    }, [dispatch, eventId]);

    const handleUpdateEventClick = () => {
        alert('Feature coming soon');
    };

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
                    <span><FaClock /> Start Time: {currEvent.startDate.split(',')[1]}</span><br />
                    <span><FaClock /> End Date: {currEvent.endDate.split(',')[0]}</span><br />
                    <span>End Time: {currEvent.endDate.split(',')[1]}</span><br />
                    <span>Host Name: {currEvent.hostName}</span><br />
                    <span>Image: <img src={currEvent.previewImage} alt="event" /></span><br />
                    <span><FaMoneyBillWave />Event Price: {currEvent.price===0 ? 'Free' : currEvent.price}</span><br />
                    <span><CiMapPin />Event Info: {currEvent.about}</span><br />
                    <span>Event Location: {currEvent.Group.city}, {currEvent.Group.state}</span><br />
                    <span>Group Info: {currEvent.Group.about}</span><br />
                    <span>Hosted By: {hostFirstName} {hostLastName}</span><br /><br />

                     {organizerLoggedIn && (
                        <div>
                            <button
                                style={{ backgroundColor: 'darkgrey', color: 'white', marginRight: '10px' }}
                                onClick={handleUpdateEventClick}
                            >
                                Update
                            </button>
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteEventModal groupId={eventId} />}
                            />
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div>Loading...</div>
        )
    );
};

export default EventDetailsPage;
