import React,{useState,useEffect,Fragment} from 'react';


import axios from 'axios';
import { Header, Icon, List, Container } from 'semantic-ui-react';
import{IActivity} from '../models/Activity';
import { Navbar } from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';


const App = () =>  {

const[activities,setActivities]=useState<IActivity[]>([]);
const[selectedActivity,setSelectedActivity] = useState<IActivity | null>(null);


//const

useEffect(()=>{
  axios.get<IActivity[]>('http://localhost:5000/api/Activities')
    .then((response) => {
      
      setActivities(response.data)
     
    });
},[]);

  
    return (
      <Fragment >
        <Navbar/>
        <Container style={{marginTop : '7em'}}>
         <ActivityDashbord activities={activities}/>
        </Container>
 
         
       
      </Fragment>
    );
  }
 


export default App;
