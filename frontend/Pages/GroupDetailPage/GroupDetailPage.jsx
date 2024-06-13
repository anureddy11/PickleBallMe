import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { fetchGroupById } from '../../src/store/groups';
import EventsByGroupPage from "../EventsByGroupPage";
import { useNavigate } from "react-router-dom";
import OpenModalButton from '../../Componenets/OpenModalButton/OpenModalButton'
import DeleteGroupModal from "../../Componenets/DeleteGroupModal/DeleteGroupModal";
import './GroupsDetailPage.css'


const GroupDetailPage = () => {
    const dispatch = useDispatch();
    // const allGroups = useSelector((state) => state.groups.groups);
    const sessionUser = useSelector((state) => state.session.user);
    const currGroup = useSelector((state) => state.groups.currGroup);
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [isLoaded, setIsLoaded] = useState(false);


    // functionality for join this group button
    const isUserLoggedIn = !!sessionUser;
    const isUserGroupCreator = isUserLoggedIn && sessionUser.id === currGroup.organizerId;
    const buttonStyle = isUserGroupCreator ? {} : { backgroundColor: 'red', color: 'white' };
    const handleJoinThisGroupButtonClick = () =>{
        alert('Feature coming soon');
    }

    //buttons if the sessionUser is the Organizer
    const handleCreateEventClick = () => {
        navigate(`/events/createEvent`)
    };

    const handleUpdateGroupClick = () => {
      navigate(`/groups/${groupId}/update`)

    };

    // const handleDeleteGroupClick = () => {
    //     setModalContent(<DeleteGroupModal onClose={() => setIsLoaded(false)} groupId={groupId} />);
    // };



    useEffect(() => {
        dispatch(fetchGroupById(groupId)).then(()=>setIsLoaded(true));
    }, [dispatch, groupId]);

    return  isLoaded && currGroup ? (
        <div>
            <h1>{currGroup.name}</h1><br />
            <div>
                <NavLink to = '/groups'>Groups</NavLink>
            </div>
            <div className="group-item-1">
                <div>
                    <span>Image:     {currGroup.GroupImages[0]} </span><br/>
                </div>
                <div>
                    <span>Location: {currGroup.city}, {currGroup.state}</span><br />
                    <span>{currGroup.Events.length} </span>
                    <label>events</label>
                    <span className="dot"> · </span>
                    <span> {currGroup.private ? 'Private' : 'Public'}</span><br />
                    <span>Organized By:  </span>
                    <span>{currGroup.Organizer.firstName} </span>
                    <span>{currGroup.Organizer.lastName}</span><br/>
                    <div>{(!isUserLoggedIn || isUserGroupCreator)? null :(
                    <button
                        style={buttonStyle}
                        onClick={handleJoinThisGroupButtonClick}>
                        Join this group
                    </button>
                )}
            </div>
                </div>


            </div><br/>

            <div className="group-item-detail-section">
                <div>
                    <span>Organizer: </span>
                    <span>{currGroup.Organizer.firstName} </span>
                    <span>{currGroup.Organizer.lastName}</span><br/>
                </div><br/>
                <div>
                        <span>What we are About</span><br/>
                        <span>{currGroup.about}</span>
                </div>
            </div>

            <div className="event-item">
                <EventsByGroupPage />
            </div>


            {isUserGroupCreator && (
                <div>
                    <button
                        style={{ backgroundColor: 'darkgrey', color: 'white', marginRight: '10px' }}
                        onClick={handleCreateEventClick}
                    >
                        Create event
                    </button>
                    <button
                        style={{ backgroundColor: 'darkgrey', color: 'white', marginRight: '10px' }}
                        onClick={handleUpdateGroupClick}
                    >
                        Update
                    </button>
                    {/* <button
                        style={{ backgroundColor: 'darkgrey', color: 'white' }}
                        onClick={handleDeleteGroupClick}
                    >
                        Delete
                    </button> */}
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteGroupModal
                                        groupId={groupId} />}

                    />
                </div>
            )}

        </div>
    ) : (
        <h1>Is loading</h1>
    );
}

export default GroupDetailPage;
