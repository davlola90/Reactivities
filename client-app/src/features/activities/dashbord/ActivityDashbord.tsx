import React, {  useContext } from 'react'
import { Grid} from 'semantic-ui-react'

import ActivityList from './ActivityList'
import ActivityDetails from '../Details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore';

const ActivityDashbord: React.FC = () => {

    const activityStore = useContext(ActivityStore);
    const{editMode,selectedActivity} = activityStore;
    return (
        <Grid>
            <Grid.Column width={10}> 
            <ActivityList  /*handelDeleteActivities={handelDeleteActivities} submitting={submitting} target={target}*/ />
         
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&(
                <ActivityDetails  /*setEditMode={setEditMode} setSelectedActivity={setSelectedActivity} *//>
                )}
              {editMode&&  <ActivityForm key={selectedActivity && selectedActivity.id|| 0}
             /* setEditMode={setEditMode} */selectedActivity={selectedActivity!}  /*handelEditActivities={handelEditActivities} submitting={submitting}*//>} 
              
            </Grid.Column>
            </Grid>        
            
            
    )
}

export default  observer(ActivityDashbord);

