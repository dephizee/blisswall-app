import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  createRef, Fragment, useEffect, useState } from 'react'
import { host_url } from '../../../network/utils';
import { newForumPostCall, newForumCommentCall, 
    forumCommentReact, forumCommentGetReactions } from "../../../network/user_calls";
import Moment from 'react-moment';
import { MLoader } from '../../helpers';
import { SinglePostCommentButtons } from './post_utils';
import { Link, useLocation } from 'react-router-dom';
const Post = ({post, user_token, single_post, removeParent, showForumName, ...props}) => {

    let getPostButton = ()=>{
        if (single_post) {
            return <SinglePostCommentButtons
                        user_token={user_token}
                        post={post}
                        {...props}
                    />;
        }else{
            return <PostCommentButtons
                        user_token={user_token}
                        post={post}
                        {...props}
                    />;
        }
    }

    let renderParent  = () =>{
        if (removeParent) return <Fragment></Fragment>;
        return <Parent
                    post={post}
                    />;
    }
    return ( 
        <div className="col-12 mt-2 bg-white p-3" style={{borderRadius:'20px'}}>
            
            <h6 className="row px-1" >
                <img className="user_logo col-1 p-0 rounded-circle" 
                    src={`${host_url}public/images/w_logo/${post.av_url}`}  alt="logo"/>
                <label className="col-11 text-start " style={{alignSelf:'flex-end'}} htmlFor=""> 
                    <span>by {post.u_name} <small className="text-muted"><Moment fromNow>{post.c_created}</Moment></small></span>
                    <small className="d-block"><i>{ showForumName && post.f_name? `from ${post.f_name} wall`:''}</i></small>
                </label>
            </h6>
            {renderParent()}
            <Media
                post={post}
                />
            <p className="text-muted text-start">{post.c_content || 'loading...'}</p>
            
            
            
            {getPostButton()}
            
            
            
        </div>
     );
}


const Parent = ({post}) => {
    let location = useLocation();
    
    let getParentPost = ()=>{
        if(post.parent_comment_content){
            return(
                <Link 
                    className="text-decoration-none" 
                    to={{
                            pathname: `/user-dashboard/post/${post.parent_id}`,
                            state: { from: location }
                        }}    
                    >
                    <div className="row p-2 rounded m-0 overflow-hidden border-start border-primary border-4 text-muted" style={{maxHeight:'25vh', backgroundColor:'#33669910'}}  >
                        <h6 className="row" >
                            <img className="user_logo col-1 p-0 rounded-circle" src={`${host_url}public/images/w_logo/${post.parent_user_av_url}`} alt="logo"/>
                            <label className="col-11" style={{alignSelf:'flex-end'}} htmlFor=""> by {post.parent_user_name} <small className="text-muted"><Moment fromNow>{post.parent_comment_created}</Moment></small></label>
                        </h6>
                        <ParentMedia
                            post={post}
                            />
                        {post.parent_comment_content}
                    </div>
                </Link>
            )
        }
        return <Fragment></Fragment>;
    }
    
    return ( 
        getParentPost()
     );
}

const ParentMedia = ({post}) => {

    let getAllMedia = () =>{
        let attachments = [];
        for (let index = 1; index <= 4; index++) {
            let img_attachment = post[`parent_comment_attachment_${index}`];
            if(!img_attachment) continue;
            let splited_att = img_attachment.split('.');
            let m_ext = splited_att[splited_att.length-1];
            if (m_ext==="m4v"||m_ext==="avi"||m_ext==="mpg"||m_ext==="mp4" ){
                attachments.push((
                    <video className="col-12 my-1 embed-responsive embed-responsive-16by9"   controls> 
                        <source src={`${host_url}public/images/${img_attachment}`} type={`video/${m_ext}`}/> 
                    </video>  
                ));
            }else{
                attachments.push((
                    <img className="col-12 my-1" src={`${host_url}public/images/${img_attachment}`} alt="upload file" />
                ));
            }
            
        }
        return attachments.map((attachment, index)=>(
            <div key={index} className="col-12 col-sm-6 col-md-4">
                {attachment}
            </div>
        ));
    }
    return ( 
        <div className="row m-0" >
            {getAllMedia()}
        </div>
     );
}

const Media = ({post}) => {

    let getAllMedia = () =>{
        let attachments = [];
        for (let index = 1; index <= 4; index++) {
            let img_attachment = post[`attachment_${index}`];
            if(!img_attachment) continue;
            let splited_att = img_attachment.split('.');
            let m_ext = splited_att[splited_att.length-1];
            if (m_ext==="m4v"||m_ext==="avi"||m_ext==="mpg"||m_ext==="mp4" ){
                attachments.push((
                    <video className="col-12 my-1 embed-responsive embed-responsive-16by9"   controls> 
                        <source src={`${host_url}public/images/${img_attachment}`} type={`video/${m_ext}`}/> 
                    </video>  
                ));
            }else{
                attachments.push((
                    <img className="col-12 my-1" src={`${host_url}public/images/${img_attachment}`} alt="upload file" />
                ));
            }
            
        }
        return attachments.map((attachment, index)=>(
            <div key={index} className="col-12 col-sm-6 col-md-4">
                {attachment}
            </div>
        ));
    }
    return ( 
        <div className="row m-0" >
            {getAllMedia()}
        </div>
     );
}




