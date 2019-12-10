import React, { useContext, useEffect } from 'react'
import {  Grid } from 'semantic-ui-react'

import ActivityStore from'../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingCompenent from '../../../app/layout/LoadingCompenent';

import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedinfo from './ActivityDetailedinfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';



/*interface IProps{
  
  setEditMode:(editMode:boolean)=>void;
  setSelectedActivity:(activity: IActivity|null)=>void;
}*/

interface DetailsParams{
  id:string
}

const ActivityDetails:React.FC<RouteComponentProps<DetailsParams>> = ({match,history}) => {

  const activityStore = useContext(ActivityStore);
  const {selectedActivity,loadActivity,loadingInitial}=activityStore;

  useEffect(()=>{
loadActivity(match.params.id);
  },[loadActivity,match.params.id,history]);
 
  if(loadingInitial ) {
    return <LoadingCompenent content='Loading Activity' />;}

  if(!selectedActivity) {return <h1>Not Found</h1>;}
 
    return (
      <Grid>
        <Grid.Column width={10}>
<ActivityDetailedHeader selectedActivity={selectedActivity}/>
<ActivityDetailedinfo selectedActivity={selectedActivity} />
<ActivityDetailedChat/>
        </Grid.Column>
        <Grid.Column width={6}>
<ActivityDetailedSidebar/>
        </Grid.Column>
      </Grid>
    )
}

export default observer(ActivityDetails) ;
