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
            <div>Upcoming Events: {upcomingEvents.length}
                {upcomingEvents.map(event =>{
                    return(
                        <div>
                            <ul>
                            <span>PreviewImage: {event.previewImages}</span><br />
                            <span>{event.startDate}</span><br />
                            <span>{event.name}</span><br />
                            <span>Location: {event.Venue.city}, {event.Venue.state} </span><br />
                            </ul>

                        </div>
                    )
                })}
            </div><br />



            <div>Past Events: {pastEvents.length}
            {pastEvents.map(event =>{
                    return(
                        <div>
                            <ul>
                            <span>PreviewImage: {event.previewImages}</span><br />
                            <span>{event.startDate}</span><br />
                            <span>{event.name}</span><br />
                            <span>Location: {event.Venue.city}, {event.Venue.state} </span><br />
                            </ul>

                        </div>
                    )
                })}
            </div>

        </div>
    )



}

export default EventsByGroupPage