const PostCommentButtons = ({user_token, setForumPost,forumPosts, post, ...props}) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingIcon, setLoadingIcon] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [firstIconOpen, setFirstIconOpen] = useState(true);
    const [newIconCount, setnewIconCount] = useState(0);
    let location = useLocation();
    const [icons, setIcons] = useState([
        {
            icon: 'heart',
            class: 'text-danger',
            count: '...',
        },{
            icon: 'heart-broken',
            class: 'text-danger',
            count: '...',
        },{
            icon: 'smile',
            class: 'text-warning',
            count: '...',
        },{
            icon: 'sad-tear',
            class: 'text-warning',
            count: '...',
        },
    ]);
    


    let formContainerClass = showForm ? "col-12": "col-12 d-none";

    let handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        let formData = new FormData(e.target);
        await newForumCommentCall(user_token, formData, post.f_no, post.c_id)
        .then((response)=>response.json())
        .then((result)=>{
            // console.log(result);
            if (result.status === 'success') {
                e.target.reset();
                
                if (setForumPost != null){
                    let postIndex = forumPosts.findIndex((m_post)=>{
                        return m_post.c_id  === post.c_id;
                    });
                    let newFormPost = [...forumPosts];
                    newFormPost[postIndex] = {...newFormPost[postIndex], comment_no: parseInt(newFormPost[postIndex].comment_no)+1}
                    setForumPost([result.data, ...newFormPost]);
                }
                
            }
            setLoading(false);
            // props.updateMessage("Unknown Error", "d  anger");
            
        })
    }
    let addReaction = async (icon) =>{
        setLoadingIcon(true);
        await forumCommentReact(user_token, post.f_no, post.c_id, icon)
        .then((response)=>response.json())
        .then((result)=>{
            if (result.status === 'success') {
                if (selectedIcon == null) {
                    setnewIconCount(1);
                }
                setSelectedIcon(result.logo);
                updateIconList(result.data);
            }
            setLoadingIcon(false);
            // props.updateMessage("Unknown Error", "d  anger");
            
        })
    }

    let getReactions = ()=>{
        
        return icons.map( (elm, idx)=>(
            <button key = {idx} className="flex-grow-1 btn btn-transparent" onClick={()=>addReaction(idx+1)} >
                <label htmlFor="" className="me-1"><small>{elm.count}</small></label>
                <FontAwesomeIcon className={elm.class} icon={elm.icon} size="2x"  />
            </button>
        ) )
    }

    let getEmojiIcon = ()=>{
        let iconObject = selectedIcon == null?  {icon: ['far', 'heart'], class:''} : icons[selectedIcon-1];
        let reactionCount = parseInt(post.reaction_no) +  newIconCount;
        return (
            <button className="flex-grow-1 btn btn-transparent" onClick={()=>getEmojiIconCounts(!showIcon)} >
                <label htmlFor="" className="me-1"><small>{reactionCount}</small></label>
                <FontAwesomeIcon className={iconObject.class} icon={iconObject.icon} />
            </button>
        )
    }

    let getEmojiIconCounts = async (flag)=>{
        setShowIcon(flag);
        if(!firstIconOpen) return;
        setFirstIconOpen(false);

        await forumCommentGetReactions(user_token, post.f_no, post.c_id)
        .then((response)=>response.json())
        .then((result)=>{
            updateIconList(result);
        })
        

    }

    let updateIconList  = (result_arr)=>{
        let tmpIcon = [...icons];
        tmpIcon.forEach((element, index) => {
            tmpIcon[index] = {...icons[index], count: '0'}
        });
        result_arr.forEach((element) => {
            tmpIcon[element.logo_id-1] = {...icons[element.logo_id-1], count: element.m_count}
        });
        setIcons(tmpIcon);
    }

    useEffect(() => {
        setSelectedIcon(post.m_logo_id);
    }, [post.m_logo_id]);
    
    return ( 
        <Fragment>
            <div className="col-12 d-flex align-items-center flex-row mb-2">
                {getEmojiIcon()}
                <button className="flex-grow-1 btn btn-transparent" onClick={()=>setShowForm(!showForm)} >
                    <label htmlFor="" className="me-1"><small>{post.comment_no}</small></label>
                    <FontAwesomeIcon icon={['far', 'comment']} />
                </button>
                <button className="flex-grow-1 btn btn-transparent" >
                    <label className="me-1">translate</label>
                    <FontAwesomeIcon   icon="sync" /> 
                </button>
                <Link 
                    className="text-decoration-none" 
                    to={{
                            pathname: `/user-dashboard/report/${post.parent_id}`,
                            state: { from: location }
                        }}    
                    >
                    <button className="flex-grow-1 btn btn-transparent"      >
                        <label htmlFor="" className="me-1"></label>
                        <FontAwesomeIcon icon="exclamation-triangle" />
                    </button>
                </Link>
            </div>
            <span className={showIcon?'d-block':'d-none'}>
                <MLoader active={loadingIcon}>
                    <div className="col-10 d-flex align-items-center 
                            flex-row mb-2 position-absolute start-0 
                            bg-white ms-2 border" style={{borderRadius:'20px', boxShadow: '1px 1px 5px #336699'}}>
                                {getReactions()}
                    </div>
                </MLoader>
            </span>
            <div  className={formContainerClass}>
                <MLoader
                        
                    active={loading}> 
                    <form encType="multipart/form-data" method="post" action="" className="col-12" onSubmit={handleSubmit}>
                        <div className="row">
                            <textarea name="c_content" className="form-control w-75" maxLength="7000" required></textarea>
                            <input className="form-control w-25 btn btn-primary" type="submit" name="comment" value="POST"/>
                            
                        </div>
                        <Files
                        {...props}
                        />
                        
                    </form>
                </MLoader>
                
            </div>
        </Fragment>
     );
}

