import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  Link } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { host_url } from '../../../network/utils';
import { updateUserDetailsCall } from '../../../network/user_calls';

import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { useHistory } from "react-router";
import { Newsfeed } from './newsfeed';
import Chats from './chat';

const Dashboard = (props) => {
    const [user_token, setUserToken] = useStateWithLocalStorage("user_token");
    
    const [searchValue, setSearchValue] = useState("");
    const [allNewMessageCount, setAllNewMessageCount] = useState(0);
    

    let handleSearchSubmit = (event)=>{
        event.preventDefault();
        if(event.target.search.value === "") return;
        setSearchValue(event.target.search.value);
        event.target.reset();
        
    }

    

    const updateUserInfo = async (key, value)=>{
        props.setLoader(true);
        let data = new FormData();
        data.append('key', key);
        data.append('value', value);
        
        await updateUserDetailsCall(user_token, data)
        .then((response)=>response.json())
        .then((result)=>{
            
            if (result.status === 'success'){
                props.setMainUserInfo({...props.user_info, [key]:value, });
                // console.log(result);
            }
            props.setLoader(false);
            
        })
    }
    
    return (
        <div className="d-flex align-items-center justify-content-center flex-column min-vh-100">
            
            
            <div className="d-flex flex-grow-1 w-100 flex-column text-center">
                <Header
                {...props}
                
                setUserToken={setUserToken}
                handleSearchSubmit={handleSearchSubmit}
                updateUserInfo={updateUserInfo}
                />
                <Slider
                allNewMessageCount={allNewMessageCount}
                searchValue={searchValue}
                setAllNewMessageCount={setAllNewMessageCount}
                {...props}
                />
                
                
            </div>
            
        </div>
      );
}

