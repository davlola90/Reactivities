import React, { useContext } from "react";
import { Menu, Container, Button, Dropdown,Image } from "semantic-ui-react";

import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";



 const Navbar:React.FC = () => {
 

  const rootStore = useContext(RootStoreContext);
const {logout,user}=rootStore.userStore;

  return (
    <Menu fixed='top' inverted >
      <Container>
      <Menu.Item header as={NavLink} exact to='/'>
          <img src="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
              Reactivities
      </Menu.Item>
      <Menu.Item name="Activities" as={NavLink} to='/activities' />
      <Menu.Item >
        <Button positive content="Create Activities" as={NavLink} to='/createactivity' /*onClick={activityStore.openCreateForm}*/ />
      </Menu.Item>
{user&&
        <Menu.Item position='right'>
          <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
          <Dropdown pointing='top left' text={user.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/username`} text='My profile' icon='user'/>
              <Dropdown.Item text='Logout' icon='power' onClick={logout} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

}

      </Container>
      
    </Menu>
  );
};
export default observer(Navbar);