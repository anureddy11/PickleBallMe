import { csrfFetch } from './csrf';


const LOAD_GROUPS = "groups/LOAD_GROUPS";
const LOAD_GROUP_BY_ID = "groups/LOAD_GROUP_BY_ID"


export const getGroups = (groupsArray) => {
    return {
        type: LOAD_GROUPS,
        groupsArray
    };
};

export const getGroupByid = (group) => {
    return {
        type:LOAD_GROUP_BY_ID,
        group
    }
}


// Fetch request thunk for getting all groups
export const fetchAllGroups = () => async (dispatch) => {
    const res = await csrfFetch('/api/groups', {
        method: 'GET'
    });

    const data = await res.json();
    dispatch(getGroups(data.Groups));


    // return res;
    // console.log(data.Groups)
};

//Fetch a group by groupId

export const fetchGroupById = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'GET'
    });

    const data = await res.json();
    // console.log(data)
    dispatch(getGroupByid(data));
};




const initialState = { groupsList: {}, currGroup : {} };

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const newGroups = {};
            action.groupsArray.forEach(group => {
                newGroups[group.id] = group;
            });
            return {
                groupsList:newGroups,
                currGroup :{}
            };
        case LOAD_GROUP_BY_ID:
            return {
                    ...state,
                    currGroup: action.group
            };
            
        default:
            return state;
    }
};

export default groupsReducer;
