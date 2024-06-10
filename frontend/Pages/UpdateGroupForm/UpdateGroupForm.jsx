import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  updateGroup } from "../../src/store/groups";
import { useNavigate, useParams } from "react-router-dom";


const UpdateGroupForm =() =>{

    const currGroup = useSelector((state) => state.groups.currGroup)
    const {groupId} = useParams()
    // console.log(currGroup)

    const [location, setLocation] = useState(`${currGroup.city}, ${currGroup.state}`);
    const [groupName, setGroupName] = useState(`${currGroup.name}`);
    const [description, setDescription] = useState(`${currGroup.about}`);
    const [inPerson, setInPerson] = useState(`${currGroup.type}`);
    const [isPrivate, setIsPrivate] = useState(`${currGroup.private}`);
    const [imageUrl, setImageurl] = useState("")
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // console.log(location,groupName,description,inPerson,isPrivate)

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
        // if (description.length > 0 && description.length < 50) {
        //     newErrors.description = 'Description must be at least 50 characters long';
        // }

        setErrors(newErrors);

        const payload= {
            "name":groupName,
            "about":description,
            "type":inPerson === "Online" ? "Online" :"In person",
            "private":isPrivate==="private" ? true : false,
            "city": location.split(',')[0],
            "state": location.split(',')[1],
            // "previewImage":
        }
        console.log(payload)

        let updatedGroup = await dispatch(updateGroup(payload,groupId))
        if(updatedGroup){
            navigate(`/groups/${updatedGroup.id}`)
        }

    };


    return (
       <section className= "update-form-holder centered middled">
        <h1>UPDATE YOUR GROUP'S INFORMATION</h1>
        <h2>Become an Organizer</h2>
        <form className="create-group-form" onSubmit={handleSubmit}>
            <p>First, set your group's location.
                Meetup groups meet locally, in person and online. We'll connect you with people
                in your area, and more can join you online
            </p>
                <input
                    placeholder={location || "City, State"}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                {errors.location && <p className="error">{errors.location}</p>}
                <br /><br />

             <p>What will your group's name be?
            Choose a name that will give people a clear idea of what the group is about.
                Feel free to get creative! You can edit this later if you change your mind.</p>
                <input
                    placeholder={ groupName ||"What is your group name?"}
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                {errors.groupName && <p className="error">{errors.groupName}</p>}
                <br /><br />


                <p>Now describe what your group will be about
                People will see this when we promote your group, but you'll be able to add to it later, too.
                1. What's the purpose of the group?
                2. Who should join?
                3. What will you do at your events?</p>
                <textarea
                    id="paragraph"
                    name="paragraph"
                    placeholder={description || "Please write at least 50 characters"}
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

                <p>Please add an image url for your group below:
            </p>
                <input
                    placeholder={"image url here"}
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageurl(e.target.value)}
                />
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
                    Update Group
                </button>



        </form>

       </section>
    )

}


export default UpdateGroupForm
