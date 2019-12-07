import React,{useState,useEffect,Fragment} from 'react';


import axios from 'axios';
import {Container } from 'semantic-ui-react';
import{IActivity} from '../models/Activity';
import { Navbar } from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';


const App = () =>  {

const[activities,setActivities]=useState<IActivity[]>([]);
const[selectedActivity,setSelectedActivity] = useState<IActivity | null>(null);
const [editMode,setEditMode]=useState(false);

const handelSelectActivity =(id:string) => {
  setSelectedActivity(activities.filter(a =>a.id===id)[0])
  setEditMode(false)
}

const handelOpenCreateForm =()=>{
  setSelectedActivity(null);
  setEditMode(true);
}

const handelCreateActivity =(activity:IActivity)=>{
  setActivities([...activities,activity])
  setSelectedActivity(activity);
  setEditMode(false);
}
const handelEditActivities=(activity:IActivity)=>{
  setActivities([...activities.filter(a=>a.id!==activity.id),activity])
  setSelectedActivity(activity);
  setEditMode(false);
}

const handelDeleteActivities=(id:string)=>{
setActivities([...activities.filter(a=>a.id!==id)]);
}

useEffect(()=>{
  axios.get<IActivity[]>('http://localhost:5000/api/Activities')
    .then((response) => {
      let activities:IActivity[] = [];
      response.data.forEach(activity=>{
        activity.date=activity.date.split('.')[0];
        activities.push(activity)
      })
      setActivities(activities)
     
    });
},[]);

  
    return (
      <Fragment >
        <Navbar handelOpenCreateForm={handelOpenCreateForm}/>
        <Container style={{marginTop : '7em'}}>
         <ActivityDashbord 
         activities={activities} 
         selectActivity={handelSelectActivity} 
         selectedActivity={selectedActivity!}
         editMode={editMode}
         setEditMode={setEditMode}
         setSelectedActivity={setSelectedActivity}
         handelCreateActivity={handelCreateActivity}
         handelEditActivities={handelEditActivities}
         handelDeleteActivities={handelDeleteActivities}
         />
        </Container>
 
         
       
      </Fragment>
    );
  }
 


export default App;
