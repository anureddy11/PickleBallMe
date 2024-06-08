import { csrfFetch } from './csrf';


const LOAD_GROUPS = "groups/LOAD_GROUPS";
const LOAD_GROUP_BY_ID = "groups/LOAD_GROUP_BY_ID"
const ADD_ONE = '/groups/ADD_ONE'
const REMOVE_ONE = '/groups/REMOVE_ONE'
const UPDATE_GROUP = 'groups/UPDATE_GROUP'


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

export const addGroup =(group) =>{
    return {
        type: ADD_ONE,
        group
    }
}

export const removeGroup =(groupId) =>{
    return {
        type: REMOVE_ONE,
        groupId
    }
}

export const changeGroup =(group) =>{
    return {
        type: UPDATE_GROUP,
        group
    }
}

//Delete a group thunk

export const deleteGroup =(groupId) => async (dispatch) =>{
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })

    const data = await res.json()
    dispatch(removeGroup(groupId))

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

//create a group thunk

export const createGroup = (payload, groupId) => async (dispatch) => {
    console.log(JSON.stringify(payload))

    const res = await csrfFetch (`/api/groups/${groupId}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(addGroup(payload))
        return data;
    } else {
        throw Error(res);
    }
}

//update a group thunk

export const updateGroup = (payload,groupId) => async (dispatch) => {

    console.log(payload,groupId)
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(changeGroup(payload))
        return data;
    } else {
        throw Error(res);
    }

}




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
        case ADD_ONE:
            return{
                ...state,
                currGroup: action.group
            }
        case REMOVE_ONE:
            const { [action.groupId]: _, ...remainingGroups } = state.groupsList;
            return {
               ...state,
               groupsList: remainingGroups,
               currGroup: state.currGroup.id === action.groupId ? {} : state.currGroup
            };
        case UPDATE_GROUP:
            const updatedGroup = action.group;
            return {
                ...state,
                groupsList: {
                    ...state.groupsList,
                   [action.groupId]: updatedGroup
                },
                currGroup: updatedGroup
            };

        default:
            return state;
    }
};

export default groupsReducer;
