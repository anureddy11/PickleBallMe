import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../src/store/events";

const CreateNewEventForm = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [inPerson, setInPerson] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [capacity, setCapacity]= useState (0)
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const currGroup = useSelector((state) => state.groups.currGroup);
    const currGroupId = currGroup.id

    useEffect(() => {
        const newErrors = {};

        // Check for empty fields
        if (!eventName) newErrors.eventName = 'Event name cannot be empty';
        if (!description) newErrors.description = 'Description cannot be empty';
        if (description && description.length < 30) newErrors.description = 'Description must be at least 30 characters long';
        if (!inPerson) newErrors.inPerson = 'Event type cannot be empty';
        if (!isPrivate) newErrors.isPrivate = 'Event privacy cannot be empty';
        if (!price) newErrors.price = 'Price cannot be empty';
        if (!capacity) newErrors.capacity = 'Capacity cannot be empty';
        // if (!price.trim()) newErrors.price = 'Price cannot be empty';
        // if (!capacity.trim()) newErrors.capacity = 'Capacity cannot be empty';
        if (!startDate) newErrors.startDate = 'Start date cannot be empty';
        if (!endDate) newErrors.endDate = 'End date cannot be empty';
        if (!image) newErrors.image = 'Image URL cannot be empty';

         // Check if start date is before end date
         if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            newErrors.startDate = 'Start date cannot be after end date';
        }

        setErrors(newErrors);
    }, [eventName, capacity,description, inPerson, isPrivate, price, startDate, endDate, image]);

    const handleSubmit = async (e) => {
                e.preventDefault();


                if (Object.keys(errors).length > 0) {
                    return;
                }

                const payload = {
                    "venueId": 1,
                    "name": eventName,
                    "type": inPerson,
                    "capacity": capacity,
                    "price": price,
                    "description": description,
                    "startDate": startDate,
                    "endDate": endDate,
                    "previewImage":image
                }
    // try{
                // Dispatch the action to create the group/event
                let createdEvent = await dispatch(createEvent(payload,currGroupId))
                console.log(createdEvent.body)
                if(createdEvent){
                    navigate(`/events/${createdEvent.id}`)
                }
    // }
    //     catch(error){
    //         console.log(error);
    //         setErrors({ error: error.message });
    //     }

    };

    return (
        <section className="new-form-holder centered middled">
            <h1>Create an event for {currGroup.name}</h1>
            <form className="create-event-form"  onSubmit={handleSubmit}>
                <p>What is the name of your event?</p>
                <input
                    placeholder="Event Name"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                {errors.eventName && <p className="error">{errors.eventName}</p>}
                <br /><br />

                <p>Please describe your event:</p>
                <textarea
                    id="paragraph"
                    name="paragraph"
                    placeholder="Please describe your event:"
                    rows="4"
                    cols="50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {errors.description && <p className="error">{errors.description}</p>}
                <br /><br />

                <p>What is the price for your event?</p>
                <input
                    placeholder="0"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && <p className="error">{errors.price}</p>}
                <br /><br />

                <p>What is the max capacity for your event?</p>
                <input
                    placeholder="0"
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
                {errors.capacity && <p className="error">{errors.capacity}</p>}
                <br /><br />

                <p>When does your event start?</p>
                <input
                    placeholder="MM/DD/YYYY HH:mm AM"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                {errors.startDate && <p className="error">{errors.startDate}</p>}
                <br /><br />

                <p>When does your event end?</p>
                <input
                    placeholder="MM/DD/YYYY HH:mm AM"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                {errors.endDate && <p className="error">{errors.endDate}</p>}
                <br /><br />

                <p>Please add an image URL for your event below:</p>
                <input
                    placeholder="Image URL"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />
                {errors.image && <p className="error">{errors.image}</p>}
                <br /><br />

                <label>
                    Is this an in person or online event?
                    <select
                        name="selectedType"
                        value={inPerson}
                        onChange={(e) => setInPerson(e.target.value)}
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="In person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                {errors.inPerson && <p className="error">{errors.inPerson}</p>}
                <br /><br />

                <label>
                    Is this event private or public?
                    <select
                        name="selectedType"
                        value={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.value)}
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </label>
                {errors.isPrivate && <p className="error">{errors.isPrivate}</p>}
                <br /><br />

                <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                >
                    Create Event
                </button>
                {/* {errors} */}
                {/* {errors.error && <p className="error">{errors.error}</p>} */}
                <br /><br />
            </form>
        </section>
    );
}

export default CreateNewEventForm;
