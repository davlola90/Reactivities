import React,{useState,useEffect,Fragment, SyntheticEvent} from 'react';



import {Container } from 'semantic-ui-react';
import{IActivity} from '../models/Activity';
import { Navbar } from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';
import agent from '../api/agent';
import LoadingCompenent from './LoadingCompenent';


const App = () =>  {

const[activities,setActivities]=useState<IActivity[]>([]);
const[selectedActivity,setSelectedActivity] = useState<IActivity | null>(null);
const [editMode,setEditMode]=useState(false);

const[loading,setLoading]=useState(true);

const[submitting,setSubmitting]=useState(false);

const[target,setTarget]=useState('');

const handelSelectActivity =(id:string) => {
  setSelectedActivity(activities.filter(a =>a.id===id)[0])
  setEditMode(false)
}

const handelOpenCreateForm =()=>{
  setSelectedActivity(null);
  setEditMode(true);
}

const handelCreateActivity =(activity:IActivity)=>{
setSubmitting(true);
  agent.Activities.create(activity).then(()=>{

    setActivities([...activities,activity])
    setSelectedActivity(activity);
    setEditMode(false);

  }).then(()=>setSubmitting(false))
 
}
const handelEditActivities=(activity:IActivity)=>{
  setSubmitting(true);
  agent.Activities.update(activity).then(()=>{
    setActivities([...activities.filter(a=>a.id!==activity.id),activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }).then(()=>setSubmitting(false))
 
}

const handelDeleteActivities=(event:SyntheticEvent<HTMLButtonElement> ,id:string)=>{
  setSubmitting(true);
  setTarget(event.currentTarget.name)
  agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(a=>a.id!==id)]);
  }).then(()=>setSubmitting(false))

}

useEffect(()=>{
 agent.Activities.list()
    .then((response) => {
      let activities:IActivity[] = [];
      response.forEach(activity=>{
        activity.date=activity.date.split('.')[0];
        activities.push(activity)
      })
      setActivities(activities)
     
    }).then(()=>setLoading(false));
},[]);

  if(loading)return<LoadingCompenent content='Loading Activities'/>
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
         submitting={submitting}
         target={target}

         />
        </Container>
 
         
       
      </Fragment>
    );
  }
 


export default App;
