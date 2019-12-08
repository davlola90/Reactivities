import React, { SyntheticEvent } from 'react'
import { Grid} from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import ActivityList from './ActivityList'
import ActivityDetails from '../Details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'

interface IProps{
    activities:IActivity[];
    selectActivity:(id:string)=>void;
    selectedActivity:IActivity;
    editMode:boolean;
    setEditMode:(editMode:boolean)=>void;
    setSelectedActivity:(activity: IActivity|null)=>void;
    handelEditActivities:(activity: IActivity)=>void;
    handelCreateActivity:(activity: IActivity)=>void;
    handelDeleteActivities:(event:SyntheticEvent<HTMLButtonElement> , id:string)=>void;
    submitting:boolean;
    target:string;
}

const ActivityDashbord: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    editMode,
    setEditMode,
    setSelectedActivity,
    handelCreateActivity,
    handelEditActivities,
    handelDeleteActivities,
    submitting,
    target

}) => {
    return (
        <Grid>
            <Grid.Column width={10}> 
            <ActivityList activities={activities} selectActivity={selectActivity} handelDeleteActivities={handelDeleteActivities} submitting={submitting} target={target}/>
         
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&(
                <ActivityDetails selectedActivity={selectedActivity} setEditMode={setEditMode} setSelectedActivity={setSelectedActivity} />
                )}
              {editMode&&  <ActivityForm key={selectedActivity && selectedActivity.id|| 0}
              setEditMode={setEditMode} selectedActivity={selectedActivity!} handelCreateActivity={handelCreateActivity} handelEditActivities={handelEditActivities} submitting={submitting}/>} 
              
            </Grid.Column>
            </Grid>        
            
            
    )
}

export default ActivityDashbord

