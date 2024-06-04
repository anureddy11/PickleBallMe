import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupById } from '../../src/store/groups';

const GroupDetailPage = () => {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => state.groups.groups);
    const currGroup = useSelector((state) => state.groups.currGroup);
    const { groupId } = useParams();

    const [isLoaded, setIsLoaded] = useState(false);

    console.log(currGroup)



    useEffect(() => {
        dispatch(fetchGroupById(groupId)).then(()=>setIsLoaded(true));
    }, [dispatch, groupId]);

    return  isLoaded && currGroup ? (
        <div>
            <h1>{currGroup.name}</h1>
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
                <span>{currGroup.Organizer.lastName}</span>
            </div>
        </div>
    ) : (
        <h1>Is loading</h1>
    );
}

export default GroupDetailPage;
