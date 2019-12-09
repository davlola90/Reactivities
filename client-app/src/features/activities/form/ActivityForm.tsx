import React,{useState,FormEvent, useContext} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import {v4 as uuid} from 'uuid';
import ActivityStore from'../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';
interface IProps{
   
   /* setEditMode:(editMode:boolean)=>void;*/
    selectedActivity:IActivity;
   /* handelEditActivities:(activity: IActivity)=>void;*/
    
   
  }
const ActivityForm:React.FC<IProps> = ({selectedActivity,
   /* handelEditActivitiessubmitting*/}) => {
   
        const activityStore = useContext(ActivityStore);
        const{createActivity,editActivity,submitting,cancelFormOpen} = activityStore;

    const initializeForm = () => {
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
        }
    
    
   const[activity,setActivity]=useState<IActivity>(initializeForm);

   const handelInputChange = (event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)  => {
       setActivity({...activity,[event.currentTarget.name]:event.currentTarget.value})
   }
   
const handelSubmit=()=>{
   if(activity.id.length===0){
      let newActivity={
          ...activity,id:uuid()
      }
      createActivity(newActivity);

   }
   else{
    editActivity(activity);
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
               <Button floated='right'  type='button' content='Cancel' onClick={cancelFormOpen}/>

               
           </Form>
       </Segment>
    )
}

export default observer(ActivityForm) ;
