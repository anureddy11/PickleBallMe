import { csrfFetch } from './csrf';

const LOAD_ALL_EVENTS = "events/LOAD_ALL_EVENTS";
const LOAD_EVENTS_BY_GROUP_ID = "events/LOAD_EVENTS_BY_GROUP_ID";
const LOAD_EVENT_BY_ID = "groups/LOAD_EVENT_BY_ID"
const ADD_ONE = '/events/ADD_ONE'
const REMOVE_ONE = '/events/REMOVE_ONE'

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

export const addEvent =(event) =>{
    return {
        type: ADD_ONE,
        event
    }
}

export const removeEvent =(eventId) =>{
    return {
        type: REMOVE_ONE,
        eventId
    }
}
//Delete an event thunk

export const deleteEvent =(eventId) => async (dispatch) =>{
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    })

    const data = await res.json()
    dispatch(removeEvent(eventId))

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


//Create an event
export const createEvent = (payload,groupId) => async (dispatch) => {
    console.log(JSON.stringify(payload))

    const res = await csrfFetch (`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw Error(res);
    }
}


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
        case ADD_ONE:
                return{
                    ...state,
                    currEvent: action.event
                }
         case REMOVE_ONE:
            const { [action.eventId]: _, ...remainingEvents } = state.eventsList;
            return {
               ...state,
               eventsList: remainingEvents,
               currEvent: state.currEvent.id === action.eventId ? {} : state.currEvent
            };
        default:
            return state;
    }
}

export default eventsReducer;
