import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchEventsByGroupId } from "../../src/store/events";


const EventsByGroupPage =() =>{

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const events = useSelector((state) => Object.values(state.events.eventsByGroupId));

    const upcomingEvents =[]
    const pastEvents = []
    const now = new Date()

    events.forEach(event => {
        if(event.endDate>=now) upcomingEvents.push(event)
        else pastEvents.push(event)

    });

    // console.log(events.previewImages)
    // console.log(upcomingEvents)
    // console.log(pastEvents)


    // const [isLoaded, setIsLoaded] = useState(false);

    useEffect (() =>{
        dispatch(fetchEventsByGroupId(groupId))
    },[dispatch,groupId])

    return(
        <div>

                    <div>
                                <h2>Upcoming Events: {upcomingEvents.length}</h2>
                                {upcomingEvents.map(event => (
                                    <div key={event.id}>
                                        <NavLink to={`/events/${event.id}`}>
                                            <img src={event.previewImages} alt="Preview" /> <br />
                                            <span>{event.startDate}</span> <br />
                                            <span>{event.name}</span> <br />
                                            <span>Location: {event.Venue.city}, {event.Venue.state}</span> <br />
                                        </NavLink>
                                    </div>
                                ))}
                    </div>

                    <div>
                            <h2>Past Due Events: {pastEvents.length}</h2>
                            {pastEvents.map(event => (
                                <div key={event.id}>
                                    <NavLink to={`/events/${event.id}`}>
                                        <img src={event.previewImages} alt="Preview" /> <br />
                                        <span>{event.startDate}</span> <br />
                                        <span>{event.name}</span> <br />
                                        <span>Location: {event.Venue.city}, {event.Venue.state}</span> <br />
                                    </NavLink><br />
                                </div>
                            ))}
                    </div>



        </div>
    )



}

export default EventsByGroupPage
