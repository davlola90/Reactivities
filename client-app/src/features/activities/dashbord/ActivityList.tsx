import React, { useContext, Fragment } from 'react'

import {  Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
//import ActivityStore from'../../../app/stores/activityStore';

import ActivityListItem from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import {format} from 'date-fns'

/*interface IProps{
   
    handelDeleteActivities:(event:SyntheticEvent<HTMLButtonElement> ,id:string)=>void;
    submitting:boolean;
    target:string;
}*/
const ActivityList: React.FC = ({/*handelDeleteActivities,submitting,target*/}) => {

  const rootStore = useContext(RootStoreContext);
  const {activitiesByDate} = rootStore.activityStore;
  
  

    return (

      <Fragment>
        {activitiesByDate.map(([group,activities])=>(
 <Fragment>
<Label size='large' color='blue'>
  {format(group,'eeee do MMMM')}
</Label>

        <Item.Group divided>
            {activities.map(activity =>(
          <ActivityListItem  key={activity.id} activity={activity}/>
            ))}
    
  </Item.Group>
  
 </Fragment>
        ))}
       
      </Fragment>
        
    )
}

export default observer(ActivityList) ;
