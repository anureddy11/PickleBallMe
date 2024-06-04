import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchGroupById } from '../../src/store/groups';
import EventsByGroupPage from "../EventsByGroupPage";

const GroupDetailPage = () => {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => state.groups.groups);
    const currGroup = useSelector((state) => state.groups.currGroup);
    const { groupId } = useParams();

    const [isLoaded, setIsLoaded] = useState(false);

   const eventsArray = currGroup.Events



    useEffect(() => {
        dispatch(fetchGroupById(groupId)).then(()=>setIsLoaded(true));
    }, [dispatch, groupId]);

    return  isLoaded && currGroup ? (
        <div>
            <h1>{currGroup.name}</h1>
            <div>
                <NavLink to = '/groups'>Groups</NavLink>
            </div>
            <div className="group-item">
                <span>{currGroup.city}, {currGroup.state}</span><br />
                {/* <span>Group Image: {currGroup[groupId].previewImage}</span><br /> */}
                {/* <span>Group Type: {currGroup[groupId].type}</span><br /> */}
                <span>{currGroup.Events.length} </span>
                <label>events</label>
                <span className="dot"> · </span>
                <span> {currGroup.private ? 'Private' : 'Public'}</span><br />
                <span>Organized By:  </span>
                <span>{currGroup.Organizer.firstName} </span>
                <span>{currGroup.Organizer.lastName}</span><br/>
                <span>{currGroup.about}</span><br/>
            </div>
            <div>
                <EventsByGroupPage />
            </div>
        </div>
    ) : (
        <h1>Is loading</h1>
    );
}

export default GroupDetailPage;
