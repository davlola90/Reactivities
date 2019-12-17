import React from "react";
import FacbookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button, Icon } from "semantic-ui-react";

interface IPorps {
  fbCallback: (response: any) => void;
}

const SocialLogin: React.FC<IPorps> = ({ fbCallback }) => {
  return (
    <div>
      <FacbookLogin
        appId="2198230846944046"
        fields="name,email,picture"
        callback={fbCallback}
        render={(renderProps: any) => (
          <Button
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="facebook"
          >
            <Icon name="facebook" />
            Login with Facebook
          </Button>
        )}
      />
    </div>
  );
};

export default SocialLogin;