const AddNewPost = ({user_token, forumDetails, setForumPost,forumPosts, ...props}) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    


    let formContainerClass = showForm ? "col-12": "col-12 d-none";

    let handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        
        let formData = new FormData(e.target);
        await newForumPostCall(user_token, formData, forumDetails.f_id)
        .then((response)=>response.json())
        .then((result)=>{
            if (result.status === 'success') {
                e.target.reset();
                setForumPost([result.data, ...forumPosts]);
            }
            setLoading(false);
            
        })
    }
    return ( 
        <Fragment>
            <div className="col-12 d-flex align-items-center flex-row mb-2">
                <button className="flex-grow-1 btn btn-transparent" onClick={()=>setShowForm(!showForm)} >
                    <FontAwesomeIcon icon={['far', 'comment']} />
                    <label htmlFor="" className="ms-1"><small>Add New Post</small></label>
                </button>
                <button className="flex-grow-1 btn btn-transparent" >
                    <FontAwesomeIcon   icon="sync" /> 
                    <label className="ms-1">translate</label>
                </button>
            </div>
            
                <div  className={formContainerClass}>
                    <MLoader
                    
                    active={loading}>
                    <form encType="multipart/form-data" method="post" action="" className="col-12" onSubmit={handleSubmit}>
                        <div className="row">
                            <textarea name="c_content" className="form-control w-75" maxLength="7000" required></textarea>
                            <input className="form-control w-25 btn btn-primary" type="submit" name="comment" value="POST"/>
                            
                        </div>
                        <Files
                        {...props}/>
                        
                    </form>
                    </MLoader>
                </div>
            
        </Fragment>
     );
}
 
const Files = ({updateMessage,clearMessage}) => {
    const [formCount, setFormCount] = useState(0);
    let fileContainer = createRef();
    

    // useEffect(() => {
    //     setFormList([...formList, file]);
    // }, []);

    let addNewFile = () =>{
        if(formCount === 4) return;
        setFormCount(formCount+1);
    }
    let checkFileType = (event) => {
        let target = event.target;
        if (target.files[0]) {
          var file = target.files[0];
          var size = file.size/1024;
          var type = file.type;
          var filetype = "";
          // console.log(type);
          if(type === "image/jpeg" 
            || type === "image/png" 
            || type === "image/gif" 
            || type === "image/svg"  
            || type === "image/svg+xml"
            ){
            filetype = "image";
          }
          if(type === "video/m4v" 
            || type === "video/avi" 
            || type === "video/mpg" 
            || type === "video/mp4"  
      
            ){
            filetype = "video";
          }
          if (filetype === "") {
            updateMessage(file.name+" is not an acceptable image", "info",clearMessage, false);
            target.value = '';
            return false;
          }
          if(filetype === "image" && size > 2048){
            updateMessage(file.name+", Image is greater Than 2mb", "info",clearMessage, false);
            target.value = '';
            return false;
          }
          if(filetype === "video" && size > 5120){
            updateMessage(file.name+", Video is greater Than 5mb", "info",clearMessage, false);
            target.value = '';
            return false;
          }
          
          
        }
      }
    let showForms = () =>{
        let element = [];
        for (let index = 0; index < formCount; index++) {
            element.push (
                <div key={index} className="input-group row">
                    <input type="file" className="form-control w-50 my-1" name="attachment[]" accept="image/*,video/*" onChange={checkFileType}/>
                    <div className="input-group-append col-1" onClick={removeFile}>
                        <FontAwesomeIcon style={{pointerEvents:'none',}} icon="times" size="2x"/> 
                    </div>
                </div>
            )
            
        } 
        return element;
    }
    let removeFile = (e) => {
        setFormCount(formCount-1);
    }

    

    return (
            <div className="row my-2" ref={fileContainer}>
                {showForms()}
                <div className="btn btn-transparent border border-primary col-12" onClick={addNewFile}>Add File</div> 
            </div>
            
        );
}

export { Post, AddNewPost, Files };  