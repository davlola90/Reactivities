import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'

const ActivityDetailedinfo : React.FC<{selectedActivity:IActivity}> = ({selectedActivity}) => {
    return (
       <Segment.Group>
             <Segment attached='top'>
               <Grid>
                 <Grid.Column width={1}>
                   <Icon size='large' color='teal' name='info' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                   <p>{selectedActivity.description}</p>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='calendar' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={15}>
                   <span>
                   {selectedActivity.date}
                   </span>
                 </Grid.Column>
               </Grid>
             </Segment>
             <Segment attached>
               <Grid verticalAlign='middle'>
                 <Grid.Column width={1}>
                   <Icon name='marker' size='large' color='teal' />
                 </Grid.Column>
                 <Grid.Column width={11}>
                   <span>{selectedActivity.venue}, {selectedActivity.city}</span>
                 </Grid.Column>
               </Grid>
             </Segment>
           </Segment.Group>
    )
}

export default ActivityDetailedinfo
