import { NavLink } from 'react-router-dom';

const SplashPage = () =>{

    return (
            <div>
                <div className="section" id="section1">
                <h1>PickleBallMe</h1>
                <p>Intro : this is the best Pickle Ball meet up site ever</p>
            </div>
            <div className="section" id="section2">
                <h1>Section 2</h1>
                <p>Content for section 2.</p>
            </div>

            <div className="section" id="section3">
                    <div className="column">
                        <h2>
                            <NavLink to ='/groups'>
                                    See All Groups
                            </NavLink>
                        </h2>

                    </div>
                    <div className="column">
                        <h2>Find an Event</h2>

                    </div>
                    <div className="column">
                        <h2>Start a Group</h2>

                    </div>
            </div>
            <div className="section" id="section4">
                <button>Join Meetup</button>
            </div>
        </div>

    )

}

export default SplashPage
