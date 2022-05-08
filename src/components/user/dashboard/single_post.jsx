import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router';
import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { postsCall } from '../../../network/user_calls';
import { Post } from './forum_utils';
import { SubComments } from './post_utils';



const SinglePost = (props) => {
    
    const [user_token] = useStateWithLocalStorage("user_token");
    const [post, setPost] = useState({});
    const [subPosts, setSubPost] = useState([]);
    const location = useLocation();
    const history = useHistory();
    const [backUrl, setBackUrl] = useState("/user-dashboard");



    let { id } = useParams();
    const { from } = location.state || { from: { pathname: backUrl } };


    let getPost = async () =>{
        
        await postsCall(user_token, id)
        .then((response)=>response.json())
        .then((result)=>{
            if (result){
                setPost(result.post);
                setSubPost(result.comments);
                setBackUrl(`/user-dashboard/forum/${result.post.f_no}`)
            }
        })
    }

    let goBack = ()=>{
        history.replace(from);
    }

    useEffect(()=>{
        try{
            getPost();
            
        }catch(e){}
    },[id]);

   

    return (
        <div className="min-vh-100">
            <nav className=" d-grid gap-1 align-items-center  bg-primary text-light p-2"  style={{gridTemplateColumns: "1fr 6fr"}}>
                
                <FontAwesomeIcon  onClick={goBack}  icon="chevron-left" size="2x" />   
                
                <h4 className="ps-2">Post</h4>
                
            </nav>
            <main>
                <div className="row p-3 px-4">
                <Post
                    user_token={user_token}
                    post={post}
                    setPost={setPost}
                    single_post={true}
                    {...props}
                />
                <SubComments
                    subPosts={subPosts}
                    setSubPost={setSubPost}
                    user_token={user_token}
                />    
                </div>
            </main>
        </div>
    )
}


 

export default SinglePost;   