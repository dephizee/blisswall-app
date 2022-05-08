import { Fragment, useEffect, useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { pinnedChatCall } from "../../../network/user_calls";
import { host_url } from "../../../network/utils";

const Chats = ({setAllNewMessageCount, ...prop}) => {
    const [user_token] = useStateWithLocalStorage("user_token");
    const [pinnedChats, setPinnedChats] = useState([]);
    

    const getPinnedChats = async ()=>{

        await pinnedChatCall(user_token)
        .then((response)=>response.json())
        .then((result)=>{
            // console.log(result);
            setPinnedChats(result)
            setAllNewMessageCount(result.reduce((total, chat)=>{
                return total + (parseInt(chat.new_msg_count) !== 0? 1:0)
            }, 0))
            
        })
    }

    useEffect(() => {
        getPinnedChats()
        const loopId  =  setInterval(()=>{
            getPinnedChats()
        }, 10000)

        return ()=>{
            console.log('clearInterval', loopId)
            clearInterval(loopId);
        }
        
    }, []);
     
    let getOnlineStatus = (last_seen_sec) =>{
        if(parseInt(last_seen_sec) < 120 ){
            return <div className="bg-success position-absolute start-0 m-1 rounded-pill" style={{width:'15px', height:'15px', opacity:'0.8'}}></div>
        }
        return<Fragment></Fragment>
    }
    let getAllChats = () =>{
        return pinnedChats.map((chat, index)=>(
            <Link key={index} 
                className="text-decoration-none text-dark d-flex flex-row my-1"  
                to={`/user-dashboard/chat/${chat.pro_id}`}
            >
                
                    <div className="col-2 position-relative">
                        {getOnlineStatus(chat.last_seen_sec)}
                        <img className="user_logo p-0 w-100 rounded-pill-circle" 
                                src={`${host_url}public/images/w_logo/${chat.av_url}`}  alt="logo"/>
                        
                    </div>
                    <div className="col-7 text-start ps-2 overflow-hidden">
                        <dt className="font-size-xs">
                            {chat.pro_username}
                        </dt>
                        <small className="text-muted">
                            {chat.pc_msg}
                        </small>
                    </div>
                    <div className="text-end pe-2">
                        <small className="fw-light smaller me-1">
                            <Moment fromNow>{chat.pc_created}</Moment>
                        </small>
                        <small className="badge bg-success rounded-pill">
                            {parseInt(chat.new_msg_count) !== 0? chat.new_msg_count:''}
                        </small>
                    </div>
                
            </Link>
        ))
    }
    return ( 
        <Fragment>
            <div className="d-flex flex-row my-1">
                <div className="col-2">
                    <img className="user_logo p-0 w-100 rounded-circle" 
                            src="/logo.jpeg"  alt="logo"/>
                </div>
                <div className="flex-grow-1 text-start ps-2">
                    <dt className="font-size-xs">
                        Blisswall
                    </dt>
                    <small className="text-muted">
                        message
                    </small>
                </div>
                <div className="text-end pe-2">
                    <div>
                        00:00
                    </div>
                    <small className="badge bg-success rounded-pill">
                        3
                    </small>
                </div>
            </div>
            {getAllChats()}
        </Fragment>
        
     );
}
 
export default Chats;