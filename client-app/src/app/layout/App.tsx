import React,{useState,useEffect,Fragment, useContext} from 'react';



import {Container } from 'semantic-ui-react';
import{IActivity} from '../models/Activity';
import Navbar  from '../../features/nav/navbar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';

import LoadingCompenent from './LoadingCompenent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';

const App = () =>  {

const activityStore = useContext(ActivityStore);


/*const[activities,setActivities]=useState<IActivity[]>([]);*/
/*const[selectedActivity,setSelectedActivity] = useState<IActivity | null>(null);
const [editMode,setEditMode]=useState(false);

const[loading,setLoading]=useState(true);

const[submitting,setSubmitting]=useState(false);

const[target,setTarget]=useState('');*/

/*const handelSelectActivity =(id:string) => {
  setSelectedActivity(activities.filter(a =>a.id===id)[0])
  setEditMode(false)
}*/

/*const handelOpenCreateForm =()=>{
  setSelectedActivity(null);
  setEditMode(true);
}*/

/*const handelCreateActivity =(activity:IActivity)=>{
setSubmitting(true);
  agent.Activities.create(activity).then(()=>{

    setActivities([...activities,activity])
    setSelectedActivity(activity);
    setEditMode(false);

  }).then(()=>setSubmitting(false))
 
}*/
/*const handelEditActivities=(activity:IActivity)=>{
  setSubmitting(true);
  agent.Activities.update(activity).then(()=>{
    setActivities([...activities.filter(a=>a.id!==activity.id),activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }).then(()=>setSubmitting(false))
 
}*/

/*const handelDeleteActivities=(event:SyntheticEvent<HTMLButtonElement> ,id:string)=>{
  setSubmitting(true);
  setTarget(event.currentTarget.name)
  agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(a=>a.id!==id)]);
  }).then(()=>setSubmitting(false))

}*/

useEffect(()=>{
activityStore.loadActivities();
},[activityStore]);

  if(activityStore.loadingInitial)return<LoadingCompenent content='Loading Activities'/>
    return (
      <Fragment >
        <Navbar />
        <Container style={{marginTop : '7em'}}>
    
         <ActivityDashbord 
         
        /* selectActivity={handelSelectActivity} */
        
       /*  setEditMode={setEditMode}*/
       /*  setSelectedActivity={setSelectedActivity}*/
        
       /*  handelEditActivities={handelEditActivities}*/
      /*   handelDeleteActivities={handelDeleteActivities}
         submitting={submitting}
         target={target}
*/
         />
        </Container>
 
         
       
      </Fragment>
    );
  }
 


export default observer(App) ;
