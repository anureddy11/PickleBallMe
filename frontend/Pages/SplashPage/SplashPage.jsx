import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


const SplashPage = () =>{
    const sessionUser = useSelector((state) => state.session.user);

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
                            <h2>
                                    <NavLink to ='/events'>
                                            Find an Event
                                    </NavLink>
                            </h2>
                            </div>

                            <div>
                            {sessionUser ? (
                                <h2>
                                    <NavLink to='/groups/createGroup'>
                                        Start A group
                                    </NavLink>
                                </h2>
                            ) : null}
                            </div>
                    <div className="section" id="section4">
                        <button>Join Meetup</button>
                    </div>
                </div>
            </div>

    )

}

export default SplashPage