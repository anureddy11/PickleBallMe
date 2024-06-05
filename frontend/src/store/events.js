import { csrfFetch } from './csrf';

const LOAD_ALL_EVENTS = "events/LOAD_ALL_EVENTS";
const LOAD_EVENTS_BY_GROUP_ID = "events/LOAD_EVENTS_BY_GROUP_ID";
const LOAD_EVENT_BY_ID = "groups/LOAD_EVENT_BY_ID"

// Action creator

export const getEvents = (eventsArray) => {
    return {
        type: LOAD_ALL_EVENTS,
        eventsArray
    };
};


export const getEventsByGroupId = (Events) => {
    return {
        type: LOAD_EVENTS_BY_GROUP_ID,
        Events
    }
}

export const getEventByid = (event) => {
    return {
        type:LOAD_EVENT_BY_ID,
        event
    }
}

//Fetch a event by eventId

export const fetchEventById = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'GET'
    });

    const data = await res.json();
    // console.log(data)
    dispatch(getEventByid(data));
};



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

//Fetch all events
export const fetchAllEvents = () => async (dispatch) => {
    const res = await csrfFetch('/api/events', {
        method: 'GET'
    });

    const data = await res.json();
    dispatch(getEvents(data.Events));

};

const initialState = { eventsList: {}, eventsByGroupId: {}, currEvent: {} };

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
        case LOAD_ALL_EVENTS:
            const newEvents = {};
            action.eventsArray.forEach(event => {
                newEvents[event.id] = event;
            });

            return {
                ...state,
                eventsList:newEvents,
            };

        case LOAD_EVENT_BY_ID:
                return {
                        ...state,
                        currEvent: action.event
                };
        default:
            return state;
    }
}

export default eventsReducer;
