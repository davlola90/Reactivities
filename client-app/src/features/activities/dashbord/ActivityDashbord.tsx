import React, { useContext, useEffect } from 'react'
import { Grid} from 'semantic-ui-react'

import ActivityList from './ActivityList'

import { observer } from 'mobx-react-lite'

import ActivityStore from '../../../app/stores/activityStore'
import LoadingCompenent from '../../../app/layout/LoadingCompenent'


const ActivityDashbord: React.FC = () => {
    const activityStore = useContext(ActivityStore);


    useEffect(()=>{
    activityStore.loadActivities();
    },[activityStore]);
    
      if(activityStore.loadingInitial)return<LoadingCompenent content='Loading Activities'/>;

  
    return (
        <Grid>
            <Grid.Column width={10}> 
            <ActivityList  />
         
            </Grid.Column>
            <Grid.Column width={6}>
             
              <h2>
                  Activity Filter
              </h2>
            </Grid.Column>
            </Grid>        
            
            
    )
}

export default  observer(ActivityDashbord);

