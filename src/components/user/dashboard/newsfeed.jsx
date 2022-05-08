import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createRef, Fragment, useEffect, useState } from "react";
import { useStateWithLocalStorage } from "../../../network/user/hooks";
import { newsfeedPostsCall, newForumPostCall, trendingNewsfeedPostsCall } from "../../../network/user_calls";
import { Files, Post } from './forum_utils';

const Newsfeed = ({app_walls,  ...props}) => {
    return ( 
        <Fragment>
            <NewFeedPost
            app_walls={app_walls}
            {...props}
            />
        </Fragment>
     );
}

const NewFeedPost = ({app_walls, setLoader, searchValue, ...props}) => {
    const [showFiles, setShowFiles] = useState(false);
    const [user_token] = useStateWithLocalStorage("user_token");
    const [newFeedPosts, setNewFeedPost] = useState([]);
    const [trendingNewfeedPosts, setTrendingNewfeedPosts] = useState([]);
    const [searchNewfeedPosts, setSearchNewfeedPosts] = useState([]);
    const [endForumStyle, setendForumStyle] = useState(0);
    const [lastPageLoaded, setLastPageLoaded] = useState(0);
    const [lastSearchPageLoaded, setLastSearchPageLoaded] = useState(0);
    const [lastTrendingPageLoaded, setLastTrendingPageLoaded] = useState(0);
    const [activeFeed, setActiveFeed] = useState(0);


    let selectForum  = createRef();

    useEffect(() => {
        if(!searchValue) return;
        setSearchNewfeedPosts([]);
        setLastSearchPageLoaded(0)
        setActiveFeed(2);
        getSearchNewsfeedPosts(searchValue);
       
    }, [searchValue]);

    let handleSubmit = async (e)=>{
        e.preventDefault();
        setLoader(true);
        let formData = new FormData(e.target);
        await newForumPostCall(user_token, formData, selectForum.current.value)
        .then((response)=>response.json())
        .then((result)=>{
            // console.log(result);
            if (result.status === 'success') {
                e.target.reset();
                setNewFeedPost([result.data, ...newFeedPosts]);
            }
            setLoader(false);
            
        })
    }

    let renderForums = ()=>{
        return (app_walls||[]).map((wall)=>(
            <option value={wall.f_id} key={wall.f_id}> {wall.f_name} </option>
        ))
    }

    let renderNewsfeedPosts = ()=>{
        if (activeFeed === 1) {
            return trendingNewfeedPosts.map((post)=>(
                <Post
                    key={post.c_id}
                    user_token={user_token}
                    post={post}
                    showForumName={true}
                    setForumPost={setNewFeedPost}
                    forumPosts={newFeedPosts}
                    {...props}
                />
            ));
        }
        if (activeFeed === 2) {
            return searchNewfeedPosts.map((post)=>(
                <Post
                    key={post.c_id}
                    user_token={user_token}
                    post={post}
                    showForumName={true}
                    setForumPost={setNewFeedPost}
                    forumPosts={newFeedPosts}
                    {...props}
                />
            ));
        }

        return newFeedPosts.map((post)=>(
            <Post
                key={post.c_id}
                user_token={user_token}
                post={post}
                showForumName={true}
                setForumPost={setNewFeedPost}
                forumPosts={newFeedPosts}
                {...props}
            />
        ));
        
        
    }

    let getNewsfeedPosts = async () =>{
        if (newFeedPosts.length % 20 !== 0) {
            setendForumStyle(2);
            return;
        }
        window.scrollTo(0, window.scrollY-100);
        setendForumStyle(1);
        
        await newsfeedPostsCall(user_token, lastPageLoaded)
        .then((response)=>response.json())
        .then((result)=>{
            setNewFeedPost([...newFeedPosts, ...result]);
            setLastPageLoaded(lastPageLoaded+1)
            setendForumStyle(0)
            if(result.length < 20) setendForumStyle(2)
        })
    }
    let getTrendingNewsfeedPosts = async () =>{
        if (trendingNewfeedPosts.length % 20 !== 0) {
            setendForumStyle(2);
            return;
        }
        window.scrollTo(0, window.scrollY-100);
        setendForumStyle(1);
        
        await trendingNewsfeedPostsCall(user_token, lastTrendingPageLoaded)
        .then((response)=>response.json())
        .then((result)=>{
            setTrendingNewfeedPosts([...trendingNewfeedPosts, ...result]);
            setLastTrendingPageLoaded(lastTrendingPageLoaded+1)
            setendForumStyle(0)
            if(result.length < 20) setendForumStyle(2)
        })
    }
    let getSearchNewsfeedPosts = async (search) =>{
        if (searchNewfeedPosts.length % 20 !== 0) {
            setendForumStyle(2);
            return;
        }
        window.scrollTo(0, window.scrollY-100);
        setendForumStyle(1);
        
        await  newsfeedPostsCall(user_token, lastSearchPageLoaded, search)
        .then((response)=>response.json())
        .then((result)=>{
            setSearchNewfeedPosts([...searchNewfeedPosts, ...result]);
            setLastSearchPageLoaded(lastSearchPageLoaded+1)
            setendForumStyle(0)
            if(result.length < 20) setendForumStyle(2)
        })
    }

    useEffect(() => {
        
        let scrollListener =  (event) => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-100) {
                if (endForumStyle=== 1) {
                    return;
                }
                if (activeFeed === 0) {
                    getNewsfeedPosts();
                }

                if (activeFeed === 1) {
                    getTrendingNewsfeedPosts();
                }

                if (activeFeed === 2) {
                    getSearchNewsfeedPosts();
                }
            }
        };

        window.addEventListener('scroll', scrollListener );
        return ()=>{
            window.removeEventListener('scroll', scrollListener );
        }

    }, [getNewsfeedPosts, getTrendingNewsfeedPosts, activeFeed]);

    useEffect(() => {
        getNewsfeedPosts();
        getTrendingNewsfeedPosts();
    }, []);
    return ( 
        <Fragment>
            <form encType="multipart/form-data" method="post" action="" className="col-12 row p-2 m-0" onSubmit={handleSubmit}>
                <textarea name="c_content" className="form-control m-0" maxLength="7000"
                    style={{width:'90%', borderRadius:'20px'}} 
                    placeholder="Post what's on your mind" required></textarea>
                <div className="col-2 m-0 " style={{width:'10%'}} >
                    <FontAwesomeIcon className="mt-3 text-primary" icon="camera" size="2x" onClick={()=>setShowFiles(!showFiles)} /> 
                </div>
                <span className={showFiles? '':'d-none'}>
                    <Files
                    {...props}/>
                </span>
                <select name="f_id" ref={selectForum} className="form-control m-0 mt-1" 
                style={{width:'70%', borderRadius:'20px'}}  required>
                    <option value="">--Categories--</option>
                    {renderForums()}
                </select>
                <div style={{width:'30%'}} >
                    <input className="form-control btn btn-primary mt-1"
                    style={{ borderRadius:'20px'}} 
                    type="submit" name="comment" value="POST"/>
                </div>

                
                
            </form>

            <div className="col-12 d-flex align-items-center flex-row mt-1 p-0">
                <button className={`flex-grow-1 btn border border-primary ${activeFeed===1?'btn-primary': ''} `}
                    style={{borderRadius:'20px 0 0 20px'}}
                    onClick={()=>setActiveFeed(1)}
                >
                    Trending Post
                </button>
                <button className={`flex-grow-1 btn border border-primary ${activeFeed===0?'btn-primary': ''} `}
                    style={{borderRadius:'0 20px 20px 0'}}
                    onClick={()=>setActiveFeed(0)}
                >
                    Latest Post
                </button>
            </div>

            {renderNewsfeedPosts()}

            <div className={`w-100  justify-content-center align-items-center mt-2 ${ endForumStyle === 1 ? 'd-flex': 'd-none'}`} >
                <div className="spinner-grow text-primary p-3" role="status">
                    <span className="sr-only" >Loading...</span>
                </div>
            </div> 
            <div className={`w-100  justify-content-center align-items-center mt-2 ${ endForumStyle === 2 ? 'd-flex': 'd-none'}`} >
                <span className="text-muted text-primary"><small>--end--</small></span>
            </div>

        </Fragment>

     );
}
 
 
export{ Newsfeed };