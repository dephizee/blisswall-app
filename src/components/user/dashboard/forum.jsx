import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { host_url } from '../../../network/utils';
import { forumPostsCall } from "../../../network/user_calls";
import { AddNewPost, Post } from './forum_utils';


const Forum = (props) => {
    const [user_token] = useStateWithLocalStorage("user_token");
    const [forumDetails, setforumDetails] = useState({});
    const [forumPosts, setForumPost] = useState([]);
    const [lastPageLoaded, setLastPageLoaded] = useState(0);
    const [endForumStyle, setendForumStyle] = useState(0);

    
    
    let { id } = useParams();

    let getForumPosts = async () =>{
        if (endForumStyle ===2) return;
        
        window.scrollTo(0, window.scrollY-100);
        setendForumStyle(1);
        
        if (!forumDetails.f_id) return;
        await forumPostsCall(user_token, forumDetails.f_id, lastPageLoaded)
        .then((response)=>response.json())
        .then((result)=>{
            setForumPost([...forumPosts, ...result]);
            setLastPageLoaded(lastPageLoaded+1)
            setendForumStyle(0)
            if(result.length < 20) setendForumStyle(2)
        })
    }

    let renderForumPosts = ()=>{
        return forumPosts.map((post, index)=>(
            <Post
                key={post.c_id}
                user_token={user_token}
                post={post}
                setForumPost={setForumPost}
                forumPosts={forumPosts}
                {...props}
            />
        ));
        
    }

    useEffect(() => {
        getForumPosts();
    }, [forumDetails]);

    useEffect(() => {
        
        window.onscroll = function(event) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                getForumPosts();
            }
        };

    }, [getForumPosts]);

    useEffect(()=>{
        try{
            setforumDetails(props.app_walls.find((forum_elm)=> forum_elm.f_id === id ));
            
        }catch(e){}
    },[props, id]);

  
    return (
        <div className="min-vh-100">
            <nav className=" d-grid gap-1 align-items-center  bg-primary text-light p-2"  style={{gridTemplateColumns: "1fr 1fr 3fr 3fr"}}>
                
                <props.Link className="text-light" to="/user-dashboard">
                    <FontAwesomeIcon   icon="chevron-left" size="2x" /> 
                </props.Link>  
                <div className="bg-white p-2 rounded-circle overflow-hidden">
                    <img src={`${host_url}public/images/w_logo/${forumDetails.av_url}`} className="img w-100" alt="logo" />
                </div>
                <h4 className="ps-2">{forumDetails.f_name || 'loading...'}</h4>
                <button className="btn btn-light" style={{lineHeight:'normal'}}><small>Connect with a Professional</small></button>
            </nav>
            <main>
                <div className="row p-3 px-4">
                    <div className="col-12 bg-white p-3" style={{borderRadius:'20px'}}>
                        <h5 className="text-center"><strong>{forumDetails.f_sub_header || 'loading...'}</strong></h5>
                        <h6 className="row" >
                            <img className="user_logo col-2 p-0 rounded-circle" src="/logo.jpeg" alt="logo"/>
                            <label className="col-10" style={{alignSelf:'flex-end'}} htmlFor=""> by Blisswall</label>
                        </h6>
                        
                        <p className="text-muted">{forumDetails.f_sub_content || 'loading...'}</p>
                        
                        
                        
                        
                        <AddNewPost
                            user_token={user_token}
                            forumDetails={forumDetails}
                            setForumPost={setForumPost}
                            forumPosts = {forumPosts}
                            {...props}
                        />
                        
                        
                        
                    </div>
                    {renderForumPosts()}
                    <div className={`w-100  justify-content-center align-items-center mt-2 ${ endForumStyle === 1 ? 'd-flex': 'd-none'}`} >
                        <div className="spinner-grow text-primary p-3" role="status">
                            <span className="sr-only" >Loading...</span>
                        </div>
                    </div> 
                    <div className={`w-100  justify-content-center align-items-center mt-2 ${ endForumStyle === 2 ? 'd-flex': 'd-none'}`} >
                        <span className="text-muted text-primary"><small>--end--</small></span>
                    </div> 
                </div>
            </main>
        </div>
    )
}


 

export default Forum;   