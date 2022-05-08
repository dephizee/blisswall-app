import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef, Fragment, useEffect, useState } from "react";
import Moment from "react-moment";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { chatRoomMessageCall, getProInfoCall } from "../../../network/user_calls";
import { host_url } from "../../../network/utils";
import { pushPCMsgCall } from "../../../network/user_calls";

const ChatRoom = ({setAllNewMessageCount,updateMessage,clearMessage, ...props}) => {
    const [user_token] = useStateWithLocalStorage("user_token");
    const [allChatMessage, setAllChatMessage] = useState([]);
    const [lastMessageId, setLastMessageId] = useState(0);
    const [attachmentName, setAttachmentName] = useState('');
    const [proDetail, setProDetail] = useState({});

    const hiddenFile  = createRef();

    let { id } = useParams();

    const getAllChatMessages = async ()=>{
        if  (!id ) return;

        await chatRoomMessageCall(user_token, id, lastMessageId)
        .then((response)=>response.json())
        .then((result)=>{
            console.log(result);
            setAllChatMessage(result.chat_data);
            // setLastMessageId (parseInt(result.chat_data[result.chat_data.length-1].pc_id) );
            
            
        })
    }
    

    const getProInfo = async ()=>{
        if  (!id ) return;

        await getProInfoCall(user_token, id)
        .then((response)=>response.json())
        .then((result)=>{
            console.log(result);
            setProDetail(result);
            
            
        })
    }

    const handleChatSubmit = async (event)=>{
        event.preventDefault();
        
        event.target.pc_msg.focus();
        
        let formData = new FormData(event.target);
        event.target.reset();
        setAttachmentName('');
        await pushPCMsgCall(user_token, id, formData)
        .then((response)=>response.json())
        .then((result)=>{
            console.log('result', result);
            if (result.status === 'success') {
                // setPost({...post, comment_no: (parseInt(post.comment_no)+1)});
                
            }
            
        })
    }

    useEffect(() => {
        getAllChatMessages();
        getProInfo();
        const loopId  =  setInterval(()=>{
            getAllChatMessages()
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
    
    
    let userChat = (chat)=>{


        return(
            <div key={chat.pc_id} className="col-12 p-2">
                <div className="p-2 rounded overflow-hidden 
                    text-end offset-2 col-10 bg-primary text-light"
                    >
                    <label className="d-block"> {chat.pc_msg} </label>
                    <small className="d-block" style={{fontSize:'.7em'}}> 
                        <Moment fromNow>{chat.pc_created}</Moment> 
                    </small>
                </div>
            </div>
        )
    }
    let proChat = (chat)=>{


        return(
            <div key={chat.pc_id} className="col-12 p-2">
                <div
                    style={{backgroundColor:'#33669950'}}
                    className="bg-white p-2 rounded overflow-hidden col-10">
                    <label className="d-block"> {chat.pc_msg} </label>
                    <small className="d-block text-muted" style={{fontSize:'.7em'}}> 
                        <Moment fromNow>{chat.pc_created}</Moment> 
                    </small>
                </div>
            </div>
        )
    }
    
    let getAllChat = ()=>{
        return allChatMessage.map((chat)=>{
            if(chat.pc_sender==="u") return userChat(chat)
            return proChat(chat);
        })
    }

    let handleFileChange = (e)=>{
        setAttachmentName('');
        if (e.target.files[0]) {
            var file = e.target.files[0];
            var size = file.size/1024;
            var type = file.type;
            if(type !== "image/jpeg" && type !== "image/png" && type !== "image/gif"){
                updateMessage(file.name+" is not an acceptable image", 'warning', clearMessage(), false);
                e.target.value = '';
                return false;
            }
            if(size > 2048){
                updateMessage(file.name+" is greater Than 2mb", 'warning', clearMessage(), false);
                e.target.value = '';
                return false;
            }

            setAttachmentName(file.name);
            

            var reader = new FileReader();
            reader.onload = function(e_data){  
                
                

            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    let renderAttachmentName = ()=>{
        if (!attachmentName) return <Fragment></Fragment>;
        return <div className="border border-2 border-bottom-0 text-center bg-primary text-light" style={{borderRadius:'20px 20px 0 0'}}>
                {attachmentName}
        </div>
    }

    return ( 
        <div className="min-vh-100">
            <nav className="row align-items-center position-fixed top-0 w-100 m-0  bg-primary text-light p-2">
                
                <Link className="text-light col-1" to="/user-dashboard">
                    <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                </Link>  
                <div className="bg-white p-2 rounded-circle overflow-hidden col-2 col-sm-1">
                    <img src={`${host_url}public/images/w_logo/${proDetail.av_url||''}`} className="img w-100" alt="logo" />
                </div>
                <h4 className="ps-2 col-9">{proDetail.pro_username || 'loading...'}</h4>
                
            </nav>
            <main style={{paddingTop:'12vh', paddingBottom:'12vh'}}>
                {getAllChat()}
            </main>
            <form onSubmit={handleChatSubmit}>
                <nav className="row align-items-center position-fixed bottom-0 m-0 w-100 p-2">
                    {renderAttachmentName()}
                    <FontAwesomeIcon  
                    onClick={()=>hiddenFile.current.click()}
                    className="col-1 p-0 text-primary cursor-pointer"  
                    style={{width:'10%'}}  icon="plus-circle" size="2x" /> 
                    
                    <input type="text" required name="pc_msg" maxLength="1024" className="form-control col-10"  style={{width:'80%'}}/>
                    <input ref={hiddenFile} type="file" name="pc_file" onChange={handleFileChange} className="d-none"/>
                    
                    <button className=" col-1 text-primary border-0"   style={{width:'10%'}}>
                        <FontAwesomeIcon
                        
                        
                        icon="angle-right" size="2x" /> 
                    </button>
                    
                    
                </nav>
            </form>
        </div>
     );
}
 
export {ChatRoom};