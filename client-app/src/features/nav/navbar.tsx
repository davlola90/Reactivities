import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps{
 
  handelOpenCreateForm:()=>void;
}

export const Navbar:React.FC<IProps> = ({handelOpenCreateForm}) => {
  return (
    <Menu fixed='top' inverted >
      <Container>
      <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
              Reactivities
      </Menu.Item>
      <Menu.Item name="Activities" />
      <Menu.Item >
        <Button positive content="Create Activities" onClick={()=>handelOpenCreateForm()}/>
      </Menu.Item>
      </Container>
      
    </Menu>
  );
};
