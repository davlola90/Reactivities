import React,{useState, useContext, useEffect} from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity, IActivityFormValues } from '../../../app/models/Activity'

import ActivityStore from'../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import {Form as FinalForm,Field} from'react-final-form'
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { commbineDateAndTime } from '../../../app/common/utils/util';


interface DetailParm{
   id:string; 
}

const ActivityForm:React.FC<RouteComponentProps<DetailParm>> = ({match,history}) => {
   
        const activityStore = useContext(ActivityStore);
        const{createActivity,editActivity,submitting,selectedActivity,loadActivity,clearActivity} = activityStore;

   const[activity,setActivity]=useState<IActivityFormValues>({
    id:undefined,
    title:'',
    category:'',
    description:'',
    date:undefined,
    time:undefined,
    city:'',
    venue:''
});
useEffect(()=>{
    if(match.params.id && activity.id){
        loadActivity(match.params.id)
        .then(()=>selectedActivity&&setActivity(selectedActivity));
    }
    return () =>{
        clearActivity()
    }
            },[loadActivity,clearActivity,match.params.id,selectedActivity,activity.id])

  //const handelInputChange = (event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)  => {
     //  setActivity({...activity,[event.currentTarget.name]:event.currentTarget.value})
 //  }
   
/*const handelSubmit=()=>{
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
}*/

const handelFinalFormSubmit = (values:any)=>{
    const dateAndTime = commbineDateAndTime(values.date,values.time)
  
   const{date,time,...activity}=values;
   activity.date=dateAndTime;
    console.log(activity);
};

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <FinalForm
                onSubmit={handelFinalFormSubmit}
                render={({handleSubmit}) => (
                    <Form onSubmit={handleSubmit}>
                    <Field 
                    placeholder='Title'
                     name='title'
                      value={activity.title}
                      component={TextInput}
                      />

                    <Field 
                    placeholder='Description' 
                    name='description' 
                     rows={3}
                      component={TextAreaInput}/>
                    <Field
                     placeholder='Category'
                     value={activity.category}
                      name='category' 
                      component={SelectInput}
                      options={category}
                     />
                     <Form.Group widths='equal'>
                     <Field
                   
                   placeholder='Date'
                    value={activity.date} 
                    component={DateInput}
                    name='date'
                    date={true} 
                    />
                      <Field
                   
                   placeholder='Time'
                    value={activity.time} 
                    component={DateInput}
                    name='time' 
                    time={true}
                    />
                     </Form.Group>
                  
                    <Field
                    placeholder='City'
                     value={activity.city} 
                     component={TextInput}
                   
                     name='city' 
                    />
                    <Field
                     placeholder='Venue'
                     value={activity.venue} 
                     component={TextInput}
                     name='venue' 
                    />
                    <Button loading={submitting} floated='right' positive type='submit' content='Submit'/>
                    <Button floated='right'  type='button' content='Cancel' onClick={()=>history.push('/activities')}/>
     
                    
                </Form>

                )}
                
                
                />
          
       </Segment>
            </Grid.Column>
        </Grid>
     
    )
}

export default observer(ActivityForm) ;
