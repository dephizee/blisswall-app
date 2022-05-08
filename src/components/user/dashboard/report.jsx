import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  Fragment, useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router';
import { useStateWithLocalStorage } from '../../../network/user/hooks';
import { reportPostCall } from "../../../network/user_calls";


const Report = ({reportTypes, ...props}) => {

    const location = useLocation();
    const history = useHistory();
    const [user_token] = useStateWithLocalStorage("user_token");
    const [backUrl] = useState("/user-dashboard");
    const { from } = location.state || { from: { pathname: backUrl } };

    const [selectId, setSelectId] = useState(null);
    
    let { id } = useParams();

    useEffect(()=>{
        try{
            
        }catch(e){}
    },[props, id]);
    
    let handleReporting = async (event)=>{
        let data = new FormData(event.target);
        event.preventDefault();
        props.setLoader(true);
        await reportPostCall( user_token, id , data )
        .then((response)=>response.json())
        .then((result)=>{
            if (result.status === "success") {
                history.replace(from);
            }
            
            props.setLoader(false);
        })
        
    }

    let goBack = ()=>{
        history.replace(from);
    }

    let hangleOthers = (event)=>{
        setSelectId( event.target.value)
    }

    let renderTextField = ()=>{
        if (selectId !== "0") return <Fragment></Fragment>
        return (
            <div className="my-3">
                <label for="reportta" class="form-label">Write Report</label>
                <textarea class="form-control" id="reportta"  name="cr_content" rows="3" maxLength="1024" required></textarea>
            </div>
        );
    }

    let getAllReport = ()=> (reportTypes||[]).map((report)=>(
        <div key={report.adr_id} className="form-check">
            <input className="form-check-input" type="radio" 
            name="adr_no" value={report.adr_id} onChange={hangleOthers} required/>
            <label className="form-check-label ms-2">
                {report.adr_name}
            </label>
        </div>
        
    ))
   

    return (
        <div className="min-vh-100">
            <nav className=" d-grid gap-1 align-items-center  bg-primary text-light p-2"  style={{gridTemplateColumns: "1fr 4fr"}}>
                
                <FontAwesomeIcon  onClick={goBack}  icon="chevron-left" size="2x" />     
                <h4 className="ps-2">{'Report' || 'loading...'}</h4>
                
            </nav>
            <main>
                <div className="row p-3 px-4">
                    <div className="col-12 bg-white p-3 mt-5" style={{borderRadius:'20px'}}>
                        
                        <form method="post" action="" onSubmit={handleReporting}>
                            {getAllReport()}
                            <div className="form-check">
                                <input className="form-check-input" type="radio" 
                                name="adr_no" value="0"  onChange={hangleOthers} required/>
                                <label className="form-check-label ms-2">
                                    Others
                                </label>
                            </div>
                            <input type="hidden" name="cr_content"/>
                            
                            {renderTextField()}
                            <div className="col-12 form-group my-2 mt-5">
                                <button className="form-control btn btn-primary">Report</button>
                            </div>
                            
                        </form>
                        
                    </div>
                    
                </div>
            </main>
        </div>
    )
}


 

export default Report;   