
import { Fragment, useEffect, useState } from 'react';
import {  Redirect, Route, useLocation } from 'react-router-dom';
import { useStateWithLocalStorage } from '../network/user/hooks';
import { userDetailsCall } from '../network/user_calls';


const AuthUserRoute = ({ children, setMainUserInfo, setLoader, ...rest }) => {
    let location = useLocation();
    
    const [conn_status, setConnStatus] = useState('');
    const [user_token] = useStateWithLocalStorage("user_token");

   

    const getUserInfo = async ()=>{
        setLoader(true);
        // console.log("user_token", user_token)
        await userDetailsCall(user_token)
        .then((response)=>response.json())
        .then((result)=>{
            setConnStatus(result.status);
            setMainUserInfo(result.data);
            setLoader(false);
            
        })
    }

    useEffect(()=>{
        // console.log(">>>", conn_status);    
        getUserInfo();
        
    },[])
   
    let displayRender = ()=>{
        if (user_token==='' ) {
            return <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />;
        }
        if (conn_status === '') {
            
            return  <h1>getting user Info</h1>;
        }
        if (conn_status!=='success' ) {
            return <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />;
        }
        
        
        return children;
    }


    return (
      <Route
        
        render={displayRender}
      />
    );
  }


  const MLoader = ({ active, children, ...props }) => {
    let visibleStyle = {
      opacity:'1',
      visibility: 'visible',
      marginLeft: '-10%',
      width: '120%',
      height: '20vh'
    }
    let hiddenStyle = {
      opacity:'0',
      visibility: 'hidden',
      transition: '2s',
    }

    let getChildren = ()=>{
      if (!active) {
        return children;
      }
      return <Fragment></Fragment>
    }

    return ( 
      <div 
          className="w-100 text-primary d-flex flex-column"
          {...props}
          styles={{
            position: 'relative',
            
          }}
          // spinner={<BounceLoader />}
        >
          
          {getChildren()}
          <span style={active?visibleStyle:hiddenStyle}>
              <div className=" d-flex justify-content-center align-items-center" >
                  <div className="spinner-grow text-primary p-3" style={{width: '6rem', height: '6rem'}} role="status">
                      <span className="sr-only" >Loading...</span>
                  </div>
              </div> 
          </span>
        </div>
      )
    
  }
   
 
export {AuthUserRoute, MLoader} ;