import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './SplashPage.css'; // Import the CSS file
import OpenModalButton from '../../Componenets/OpenModalButton/OpenModalButton'
import pickleImage from '/Users/anuragreddy/git_files/PickleBallMe/Images/PickleBallSplashImage.jpeg'
import startAgroup from '/Users/anuragreddy/git_files/PickleBallMe/Images/startAgroup.jpeg'
import seeAllgroups from '/Users/anuragreddy/git_files/PickleBallMe/Images/seeEvents.jpeg'
import seeEvents from '/Users/anuragreddy/git_files/PickleBallMe/Images/seeAllgroups.jpeg'
import SignUpFormModal from '../../componenets/SignUpFormModal/SignUpFormModal';
const SplashPage = () =>{
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div>
            <div className="section" id="section1">
                <div id="section 1.1">
                    <h1>World&apos;s Best Platform for All Things Pickle Ball</h1>
                    <p>Join us and be part of the fastest-growing sport community. Let&apos;s play, learn, and grow together!</p>
                </div>
                <img src={pickleImage} alt="Pickleball Group" className="group-image" />
            </div>
            <div className="section" id="section2">
                    <h1>How PickleBallMe Works?</h1>
                    <p>Intro : this is the best Pickle Ball meet up site ever</p>
                    </div>
            <div className="section" id="section3">
                <div className="column">
                    <h2>
                    <img src={seeAllgroups} alt="Pickleball Group" className="group-image" />
                        <NavLink to ='/groups'>
                            See All Groups
                        </NavLink>
                    </h2>
                </div>
                <div className="column">
                    <h2>
                        <img src={seeEvents} alt="Pickleball Group" className="group-image" />
                        <NavLink to ='/events'>
                            Find an Event
                        </NavLink>
                    </h2>
                </div>
                <div>
                    {sessionUser ? (
                    <div className="column">
                        <h2>
                            <img src={startAgroup} alt="Pickleball Group" className="group-image" />
                            <NavLink to='/groups/createGroup'>
                                Start A Group
                            </NavLink>
                        </h2>
                    </div>
                    ) : null}
                </div>
            </div>
            <div className="section" id="section4">
                    <OpenModalButton
                    buttonText= "Join PickleBallMe"
                    modalComponent={<SignUpFormModal />}
                    />
            </div>
        </div>
    );
}

export default SplashPage;
