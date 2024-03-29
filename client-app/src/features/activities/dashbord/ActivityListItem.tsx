import React from "react";
import { Item, Button, Segment, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { IActivity } from "../../../app/models/Activity";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const host = activity.attendees.filter(x => x.isHost)[0];

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || "/assets/user.png"}
              style={{ marginBottom: 3 }}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>

              <Item.Description>
                Hosted By
                <Link to={`/profile/${host.userName}`}> {host.displayname}</Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this Activity"
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are going to  this Activity"
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date, "h:mm a")}
        <Icon name="marker" />
        {activity.venue}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          /*   onClick={(e)=>selectActivity(activity.id)} */
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
