import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import LoadingCompenent from "../../app/layout/LoadingCompenent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  username: string;
}
interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile,follow,unfollow,isCurrentUser,loading,setActiveTab } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match]);

  if (loadingProfile) return <LoadingCompenent content="Loading Profile" />;
  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} loading={loading} follow={follow} unfollow={unfollow}/>
        <ProfileContent setActiveTab={setActiveTab}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage) ;
