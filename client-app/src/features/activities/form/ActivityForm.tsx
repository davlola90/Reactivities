import React,{useState, useContext, useEffect} from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import {  ActivityFormValues } from '../../../app/models/Activity'

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
import uuid from 'uuid';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';

const validate = combineValidators({
    title:isRequired({message:'The event title is required'}),
    category:isRequired({message:'Category'}),
    description:composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message:'Description needs to be at least 5 characters'})
    )(),
    city:isRequired('City'),
    venue:isRequired('Venue'),
    date:isRequired('Date'),
    time:isRequired('Time')     
})



interface DetailParm{
   id:string; 
}

const ActivityForm:React.FC<RouteComponentProps<DetailParm>> = ({match,history}) => {
   
        const activityStore = useContext(ActivityStore);
        const{createActivity,editActivity,submitting,selectedActivity,loadActivity,clearActivity} = activityStore;

   const[activity,setActivity]=useState(new ActivityFormValues());
   const[loading,setLoading]=useState(false);


useEffect(()=>{
    if(match.params.id){
        setLoading(true);
        loadActivity(match.params.id)
        .then(
            (activity)=>setActivity(new ActivityFormValues(activity))
            ).finally(()=>  setLoading(false));
    }
            },[loadActivity,match.params.id]);

const handelFinalFormSubmit = (values:any)=>{
    const dateAndTime = commbineDateAndTime(values.date,values.time)
  
   const{date,time,...activity}=values;
   activity.date=dateAndTime;
   if(!activity.id){
    let newActivity={
        ...activity,id:uuid()
    }
    createActivity(newActivity);

 }
 else{
  editActivity(activity);
 }
};

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing >
                <FinalForm
                validate={validate}
                initialValues={activity}
                onSubmit={handelFinalFormSubmit}
                render={({handleSubmit,invalid,pristine}) => (
                    <Form onSubmit={handleSubmit} loading={loading}>
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
                    <Button loading={submitting} floated='right' positive type='submit' content='Submit' disabled={loading||invalid||pristine}/>
                    <Button floated='right'  type='button' content='Cancel' onClick={activity.id ? ()=>history.push(`/activities/${activity.id}`) :()=>history.push('/activities')} disabled={loading} />
     
                    
                </Form>

                )}
                
                
                />
          
       </Segment>
            </Grid.Column>
        </Grid>
     
    )
}

export default observer(ActivityForm) ;
