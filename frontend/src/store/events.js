import { csrfFetch } from './csrf';

const LOAD_ALL_EVENTS = "events/LOAD_ALL_EVENTS";
const LOAD_EVENTS_BY_GROUP_ID = "events/LOAD_EVENTS_BY_GROUP_ID";

// Action creator
export const getEventsByGroupId = (Events) => {
    return {
        type: LOAD_EVENTS_BY_GROUP_ID,
        Events
    }
}

// Fetch events by groupId
export const fetchEventsByGroupId = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'GET'
    });

    if (res.ok) {
        const data = await res.json();
        console.log(data.Events);
        dispatch(getEventsByGroupId(data.Events));
    }
};

const initialState = { events: {}, eventsByGroupId: {}, currEvent: {} };

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_EVENTS_BY_GROUP_ID: {
            const newEvents={}
            action.Events.forEach(event=>{
                newEvents[event.id]= event
            })
            return {
                ...state,
                eventsByGroupId: newEvents
            };
        }
        default:
            return state;
    }
}

export default eventsReducer;
