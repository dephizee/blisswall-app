import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Home from './components/home.jsx'
import {About, Faq, Policy, Partners, ContactUs} from './components/static_pages.jsx'
import { useEffect, useState } from 'react';
import { Login } from './components/user/auth';
import { generalInfo } from './network/app_calls';
import { Dashboard } from './components/user/dashboard/dashboards';
import { AuthUserRoute } from './components/helpers';
import Forum from './components/user/dashboard/forum';
import SweetAlert from 'react-bootstrap-sweetalert';
import SinglePost from './components/user/dashboard/single_post';
import Report from './components/user/dashboard/report';
import { ChatRoom } from './components/user/dashboard/chat_utils';

import {addArticle} from "./redux/actions/index";
import { useSelector, useDispatch } from 'react-redux';


function App() {
  const articlesx = useSelector(state => state.articles_store.articles)
  const dispatch = useDispatch()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h1><i>count:</i><b>{articlesx.length}</b></h1>
        <ul>
          {
            articlesx.map((articlesx, key)=>(
              <li key={key}><h1>{articlesx.title}</h1></li>
            ))
          }
        </ul>
        <button
        onClick={()=>{dispatch( addArticle({ title: 'React Redux Tutorial for Beginners', id: 1 }) );}}
        >change</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      
    </div>
  );
}



///////////// Main Component
const Main = () => {

  

  const [cover_loader, setLoader] = useState(true);
  const [app_info, setAppInfo] = useState({});
  const [user_info, setUserInfo] = useState(null);
  const [alertMessage, setAlertMessage] = useState({
      message: "",
      type: "default",
      cb: ()=>{},
      showCancel:true
  });
  
  let clearMessage = ()=>{
    setAlertMessage({
        message: "",
        type: "default",
        cb: ()=>{}
    })
}
let updateMessage = (msg, type, callback = ()=>{clearMessage()}, sCancel= true)=>{
    setAlertMessage({
        message: msg,
        type: type,
        cb: callback,
        showCancel:sCancel,
    })
}
  


  useEffect(()=>{
    getAppInfo();
  },[]);

  useEffect(()=>{
      let cover_span = document.querySelector('#cover_span');
      if  (!cover_span) return;
      if(cover_loader){
          cover_span.className = 'span_style_active';
      }else{
          cover_span.className = 'span_style_inactive';
      }
  },[cover_loader])

  

  let getAppInfo = async ()=>{
          await generalInfo()
          .then((response)=>response.json())
          .then((result)=>{
              setAppInfo(result);
              setLoader(false);
              
          }).catch((e)=>{
            alert(e);
          })
  }

  
  
  return ( 
    <main  style={{backgroundColor:'#efefef',}}>
      <BrowserRouter>
        <Switch>
        <Route path="/" exact >
              <Home
                Link={Link}
              />
            </Route>
            <Route path="/about" >
              <About
                Link={Link}
                about={app_info.about}
              />
            </Route>
            <Route path="/faq" >
              <Faq
                Link={Link}
                faq={app_info.faq}
              />
            </Route>
            <Route path="/policy" >
              <Policy
                Link={Link}
                user={app_info.user_terms}
                pro={app_info.pro_terms}
              />
            </Route>
            <Route path="/partners" >
              <Partners
                Link={Link}
              />
            </Route>
            <Route path="/contact-us" >
              <ContactUs
                Link={Link}
              />
            </Route>
            <Route path="/login" >
              <Login
                Link={Link}
                user_avatars={app_info.user_avatars}
                setLoader={setLoader}
              />
            </Route>

            <Route exact path="/user-dashboard" >
              <AuthUserRoute
                  
                  setMainUserInfo={setUserInfo}
                  setLoader={setLoader}
                  
                 >
                <Dashboard
                  user_info={user_info}
                  setMainUserInfo={setUserInfo}
                  user_avatars={app_info.user_avatars}
                  app_walls={app_info.walls}
                  Link={Link}
                  setLoader={setLoader}
                  updateMessage={updateMessage}
                  clearMessage={clearMessage}
                  
                />
              </AuthUserRoute>
            </Route>

            <Route exact path="/user-dashboard/forum/:id" >
              <AuthUserRoute
                  
                  setMainUserInfo={setUserInfo}
                  setLoader={setLoader}
                  
                 >
                <Forum
                  user_info={user_info}
                  app_walls={app_info.walls}
                  Link={Link}
                  setLoader={setLoader}
                  updateMessage={updateMessage}
                  clearMessage={clearMessage}
                  
                />
              </AuthUserRoute>
            </Route>

            <Route exact path="/user-dashboard/post/:id" >
              <AuthUserRoute
                  
                  setMainUserInfo={setUserInfo}
                  setLoader={setLoader}
                  
                 >
                <SinglePost
                  user_info={user_info}
                  app_walls={app_info.walls}
                  Link={Link}
                  setLoader={setLoader}
                  updateMessage={updateMessage}
                  clearMessage={clearMessage}
                  
                />
              </AuthUserRoute>
            </Route>

            <Route exact path="/user-dashboard/report/:id" >
              <AuthUserRoute
                  
                  setMainUserInfo={setUserInfo}
                  setLoader={setLoader}
                  
                 >
                <Report
                  setLoader={setLoader}
                  reportTypes={app_info.report_types}
                  updateMessage={updateMessage}
                  clearMessage={clearMessage}
                  
                />
              </AuthUserRoute>
            </Route>

            <Route exact path="/user-dashboard/chat/:id" >
              <AuthUserRoute
                  
                  setMainUserInfo={setUserInfo}
                  setLoader={setLoader}
                  
                 >
                <ChatRoom
                  setLoader={setLoader}
                  reportTypes={app_info.report_types}
                  updateMessage={updateMessage}
                  clearMessage={clearMessage}
                  
                />
              </AuthUserRoute>
            </Route>
            {/* <Route path="/about" component={About} />
            <Route path="/shop" component={Shop} /> */}
            <Route component={App} />
        </Switch>
      </BrowserRouter>
      <SweetAlert
          showCancel={alertMessage.showCancel}
          show={alertMessage.message.length>0}
          type={alertMessage.type}
          confirmBtnText="ok"
          cancelBtnText="Cancel"
          title=""
          onConfirm={alertMessage.cb}
          onCancel={clearMessage}
          >
          {alertMessage.message}
      </SweetAlert>
      
    </main>
   );
}
 
// export default Main;
const mapStateToProps = state => {
  return { articlesx: state.articles };
};
export default App;
