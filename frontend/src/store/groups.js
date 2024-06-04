import { csrfFetch } from './csrf';

const LOAD_GROUPS = "groups/LOAD_GROUPS";

export const getGroups = (groupsArray) => {
    return {
        type: LOAD_GROUPS,
        groupsArray
    };
};

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


const initialState = { groups: {} };

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const newGroups = {};
            action.groupsArray.forEach(group => {
                newGroups[group.id] = group;
            });
            return {
                ...newGroups
            };
        default:
            return state;
    }
};

export default groupsReducer;
