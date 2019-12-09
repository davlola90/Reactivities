import React,{Fragment} from 'react';



import {Container } from 'semantic-ui-react';
//import{IActivity} from '../models/Activity';
import Navbar  from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';


import {observer} from 'mobx-react-lite';
import { Route,withRouter, RouteComponentProps } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/Details/ActivityDetails';

const App:React.FC<RouteComponentProps> = ({location} ) =>  {


 
    return (
      <Fragment >
         <Route exact path='/' component={HomePage}/>
         <Route path={'/(.+)'} render={()=>(
           <Fragment>
             <Navbar />
              <Container style={{marginTop : '7em'}}>



               <Route exact path='/activities' component={ActivityDashbord}/>
                <Route path='/activities/:id' component={ActivityDetails}/>
                <Route key={location.key} path={['/createActivity','/manage/:id']} component={ActivityForm}/>


   
   </Container>
           </Fragment>
  
         )}/>
     
 
         
       
      </Fragment>
    );
  }
 


export default withRouter(observer(App)) ;
