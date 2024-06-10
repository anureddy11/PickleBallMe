import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../src/store/groups";
import { useNavigate } from "react-router-dom";


const CreateNewGroupForm = () => {
    const [location, setLocation] = useState('');
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [inPerson, setInPerson] = useState('');
    const [isPrivate, setIsPrivate] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const newErrors = { location: '', groupName: '', description: '', inPerson: '', isPrivate: '' };

        // Check for empty fields
        const fields = { location, groupName, description, inPerson, isPrivate };
        for (const [key, value] of Object.entries(fields)) {
            if (value.length < 1) {
                newErrors[key] = `${key} cannot be empty`;
            }
        }

        // Check for description length
        if (description.length > 0 && description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters long';
        }

        setErrors(newErrors);
    }, [location, groupName, description, inPerson, isPrivate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = { location: '', groupName: '', description: '', inPerson: '', isPrivate: '' };

        // Check for empty fields
        const fields = { location, groupName, description, inPerson, isPrivate };

        for (const [key, value] of Object.entries(fields)) {
            if (value.length < 1) {
                newErrors[key] = `${key} cannot be empty`;

            }
        }

        // Check for description length
        if (description.length > 0 && description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters long';
        }

        setErrors(newErrors);

        const payload= {
            "name":groupName,
            "about":description,
            "type":inPerson,
            "private":isPrivate==="private" ? true : false,
            "city": location.split(',')[0],
            "state": location.split(',')[1]
        }

                let createdGroup = await dispatch(createGroup(payload))
                if(createdGroup){
                    navigate(`/groups/${createdGroup.id}`)
                }


    };

    return (
        <section className="new-form-holder centered middled">
            <h1>Start a New Group</h1>
            <h2>Become an Organizer</h2>
            <p>We&apos;ll walk you through a few steps to build your local community</p>
            <form className="create-group-form" onSubmit={handleSubmit}>
                <p>First, set your group&apos;s location.
                Meetup groups meet locally, in person and online. We&apos;ll connect you with people
                in your area, and more can join you online</p>
                <input
                    placeholder="City, State"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                {errors.location && <p className="error">{errors.location}</p>}
                <br /><br />

                <p>What will your group&apos;s name be?
                Choose a name that will give people a clear idea of what the group is about.
                Feel free to get creative! You can edit this later if you change your mind.</p>
                <input
                    placeholder="What is your group name?"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                {errors.groupName && <p className="error">{errors.groupName}</p>}
                <br /><br />

                <p>Now describe what your group will be about
                People will see this when we promote your group, but you&apos;ll be able to add to it later, too.
                1. What&apos;s the purpose of the group?
                2. Who should join?
                3. What will you do at your events?</p>
                <textarea
                    id="paragraph"
                    name="paragraph"
                    placeholder="Please write at least 50 characters"
                    rows="4"
                    cols="50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {errors.description && <p className="error">{errors.description}</p>}
                <br /><br />

                <h1>Final Steps...</h1>
                <br />

                <label>
                    Is this an in person or online group
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
                    Is this group private or public?
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
                    disabled={
                        errors.groupName ||
                        errors.location ||
                        errors.description ||
                        errors.isPrivate ||
                        errors.inPerson
                    }
                >
                    Create Group
                </button>
            </form>
        </section>
    );
};

export default CreateNewGroupForm;