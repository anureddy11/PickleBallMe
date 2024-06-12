import {  useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchAllEvents } from "../../src/store/events";
import GroupsEventsLandingPage from "../../Componenets/Navigation/Groups-Events-LandingPage";

import './EventsPage'




const EventsPage = () =>{
    const dispatch = useDispatch();

   // Convert the events list object to an array
   const allEventsObject = useSelector((state) => state.events.eventsList);
   const allEvents = Object.values(allEventsObject);
    // console.log(allEvents)

    useEffect(() => {
        dispatch(fetchAllEvents(allEventsObject));
    }, [dispatch, allEventsObject]);

    //separating events into upcoming and past due
    const upcomingEvents =[]
    const pastDueEvents = []
    const now = new Date()
    allEvents.forEach(event =>{
        if(event.start-now > 0) upcomingEvents.push(event)
        else pastDueEvents.push(event)
    })

    // console.log(upcomingEvents)
    // console.log(pastDueEvents)

    //sorted lists
    const sortedUpcomingEvents = upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    const sortedPastDueEvents = pastDueEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    // console.log(sortedPastDueEvents)

    return(
      <div>
            <div>
                <GroupsEventsLandingPage />
            </div>
            <h2>Events in Meetup: {allEvents.length}</h2>

            <div>Upcoming Events :</div>
            <ul>

                    {sortedUpcomingEvents.map(event => (
                         <NavLink key={event.id} to={`/events/${event.id}`}>
                        <li key={event.id}>
                            <div>
                                <span>Image: {event.preview} </span><br/>
                                <span>Titele: {event.name} </span><br/>
                                <span>Start Date: {event.startDate}</span><br/>
                                <span>Location : {event.city},{event.state} </span>
                                <span>Description: Event API did not call for one</span><br/>

                            </div><br/>
                        </li>
                        </NavLink>
                    ))}
                </ul>

            <div>Past Due Events :</div>
                <ul>
                    {sortedPastDueEvents.map(event => (
                        <NavLink key={event.id} to={`/events/${event.id}`}>
                        <li key={event.id}>
                            <div>
                                <span>Image: {event.preview} </span><br/>
                                <span>Titele: {event.name} </span><br/>
                                <span>Start Date: {event.startDate}</span><br/>
                                <span>Location : {event.city},{event.state} </span>
                                <span>Description: Event API did not call for one</span><br/>

                            </div><br/>
                        </li>
                         </NavLink>
                    ))}
                </ul>


      </div>
    )

}

export default EventsPage
