import React, { useContext, useEffect } from 'react'
import { Card,Image, Button } from 'semantic-ui-react'

import ActivityStore from'../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingCompenent from '../../../app/layout/LoadingCompenent';
import { Link } from 'react-router-dom';



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
loadActivity(match.params.id)
  },[loadActivity,match.params.id])

  if(loadingInitial || !selectedActivity) return <LoadingCompenent content='Loading Activity' />
    return (
        <Card fluid>
    <Image src={`assets/categoryImages/${selectedActivity!.category}.jpg`} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{selectedActivity!.title}</Card.Header>
      <Card.Meta>
        <span className='date'>{selectedActivity!.date}</span>
      </Card.Meta>
      <Card.Description>
      {selectedActivity!.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
     <Button.Group widths={2} >
         <Button 
        as={Link} to={`/manage/${selectedActivity.id}`}
         basic 
         color='blue' 
         content='Edit'/>
         <Button 
         onClick={()=>history.push('/activities')}  
         basic color='grey' 
         content='Cancel'/>
     </Button.Group>
    </Card.Content>
  </Card>
    )
}

export default observer(ActivityDetails) ;
