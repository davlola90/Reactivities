import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStore';
import { observer } from "mobx-react-lite";



 const Navbar:React.FC = () => {
  const activityStore = useContext(ActivityStore);
  //const{editMode,selectedActivity} = activityStore;
  return (
    <Menu fixed='top' inverted >
      <Container>
      <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
              Reactivities
      </Menu.Item>
      <Menu.Item name="Activities" />
      <Menu.Item >
        <Button positive content="Create Activities" onClick={activityStore.openCreateForm}/>
      </Menu.Item>
      </Container>
      
    </Menu>
  );
};
export default observer(Navbar);