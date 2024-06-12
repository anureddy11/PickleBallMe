import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchEventsByGroupId } from "../../src/store/events";


const EventsByGroupPage =() =>{

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const events = useSelector((state) => Object.values(state.events.eventsByGroupId));

    const upcomingEvents = [];
    const pastDueEvents = [];
    const now = new Date();

    events.forEach(event => {
        const eventStartDate = new Date(event.startDate); // Ensure event.startDate is a valid date
        if (eventStartDate > now) {
            upcomingEvents.push(event);
        } else {
            pastDueEvents.push(event);
        }
    });

    useEffect (() =>{
        dispatch(fetchEventsByGroupId(groupId))
    },[dispatch,groupId])

  return(
        <div>

            {upcomingEvents.length > 0 || pastDueEvents.length > 0 ? (
                <>
                        <div>
                                    <h2>Upcoming Events: {upcomingEvents.length}</h2>
                                    {upcomingEvents.map(event => (
                                        <div key={event.id}>
                                            <NavLink to={`/events/${event.id}`}>
                                                <img src={event.previewImages} alt="Preview" /> <br />
                                                <span>{event.startDate}</span> <br />
                                                <span>{event.name}</span> <br />
                                                <span>Location: {event.city}, {event.state}</span> <br />
                                            </NavLink>
                                        </div>
                                    ))}
                        </div>

                        <div>
                                <h2>Past Due Events: {pastDueEvents.length}</h2>
                                {pastDueEvents.map(event => (
                                    <div key={event.id}>
                                        <NavLink to={`/events/${event.id}`}>
                                            <img src={event.previewImages} alt="Preview" /> <br />
                                            <span>{event.startDate}</span> <br />
                                            <span>{event.name}</span> <br />
                                            <span>Location: {event.city}, {event.state}</span> <br />
                                        </NavLink><br />
                                    </div>
                                ))}
                        </div>
                </>
                ): (
                <p>No Upcoming Events</p>
            )
            }


        </div>
    )



}

export default EventsByGroupPage
