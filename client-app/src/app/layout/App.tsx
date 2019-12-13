import React,{Fragment, useContext,useEffect} from 'react';



import {Container } from 'semantic-ui-react';
//import{IActivity} from '../models/Activity';
import Navbar  from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';


import {observer} from 'mobx-react-lite';
import { Route,withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/Details/ActivityDetails';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';

import { RootStoreContext } from '../stores/rootStore';
import LoadingCompenent from './LoadingCompenent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

const App:React.FC<RouteComponentProps> = ({location} ) =>  {

  const rootStore = useContext(RootStoreContext);
const {setAppLoaded,token,appLoaded}=rootStore.commonStore;
const {getUser} = rootStore.userStore;

useEffect(()=>{
  if(token) {
    getUser().finally(()=> setAppLoaded())
    }else{
      setAppLoaded()
    }
  },[getUser,setAppLoaded,token])



if(!appLoaded) return <LoadingCompenent content='Loading App...'/>
 
    return (
      <Fragment >
        <ModalContainer  />
        <ToastContainer position='bottom-right'/>
         <Route exact path='/' component={HomePage}/>
         <Route path={'/(.+)'} render={()=>(
           <Fragment>
             <Navbar />
              <Container style={{marginTop : '7em'}}>
                <Switch>
                <Route exact path='/activities' component={ActivityDashbord}/>
                <Route path='/activities/:id' component={ActivityDetails}/>
                <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm}/>
                <Route path='/profile/:username' component={ProfilePage}/>
              
                 <Route component={NotFound}/>
                </Switch>



             

   
   </Container>
           </Fragment>
  
         )}/>
     
 
         
       
      </Fragment>
    );
  }
 


export default withRouter(observer(App)) ;