const Header = ({user_info, updateUserInfo, clearMessage,setUserToken,handleSearchSubmit, ...props})=>{
    const [menuVisible, setMenuVisibility] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [update_user_form, setupdate_user_form] = useState();
    const history = useHistory();
    
    let getAvatars = (arr)=>{
        return arr.map((elm, index)=>(
            <option key={index} value={elm.av_id}> {elm.av_name}</option>
        ))
    }
    useEffect(()=>{
        try{
            if(typeof props.user_avatars  == "undefined") return;
            setAvatars(props.user_avatars);
        }catch(e){}
    },[props]);
    let changeImageIcon = (event)=>{
        props.updateMessage("Change Icon?", "info", async (result)=>{
            await updateUserInfo(event.target.name, event.target.value);
            clearMessage();
            props.setMainUserInfo({...user_info, av_url:avatars[event.target.selectedIndex-1].av_url });
        });
    }
    let updateField = (event)=>{
        if (event.keyCode === 13) {
            event.preventDefault()
            props.updateMessage("Continue Update?", "info", (result)=>{
                updateUserInfo(event.target.name, event.target.value);
                clearMessage();
            });
        }
    }
    let getMenuStyle = {
        top:0,left:0,
        boxShadow: '8px 0px 6px 0px rgb(0 0 0 / 20%)',
        gridTemplateRows: "2fr 3fr",
        transition: '2s',
        marginLeft:menuVisible?'0':"-100%",
    };

    
    return (
        <Fragment>
            <header className="py-3  p-0 mb-3 border-bottom bg-primary container-fluid text-white">
                <div className="col-12 row px-2">
                    <div className=" col-6">
                        <span className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-light text-decoration-none">
                            <img src="/logo.jpeg" className="img mb-3 w-25" alt="logo" />
                            <Link to="/"><b className="m-3 text-light">Blisswall</b></Link>
                        </span>
                        
                    </div>
                    <div className="col-6 text-end">
                        <div className="d-block"><span className="d-inline-block rounded-circle bg-success" style={{height:'15px', width:'15px'}}></span> Online</div> 
                        users 
                    </div>
                </div>
                
                <form action="" onSubmit={handleSearchSubmit}>  
                <div className="d-grid gap-0 align-items-center" style={{gridTemplateColumns: "1fr 5fr 1fr 1fr"}}>
                    <FontAwesomeIcon className="d-sm-none m-2" onClick={()=>setMenuVisibility(true)} icon="bars" size="2x" />
                    


                    
                        <input type="search" name="search" className="form-control" placeholder="Search..."/>

                        <button className="bg-transparent border-0 text-light" ><FontAwesomeIcon className="d-sm-none m-2" icon="search" size="1x" /></button>
                    
                    <FontAwesomeIcon className="d-sm-none m-2" onClick={()=>setMenuVisibility(true)} icon="bell" size="1x" />
                </div>
                </form>

            
            </header>
            <div className="position-fixed w-75 bg-light vh-100 d-grid " style={getMenuStyle}>
            <div className="bg-primary text-center pt-2" style={{borderRadius: '0 0 15% 0'}}>   
                <div className="col-2 offset-10">
                <i className="typcn typcn-times h2 text-danger" onClick={()=>setMenuVisibility(false)}> </i>
                </div>
                <div className="col-4 offset-4 mt-5 ">
                    <img className="w-100 rounded-circle" src={`${host_url}public/images/w_logo/${user_info && (user_info.av_url || '')}`} alt="avatar"/>
                </div>
                <div className="col-10 form-group my-2 offset-1 ">
                <select name="av_no"  onChange={changeImageIcon}  className="col-8 col-offset-4 form-control mt-1" required >
                    <option disabled value=""> -select {user_info && (user_info.av_no || '')} avatar- </option>
                    {getAvatars(avatars)}
                </select>
            </div>
                
                <div className="col-10 offset-1 text-light mt-2">
                    <label htmlFor="">{user_info && (user_info.u_name || '')}</label><FontAwesomeIcon className="ms-2 text-light" onClick={()=>setupdate_user_form(!update_user_form)} icon="pen" />
                    <input onKeyUp={updateField} type="text" name="u_name" className={`form-control ${update_user_form?'d-block':'d-none'}`} placeholder={user_info && (user_info.u_name || '')}/>
                </div>
            </div>
            <div className="d-flex align-items-left justify-content-top pt-1 flex-column min-h-100 w-100">
            
                <FontAwesomeIcon className="d-sm-none m-3 position-absolute top-0 end-0 text-light" onClick={()=>setMenuVisibility(false)} icon="times" />
                <span className="nav-link text-dark">Home</span>
                <span className="nav-link text-dark">About Blisswall</span>
                <span className="nav-link text-dark">Contact Us</span>
                <span className="nav-link text-dark">FAQ</span>
                <span className="nav-link text-dark">Partners</span>
                <span className="nav-link text-dark">Policy</span>
                <span className="nav-link text-dark">
                    {/* <Link  to="/login"> */}
                        <button onClick={()=>{
                                    setUserToken('');
                                    history.replace('/login');
                                }
                            } className="btn btn-info px-auto m-2 mt-5">
                                Logout
                                </button>
                    {/* </Link> */}
                </span>
                
            
            </div>
        </div>
        </Fragment>
    );
}
const Slider = ({app_walls, allNewMessageCount, ...props}) =>{
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [walls, setWalls] = useState([]);
    const [viewWidth, setViewWidth] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    let tabclass = (indx)=> currentPageIndex!==indx?'col-4':'col-4 active';
   
    
    let handleMoveT = (e)=>{
        let view_container = document.querySelector('.slider_panel');
        setScrollLeft(view_container.scrollLeft);
    }
    
    useEffect(()=>{
        let view_container = document.querySelector('.slider_panel');
        view_container.addEventListener('touchend', handleMoveT);
        
        setViewWidth(view_container.scrollWidth/3 )
        
    },[]);

    useEffect(()=>{
        document.querySelector('.slider_panel').scrollLeft = currentPageIndex === 0 ? 0 : currentPageIndex === 1 ? viewWidth : viewWidth*2;
    },[currentPageIndex, viewWidth]);


    useEffect(()=>{

        if(scrollLeft>viewWidth*1.5){
            setCurrentPageIndex(2);
            document.querySelector('.slider_panel').scrollLeft = viewWidth*2;
            return;
        }
        if(scrollLeft>viewWidth*0.5 && scrollLeft<viewWidth*1.5){
            setCurrentPageIndex(1);
            document.querySelector('.slider_panel').scrollLeft = viewWidth;
            return;
        }
        if(scrollLeft<viewWidth*0.5){
            setCurrentPageIndex(0);
            document.querySelector('.slider_panel').scrollLeft = 0;
            return;
        }
        
        
        

        // if(scrollLeft>(viewWidth*2)/2){
        //     setCurrentPageIndex(1);
        //     document.querySelector('.slider_panel').scrollLeft = viewWidth;
        // }
        
       
        
        
        
    },[scrollLeft, viewWidth]);

    useEffect(()=>{
        try{
            if(typeof app_walls  == "undefined") return;
            setWalls(app_walls);
        }catch(e){}
    },[app_walls]);


    let genWalls = (arr)=>{
        if (!arr) return <h1>...</h1>
        return arr.map((elm, index)=>(
            <Link key={index} 
                className="text-decoration-none border  bg-white d-flex align-items-center justify-content-center flex-column"  
                style={{aspectRatio:"1", borderRadius:"20px"}} 
                to={`/user-dashboard/forum/${elm.f_id}`}
                >
                <img src={`${host_url}public/images/w_logo/${elm.av_url}`} className="img w-75" alt={elm.f_name} />
                <small className="text-primary ">{elm.f_name}</small>
                
            </Link>
        ))
    }



    return  (
        
        <Fragment>
            <main className="flex-grow-1 d-flex flex-column">
                <div className="col-12 row m-0">
                    <div className={`small ${tabclass(0)}`} id="pinned_chat" onClick={()=>setCurrentPageIndex(0)}>Wall</div>
                    <div className={`small ${tabclass(1)}`} id="wall" onClick={()=>setCurrentPageIndex(1)}>Newsfeed</div>
                    <div className={`small p-0 ${tabclass(2)}`} id="wall" onClick={()=>setCurrentPageIndex(2)}>
                        Pinned Chat 
                        <small className="badge bg-success rounded-pill ms-1">
                            {parseInt(allNewMessageCount) !== 0?allNewMessageCount:''}
                        </small>
                    </div>
                </div>
                <div className="col-12 flex-grow-1 slider_panel" style={{overflowX:'scroll',scrollBehavior:'smooth' }}>
                    <div className="row m-0" style={{width:'300%', height:'75vh'}}>
                        <div className=" col-4 m-0 h-100 overflow-scroll" onTouchEnd={handleMoveT}>
                            <div className=" p-1 d-grid gap-1 align-items-center"  style={{gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
                                {genWalls(walls)}
                            </div>
                        </div>
                        <div className=" col-4 m-0 h-100 overflow-scroll">
                            <Newsfeed
                            app_walls={app_walls}
                            {...props}
                            />
                        </div>
                        <div className=" col-4 m-0 h-100 mt-2 overflow-scroll">
                            <Chats
                            {...props}
                            />
                        </div>
                    </div>
                </div>
                
            </main>
                
        </Fragment>
    
    );
}
 
export { Dashboard};