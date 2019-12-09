import React,{useState,FormEvent, useContext, useEffect} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import {v4 as uuid} from 'uuid';
import ActivityStore from'../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';


interface DetailParm{
   id:string; 
}

const ActivityForm:React.FC<RouteComponentProps<DetailParm>> = ({match,history}) => {
   
        const activityStore = useContext(ActivityStore);
        const{createActivity,editActivity,submitting,selectedActivity,loadActivity,clearActivity} = activityStore;



      

  /*  const initializeForm = () => {
        if(selectedActivity)
        {
            return selectedActivity;
         }
            else{
 return{
     id:'',
     title:'',
     category:'',
     description:'',
     date:'',
     city:'',
     venue:''
 };
            }
        }*/
    
    
   const[activity,setActivity]=useState<IActivity>({
    id:'',
    title:'',
    category:'',
    description:'',
    date:'',
    city:'',
    venue:''
});
useEffect(()=>{
    if(match.params.id && activity.id.length===0){
        loadActivity(match.params.id)
        .then(()=>selectedActivity&&setActivity(selectedActivity));
    }
    return () =>{
        clearActivity()
    }
            },[loadActivity,clearActivity,match.params.id,selectedActivity,activity.id.length])

   const handelInputChange = (event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)  => {
       setActivity({...activity,[event.currentTarget.name]:event.currentTarget.value})
   }
   
const handelSubmit=()=>{
   if(activity.id.length===0){
      let newActivity={
          ...activity,id:uuid()
      }
      createActivity(newActivity).then(()=>{
          history.push(`/activities/${newActivity.id}`);
      });

   }
   else{
    editActivity(activity).then(()=>{
        history.push(`/activities/${activity.id}`)
    });
   }
}

    return (
       <Segment clearing>
           <Form onSubmit={handelSubmit}>
               <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handelInputChange}/>
               <Form.TextArea rows={2} placeholder='Description' name='description'  value={activity.description} onChange={handelInputChange} />
               <Form.Input placeholder='Category'value={activity.category} name='category' onChange={handelInputChange} />
               <Form.Input type='datetime-local' placeholder='Date' value={activity.date} name='date' onChange={handelInputChange} />
               <Form.Input placeholder='City' value={activity.city} name='city' onChange={handelInputChange}/>
               <Form.Input placeholder='Venue'value={activity.venue} name='venue' onChange={handelInputChange}/>
               <Button loading={submitting} floated='right' positive type='submit' content='Submit'/>
               <Button floated='right'  type='button' content='Cancel' onClick={()=>history.push('/activities')}/>

               
           </Form>
       </Segment>
    )
}

export default observer(ActivityForm) ;
