import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { fetchAllGroups } from '../../src/store/groups';
import GroupsEventsLandingPage from "../../componenets/Navigation/Groups-Events-LandingPage";
import './GroupsPage'

const Groups = () => {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => state.groups);
    console.log(allGroups)

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch]);

    return (
        <div>
            <div>
                <GroupsEventsLandingPage />
            </div>
            {allGroups && Object.keys(allGroups).length > 0 ? (

                <div>
                    <h1>Groups in Meetup</h1>
                    <ul className="group-list">
                        {Object.values(allGroups).map((group) => (
                       <NavLink to={`/groups/${group.id}`} key={group.id} className="group-link">
                            <li key={group.id} className="group-item" >
                            <div className="group-item">
                                <span className="group-item">Group Name: {group.name},</span><br />
                                <span>About: {group.about}</span><br />
                                <span>Group Location: {group.city},{group.state},</span><br />
                                <span>Group Image: {group.previewImage},</span><br />
                                <span>Group Type: {group.type},</span><br />
                                <span>{group.numEvents}  </span>
                                <label>events</label>
                                <span className="dot"> · </span>
                                <span>Group Private: {group.private ? 'Private' : 'Public'}</span>
                            </div>
                            </li>
                            </NavLink>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No groups available.</p>
            )}
        </div>
    );

};

export default Groups;
