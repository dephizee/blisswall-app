import SweetAlert from "react-bootstrap-sweetalert";
import { Fragment, useEffect, useState } from 'react';
import { host_url } from "../../network/utils";
import { userRegister, userLoginCall } from "../../network/user_calls";
import { useStateWithLocalStorage } from "../../network/user/hooks";
import { useHistory, useLocation } from "react-router";



const Login = (props) => {
    const [active_page, setActivePage] = useState(0);
    const [alertMessage, setAlertMessage] = useState({
        message: "",
        type: "default",
    });
    const [avatars, setAvatars] = useState([]);
    let clearMessage = ()=>{
        setAlertMessage({
            message: "",
            type: "default",
        })
    }
    let updateMessage = (msg, type)=>{
        setAlertMessage({
            message: msg,
            type: type,
        })
    }

    let gotoLogin = ()=>{
        setActivePage(0);
    }
    let gotoRegister = ()=>{
        setActivePage(1);
    }
    
    useEffect(()=>{
        try{
            if(typeof props.user_avatars  == "undefined") return;
            setAvatars(props.user_avatars);
        }catch(e){}
    },[props]);

    let displayPages = ()=>{
        if(active_page === 1){
            return <UserRegister
            updateMessage={updateMessage}
            user_avatars={avatars}
            setLoader={props.setLoader}
            gotoLogin={gotoLogin}
            gotoRegister={gotoRegister}
            
            />
        }else{
            return <UserLogin
            updateMessage={updateMessage}
            user_avatars={avatars}
            setLoader={props.setLoader}
            gotoLogin={gotoLogin}
            gotoRegister={gotoRegister}
            
            />
        }
    }
    
    
    let buttonClasses = "flex-grow-1 btn rounded border";
    let loginButtonClasses = buttonClasses + (active_page === 0? " btn-primary text-light":"");
    let registerButtonClasses = buttonClasses + (active_page === 1? " btn-primary text-light":"");
    return (
        <div className="min-vh-100 d-flex flex-column">
            <nav className="d-flex align-items-center justify-content-center flex-row min-vw-100 text-primary p-1">
                <img className="d-block" style={{width:'50px',}} src="/logo.jpeg" alt=""/>    
                <div className="ps-3" style={{flexGrow:"5"}} >
                    <h4>Blisswall</h4>
                </div>
                <div className="flex-grow-1" >
                    <props.Link to="/" >
                        <button className="btn btn-transparent border text-primary">Back</button>
                    </props.Link>
                </div>
            </nav>
            <main className="d-flex flex-grow-1 flex-column">
                <div className="d-flex align-items-center justify-content-center flex-row min-vw-100 text-primary p-1">
                    <button className={loginButtonClasses} onClick={gotoLogin}>Login</button>
                    <button className={registerButtonClasses} onClick={gotoRegister}>Register</button>
                </div>
                <div className="d-flex flex-grow-1 align-items-center justify-content-center p2">
                    {displayPages()}
                </div>
            </main>
            <SweetAlert
                show={alertMessage.message.length>0}
                type={alertMessage.type}
                confirmBtnText="ok, got it"
                title=""
                onConfirm={clearMessage}
                onCancel={clearMessage}
                >
                {alertMessage.message}
            </SweetAlert>
        </div>
    )
}

