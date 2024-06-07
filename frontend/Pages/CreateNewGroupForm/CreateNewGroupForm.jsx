
const CreateNewGroupForm =() =>{
    return(
        <section className="new-form-holder centered middled">
            <h1>Start a New Group</h1>
            <h2>Become an Organizer</h2>
            <p>We'll walk you through a few steps to build your local community</p>
            <form className="create-pokemon-form" >

            First, set your group's location.
            Meetup groups meet locally, in person and online. We'll connect you with people
            in your area, and more can join you online
            <input
					// type="number"
					// placeholder="Number"
					// min="1"
					// required
					// value={number}
					// onChange={updateNumber}
                    placeholder="City, State"

				/><br /><br />


            What will your group's name be?
            Choose a name that will give people a clear idea of what the group is about.
            Feel free to get creative! You can edit this later if you change your mind.
            <input
					// type="number"
					// placeholder="Number"
					// min="1"
					// required
					// value={number}
					// onChange={updateNumber}
                    placeholder="What is your group name?"

				/><br /><br />

            Now describe what your group will be about
            People will see this when we promote your group, but you'll be able to add to it later, too.
            1, What's the purpose of the group?
            2. Who should join?
            3. What will you do at your events?
            <br />
            <textarea
                    id="paragraph"
                    name="paragraph"
                    placeholder="Please write at least 30 characters"

                    rows="4"
                    cols="50"
                ></textarea><br />


            </form><br /><br />

            <h1>Final Steps...</h1><br />

            <label>
                Is this an in person or online group
                <select name="selectedType" placeholder="What is your group name?">
                    <option disabled selected>Select an option</option>
                    <option value="in-person">In Person</option>
                    <option value="online">Online</option>
                </select>
            </label><br /><br />

            <label>
                Is this group private or public?
                <select name="selectedType">
                    <option disabled selected>Select an option</option>
                    <option value="private">Private</option>
                    <option value="online">Public</option>
                </select>
            </label><br /><br />

            <button> Create Group</button>

        </section>
    )

}

export default CreateNewGroupForm
