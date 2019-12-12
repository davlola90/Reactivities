import React, { useContext } from "react";
import { Segment, Item, Button, Image, Header } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RootStoreContext } from "../../../app/stores/rootStore";

const activityImageStyle = {
  filter: "brightness(30%)"
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white"
};

const ActivityDetailedHeader: React.FC<{ selectedActivity: IActivity }> = ({
  selectedActivity
}) => {
  const rootStore = useContext(RootStoreContext);
  const { attendActivity, cancelAttendance, loading } = rootStore.activityStore;
  return (
    <div>
      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          <Image
            src={`/assets/categoryImages/${selectedActivity.category}.jpg`}
            fluid
            style={activityImageStyle}
          />
          <Segment basic style={activityImageTextStyle}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={selectedActivity.title}
                    style={{ color: "white" }}
                  />
                  <p>{format(selectedActivity.date, "eeee do MMMM")}</p>
                  <p>
                    Hosted by <strong>Bob</strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        <Segment clearing attached="bottom">
          {selectedActivity.isHost ? (
            <Button
              as={Link}
              to={`/manage/${selectedActivity.id}`}
              color="orange"
              floated="right"
            >
              Manage Event
            </Button>
          ) : selectedActivity.isGoing ? (
            <Button onClick={cancelAttendance} loading={loading}>
              Cancel attendance
            </Button>
          ) : (
            <Button color="teal" onClick={attendActivity} loading={loading}>
              Join Activity
            </Button>
          )}
        </Segment>
      </Segment.Group>
    </div>
  );
};

export default observer(ActivityDetailedHeader);