const UserRegister = (props) => {
    const [avatars, setAvatars] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("/user.png");
    const [formDatas, setFormData] = useState([null, null]);

    

    let registerUser = async (data)=>{
        props.setLoader(true);
        await userRegister(data)
        .then((response)=>response.json())
        .then((result)=>{
            if (result.status === "failed") {
                props.updateMessage(result.log, "warning");
            }
            if (result.status === "success") {
                props.updateMessage(result.log, "success");
            }
            // props.updateMessage("Unknown Error", "d  anger");
            props.setLoader(false);
        })
    }   
    
    useEffect(()=>{
        try{
            // console.log(props.about.config_value);
            setAvatars(props.user_avatars);
        }catch(e){}
    },[props]);
    let getAvatars = (arr)=>{
        return arr.map((elm, index)=>(
            <option key={index} value={elm.av_id}> {elm.av_name}</option>
        ))
    }

    let changeImageIcon = (e)=>{
        if (e.target.selectedIndex === 0){setSelectedAvatarUrl ( "/user.png"); return;}
        setSelectedAvatarUrl ( `${host_url}public/images/w_logo/${avatars[e.target.selectedIndex-1].av_url}` );
    }

    

    let handlePageOne = (event)=>{
        event.preventDefault();
        setFormData([ new FormData(event.target) , null] );
        setCurrentPage(1);
    }
    let handlePageTwo = (event)=>{
        event.preventDefault();
        let tmp = [...formDatas];
        tmp[1] = new FormData(event.target);
        setFormData(tmp);
        if (event.target.password.value.length !== 6 ) {
            props.updateMessage("password should be of length 6", "warning");
            return;
        }
        if (event.target.password.value !== event.target.repassword.value ) {
            props.updateMessage("passwords do not Tally", "warning");
            return;
        }
        var data = tmp[0];
        var second_data_iterator = tmp[1].entries();
        let next_data = second_data_iterator.next();
        do{
            
            
            if(typeof next_data.value !== undefined){
                data.append(next_data.value[0], next_data.value[1]);
            }
            next_data = second_data_iterator.next();
        }while(!next_data.done);
        registerUser(data);
    }

   

    let userRegisterPageOne = (
        <form method="post" action="" onSubmit={handlePageOne}>
            <div className="w-100 d-flex align-items-center justify-content-center">
                <img className="w-25 rounded-circle" src={selectedAvatarUrl} alt="avatar"/>
            </div>  
            <div className="col-12 form-group my-4 ">
                <select name="av_no" onChange={changeImageIcon}  className="col-8 col-offset-4 form-control mt-1" required >
                    <option value=""> -select avatar- </option>
                    {getAvatars(avatars)}
                </select>
            </div>
            <div className="col-12 form-group my-4">
                <input className="form-control rounded" type="text" name="u_name" placeholder="Random Username" maxLength="15"   required/>
            </div>
            <div className="col-12 form-group my-4"> 
                <input className="form-control rounded" type="text" name="u_email" placeholder="Email" maxLength="50"   required/>
            </div>
            <div className="col-12 form-group my-4">
            <input className="form-control rounded" type="text" name="phone_number" placeholder="Phone Number" minLength="7" maxLength="11"   required/>
            </div>
            <div className="col-12 form-group my-2">
                <button className="form-control btn btn-primary">Next</button>
            </div>
            <p className="text-center">Already have an account? <span className="text-primary" onClick={props.gotoLogin} >login</span></p>
        </form>
    );

    let userRegisterPageTwo = (
        <form method="post" action="" onSubmit={handlePageTwo}>
            <div className="col-12 form-group my-4 ">
                <select name="u_gender"  className="col-8 col-offset-4 form-control mt-1" required >
                    <option value=""> -Select Gender- </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div className="col-12 form-group my-4">
                <input className="form-control rounded" type="date" name="u_dob" placeholder="Date of birth" required/>
            </div>
            
            <div className="col-12 form-group my-4"> 
                <input className="form-control rounded" type="password" name="password" placeholder="Pin" maxLength="6" minLength="6" required/>
            </div>
            <div className="col-12 form-group my-4">
                <input className="form-control rounded" type="password" name="repassword" placeholder="Re-Enter Pin" maxLength="6" minLength="6" required/>
            </div>
            
            <div className="col-12 form-group my-2">
                <div className="w-25 form-control btn btn-primary" onClick={props.gotoRegister} >Previous</div>
                <button className="w-50 float-end form-control btn btn-primary" type="submit">Submit</button>
            </div>
        </form>
    );

    let displayUserPage = ()=>{
        // if (currentPage === 0)return userRegisterPageOne;
        // if (currentPage === 1)return userRegisterPageTwo;
        return(
            <Fragment>
                <span className={currentPage===0?'':'d-none'}>
                    {userRegisterPageOne}
                </span>
                <span className={currentPage===1?'':'d-none'}>
                    {userRegisterPageTwo}
                </span>
               
            </Fragment>
            )
    }

    return (  
        <div className="d-grid w-100 row m-0">
            
            {displayUserPage()}
        
        </div>
    );
}

const UserLogin = (props)=>{
    const location = useLocation();
    const history = useHistory();
    const [token,setToken] = useStateWithLocalStorage("user_token");
    const { from } = location.state || { from: { pathname: "/user-dashboard" } };
    let handleLogin = async (event)=>{
        let data = new FormData(event.target);
        event.preventDefault();
        props.setLoader(true);
        await userLoginCall( data )
        .then((response)=>response.json())
        .then((result)=>{
            // console.log(result);
            if (result.status === "success") {
                setToken(result.jwt);
                history.replace(from);
            }
            if (result.status === "failed") {
                props.updateMessage(result.log, "warning");
            }
            
            props.setLoader(false);
        })
        
    }

    // useEffect(()=>{
    //     console.log("status", token === ''? 'No Credential': 'With Crediantal')
    // },[token]);
    return  (
        <div className="d-grid w-100 row m-0">
            <form method="post" action="" onSubmit={handleLogin}>
                <div className="col-12 form-group my-4">
                <input className="form-control rounded" type="tel" name="u_phone" placeholder="Phone Number" minLength="7" maxLength="11"   required/>
                </div>
                <div className="col-12 form-group my-4"> 
                    <input className="form-control rounded" type="password" name="u_pin" placeholder="Pin" maxLength="6" minLength="4" required></input>
                </div>
                <div className="col-12 form-group my-2">
                    <button className="form-control btn btn-primary">Next</button>
                </div>
                <p className="text-center"> <span className="text-primary float-end" onClick={props.gotoRegister} >signup</span></p>
            </form>
        </div>
    );
}
 

export {Login};   