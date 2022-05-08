import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
import { useStateWithLocalStorage } from '../network/user/hooks';




const Home = (props) => {
    const [menuVisible, setMenuVisibility] = useState(false);
    const [user_token] = useStateWithLocalStorage("user_token");
    const [pro_token] = useStateWithLocalStorage("pro_token");
    let mobileMenuStyle = {
        backgroundColor:'#efefef',
        transition:"2s",
        marginLeft:menuVisible?'0':"-100%",
    }

    let upperHalfStyle = {
        borderRadius : "0 0 50px 50px",
    }

    let getStartedLink = ()=>{
        if (user_token !== ''){
            return "/user-dashboard";
        }
        if (pro_token !== ''){
            return "/pro-dashboard";
        }
        return "/login";
    }
    return ( 
        <div className="d-flex align-items-center justify-content-center flex-column min-vh-100">
            
            <div className="bg-primary flex-grow-1 w-100 d-flex align-items-center justify-content-center flex-column " style={upperHalfStyle}>
                <nav className="navbar navbar-expand text-light position-absolute start-0 top-0 w-100 p-2">
                    <FontAwesomeIcon className="d-sm-none m-2" onClick={()=>setMenuVisibility(true)} icon="bars" size="2x" />

                    <span className="d-none d-sm-block">
                        <div className="collapse navbar-collapse " id="navbarsExample02">
                            <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                    <props.Link to="/" className="nav-link text-light">Home</props.Link>
                                </li>
                                <li className="nav-item active">
                                    <props.Link to="/about" className="nav-link text-light">About</props.Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link">Link</span>
                                </li>
                            </ul>
                            
                        </div>
                    </span>
                </nav>
                <img src="/logo.jpeg" className="img mb-3 w-25" alt="logo" />
                <h2 className="text-light" style={{letterSpacing: '2px', fontWeight: 'bold',}}>Blisswall</h2>
            </div>
            <div className="d-flex flex-grow-1 w-100 flex-column align-items-center justify-content-center text-center">
                <div className="flex-grow-1 p-3 col-12">
                    <div className="col-2 m-0 p-0 d-inline-block">
                        <FontAwesomeIcon className=" text-primary"  icon="map-marker-alt" size="2x" /> 
                    </div>
                
                    <div className="col-10 m-0 p-0 d-inline-block text-left" style={{textAlign:'left'}}>
                        
                        <h2 className="m-0" style={{fontWeight:'bolder', fontSize:'22px'}}>
                            Share your mind freely
                        </h2>
                        <p className="m-0" style={{fontSize:'15px',}}>in the Anonymous space of Happiness</p>
                    </div>
                </div>
                <div className="flex-grow-1 w-100">
                    <props.Link to={getStartedLink} className="nav-link text-dark">
                        <button className="btn btn-primary px-auto m-2 mt-4 col-6 offset-6" style={{borderRadius:'40px', fontSize:'15px', fontWeight:'bold'}}>Get Started</button>
                    </props.Link>
                </div>
                
            </div>
            <div style={mobileMenuStyle} className="d-flex align-items-left justify-content-top pt-5 flex-column min-vh-100 w-75 position-absolute top-0 start-0 d-sm-none">
                <FontAwesomeIcon className="d-sm-none m-3 position-absolute top-0 end-0 text-primary" onClick={()=>setMenuVisibility(false)} icon="times" />
                <props.Link to="/" className="nav-link text-dark">Home</props.Link>
                <props.Link to="/about" className="nav-link text-dark">About Blisswall</props.Link>
                <props.Link to="/contact-us" className="nav-link text-dark">Contact Us</props.Link>
                <props.Link to="/faq" className="nav-link text-dark">FAQ</props.Link>
                <props.Link to="/partners" className="nav-link text-dark">Partners</props.Link>
                <props.Link to="/policy" className="nav-link text-dark">Policy</props.Link>
                <props.Link to="/login" className="nav-link text-dark">
                    <button className="btn btn-primary px-auto m-2 mt-4">Get Started</button>
                </props.Link>
                
            </div>
        </div>
     );
}
 
export default Home;