import React, { useContext, useEffect, useState } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";

import ActivityList from "./ActivityList";

import { observer } from "mobx-react-lite";

import LoadingCompenent from "../../../app/layout/LoadingCompenent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from 'react-infinite-scroller'
import ActivityFilters from "./ActivityFilter";

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
    setpage(page+1);
    loadActivities().then(()=>setLoadingNext(false));

  };
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial&&page===0) return <LoadingCompenent content="Loading Activities" />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <InfiniteScroll
        pageStart={0}
        loadMore={handleGetnext}
        hasMore={!loadingNext && page+1<totalPage}
        initialLoad={false}
        >
        <ActivityList />
        </InfiniteScroll>
        
      
      </Grid.Column>
      <Grid.Column width={6}>
       <ActivityFilters/>
      </Grid.Column>
      <Grid.Column width={10}>
       <Loader active={loadingNext}/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashbord);
