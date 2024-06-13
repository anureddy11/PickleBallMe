import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchEventById } from '../../src/store/events';
import DeleteEventModal from "../../Componenets/DeleteEventModal/DeleteEventModal"
import OpenModalButton from '../../Componenets/OpenModalButton/OpenModalButton'
import { CiMapPin } from "react-icons/ci";
import { FaMoneyBillWave } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import './EventDetailsPage.css'





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
                    <div className="main-card">
                            <div>
                                <span>Image: <img src={currEvent.previewImage} alt="event" /></span><br />
                            </div><br />
                            <div className="details-card">
                                <div className="details-card-group">
                                    <span>Group Name: {currEvent.Group.name}</span><br />
                                    <span>Group Image: {currEvent.Group.image}</span><br />
                                    <span>{currEvent.Group.type ? 'Private' : 'Public'}</span><br />

                                </div><br />
                                <div className="details-card-event">
                                        <span>Event Name: {currEvent.name}</span><br />
                                        <span>Start Date: {currEvent.startDate.split(',')[0]}</span>
                                        <span><FaClock /> Start Time: {currEvent.startDate.split(',')[1]}</span><br />
                                        <span>End Time: {currEvent.endDate.split(',')[1]}</span>
                                        <span><FaClock /> End Date: {currEvent.endDate.split(',')[0]}</span><br />
                                        <span>Host Name: {currEvent.hostName}</span><br />
                                        <span><FaMoneyBillWave />Event Price: {currEvent.price===0 ? 'Free' : currEvent.price}</span><br />
                                        <span>Event Info: {currEvent.about}</span><br />
                                        <span><CiMapPin />Event Location: {currEvent.Group.city}, {currEvent.Group.state}</span><br />
                                        <span>Group Info: {currEvent.Group.about}</span><br />
                                        <span>Hosted By: {hostFirstName} {hostLastName}</span><br /><br />
                                </div>
                            </div>
                    </div>
                    <div className="description-card">
                        Detials <br />
                        <span>Group Info: {currEvent.Group.about}</span><br />
                    </div>

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
                                modalComponent={<DeleteEventModal eventId={eventId} />}
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
