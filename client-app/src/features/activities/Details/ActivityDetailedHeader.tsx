import React from 'react'
import { Segment, Item, Button,Image,Header } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';



const activityImageStyle = {
  filter: 'brightness(30%)'
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ActivityDetailedHeader:React.FC<{selectedActivity:IActivity}> = ({selectedActivity}) => {
    return (
        <div>
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} fluid style={activityImageStyle} />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={selectedActivity.title}
                  style={{ color: 'white' }}
                />
                <p>{selectedActivity.date}</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        <Button color='teal'>Join Activity</Button>
        <Button>Cancel attendance</Button>
        <Button as={Link} to={`/manage/${selectedActivity.id}`} color='orange' floated='right'>
          Manage Event
        </Button>
      </Segment>
    </Segment.Group>
        </div>
    )
}

export default observer(ActivityDetailedHeader) ;
