import { host_url } from "./utils";

const userRegister = (data) => {
    return fetch(`${host_url}apiauth/userRegister/`, {
        method:'POST',
        body: data
    })
}

const userLoginCall = (data) => {
    return fetch(`${host_url}apiauth/user/`, {
        method:'POST',
        body: data
    })
}

const userDetailsCall = (token) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/user/`, {
        headers: data
    })
}

const updateUserDetailsCall = (token, data) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/userUpdate/`, {
        headers: headerList,
        method:'POST',
        body: data
    })
}

const newForumPostCall = (token, data, f_id) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/newforumpost/${f_id}`, {
        headers: headerList,
        method:'POST',
        body: data
    })
}

const newForumCommentCall = (token, data, f_id, c_id) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/newforumcomment/${f_id}/${c_id}`, {
        headers: headerList,
        method:'POST',
        body: data
    })
}

const forumCommentReact = (token, f_id, c_id, logo) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/forumpostreact/${f_id}/${c_id}/${logo}`, {
        headers: headerList,
    })
}

const forumCommentGetReactions = (token, f_id, c_id) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/forumpostgetreaction/${f_id}/${c_id}`, {
        headers: headerList,
    })
}

const forumPostsCall = (token, f_id, page) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/forumPosts/${f_id}/${page}`, {
        headers: data
    })
}

const newsfeedPostsCall = (token, page, search="") => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/newsfeedPosts/${page}/20/${search}`, {
        headers: data
    })
}

const trendingNewsfeedPostsCall = (token, page) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/trendingNewfeedPosts/${page}`, {
        headers: data
    })
}

const postsCall = (token, c_id) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/post/${c_id}`, {
        headers: data
    })
}


const reportPostCall = (token, c_id, data) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/postreport/${c_id}`, {
        headers: headerList,
        method:'POST',
        body: data
    })
}

const pinnedChatCall = (token) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/getPinnedChats`, {
        headers: data
    })
}

const getProInfoCall = (token, pro_id) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/getProDetails/${pro_id}`, {
        headers: data
    })
}

const pushPCMsgCall = (token, pro_id, data) => {
    
    let headerList = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/sendPCMsg/${pro_id}`, {
        headers: headerList,
        method:'POST',
        body: data
    })
}

const chatRoomMessageCall = (token, pro_id, last) => {
    
    let data = {
        "Authorization": token,
        "cache-control": "no-cache",
      }
    return fetch(`${host_url}api/getChatroomMessages/${pro_id}/${last}`, {
        headers: data
    })
}

 
export {userRegister, userLoginCall, 
        userDetailsCall, updateUserDetailsCall, 
        newForumPostCall, forumPostsCall, newForumCommentCall,
        forumCommentReact, forumCommentGetReactions, postsCall,
        reportPostCall, newsfeedPostsCall, trendingNewsfeedPostsCall,
        pinnedChatCall, chatRoomMessageCall, getProInfoCall,pushPCMsgCall
    };