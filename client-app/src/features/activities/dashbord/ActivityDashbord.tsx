import React, { useContext, useEffect, useState } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";

import ActivityList from "./ActivityList";

import { observer } from "mobx-react-lite";


import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilter";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

const ActivityDashbord: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setpage,
    page,
    totalPage
  } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetnext = () => {
    setLoadingNext(true);
    setpage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetnext}
            hasMore={!loadingNext && page + 1 < totalPage}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashbord);
