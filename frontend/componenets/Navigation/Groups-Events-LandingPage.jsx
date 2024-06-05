import { NavLink } from 'react-router-dom';


function GroupsEventsLandingPage() {


    return(
            <div>
                <div>
                    <NavLink to = '/groups'>Groups</NavLink>
                </div>
                <div>
                    <NavLink to = '/events'>Events</NavLink>
                </div>
            </div>
    )
}

export default GroupsEventsLandingPage
