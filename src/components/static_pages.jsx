import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

const About = (props) => {
    const [value, setValue] = useState("loading");

    useEffect(()=>{
        try{
            // console.log(props.about.config_value);
            setValue(props.about.config_value);
        }catch(e){}
    },[props]);
    return (
        <div className="min-vh-100">
            <nav className="row bg-primary text-light p-3">
                <div className="col-1">
                    <props.Link className="text-light" to="/">
                        <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                    </props.Link>                    
                </div>
                <div className="col-11 ps-3" >
                    <h4>About Blisswall</h4>
                </div>
            </nav>
            <main>
                <p className="p-3" dangerouslySetInnerHTML={{__html:value}}></p>
            </main>
        </div>
    )
}

const Faq = (props) => {
    const [value, setValue] = useState("loading");

    useEffect(()=>{
        try{
            // console.log(props.about.config_value);
            setValue(props.faq.config_value);
        }catch(e){}
    },[props]);
    return (
        <div className="min-vh-100">
            <nav className="row bg-primary text-light p-3">
                <div className="col-1">
                    <props.Link className="text-light" to="/">
                        <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                    </props.Link>                    
                </div>
                <div className="col-11 ps-3" >
                    <h4>FAQ</h4>
                </div>
            </nav>
            <main>
            <p className="p-3" dangerouslySetInnerHTML={{__html:value}}></p>
            </main>
        </div>
    )
}

const Policy = (props) => {
    const [user_value, setUserValue] = useState("loading");
    const [pro_value, setProValue] = useState("loading");

    useEffect(()=>{
        try{
            // console.log(props);
            setUserValue(props.user.config_value);
            setProValue(props.pro.config_value);
        }catch(e){}
    },[props]);
    return (
        <div className="min-vh-100">
            <nav className="row bg-primary text-light p-3">
                <div className="col-1">
                    <props.Link className="text-light" to="/">
                        <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                    </props.Link>                    
                </div>
                <div className="col-11 ps-3" >
                    <h4>Policies</h4>
                </div>
            </nav>
            <h3 className="p-2 text-primary" style={{fontWeight:'bolder'}}>User Policy</h3>
            <main>
            <p className="p-3" dangerouslySetInnerHTML={{__html:user_value}}></p>
            </main>
            <h3 className="p-2 text-primary" style={{fontWeight:'bolder'}}>Professional Policy</h3>
            <main>
            <p className="p-3" dangerouslySetInnerHTML={{__html:pro_value}}></p>
            </main>
        </div>
    )
}

const Partners = (props) => {
    return (
        <div className="min-vh-100">
            <nav className="row bg-primary text-light p-3">
                <div className="col-1">
                    <props.Link className="text-light" to="/">
                        <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                    </props.Link>                    
                </div>
                <div className="col-11 ps-3" >
                    <h4>Partners</h4>
                </div>
            </nav>
            <main>
                <p className="p-3">Partners</p>
            </main>
        </div>
    )
}
const ContactUs = (props) => {
    return (
        <div className="min-vh-100">
            <nav className="row bg-primary text-light p-3">
                <div className="col-1">
                    <props.Link className="text-light" to="/">
                        <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                    </props.Link>                    
                </div>
                <div className="col-11 ps-3" >
                    <h4>Contact Us</h4>
                </div>
            </nav>
            <main>
                <div style={{fontSize:'smaller'}}>
                    <div className="row p-4">
                        <div className="col-2 border bg-light text-primary rounded-circle">
                            <FontAwesomeIcon icon="phone-alt"  size="2x" />     
                        </div>
                        
                        <p className="col-10" >+2347061980402</p>
                    </div>
                    <div className="row p-4">
                        <div className="col-2 border bg-light text-primary pt-3 rounded-circle">
                            <FontAwesomeIcon icon="envelope"  size="2x" />     
                        </div>
                        
                        <p className="col-10" >info@blisswall.com, blisswallinfo@gmail.com</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
export {About, Faq, Policy, Partners, ContactUs};   