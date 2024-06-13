import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink} from "react-router-dom";
import { fetchAllGroups } from '../../src/store/groups';
import GroupsEventsLandingPage from "../../Componenets/Navigation/Groups-Events-LandingPage";
import './GroupsPage.css'

const Groups = () => {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => state.groups.groupsList);
    // console.log(allGroups)

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
                            <div key={group.id}>
                                <NavLink to={`/groups/${group.id}`} className="group-link">
                                    <div className="group-item">
                                        <div className="groupImage">
                                            <span>Group Image: {group.previewImage},</span><br />
                                        </div>
                                        <div className="groupDetails">
                                            <span className="group-item">Group Name: {group.name},</span><br />
                                            <span>About: {group.about}</span><br />
                                            <span>Group Location: {group.city},{group.state},</span><br />
                                            <span>Group Type: {group.type},</span><br />
                                            <span>{group.numEvents}  </span>
                                            <label>events</label>
                                            <span className="dot"> · </span>
                                            <span>Group Private: {group.private ? 'Private' : 'Public'}</span>
                                        </div>
                                    </div>
                                </NavLink>
                                <hr /> {/* Added horizontal line */}
                            </div>
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
