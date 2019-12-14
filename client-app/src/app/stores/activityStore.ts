import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/Activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/utils/util";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();

  @observable loadingInitial = false;

  @observable selectedActivity: IActivity | null = null;

  @observable submitting = false;
  @observable target = "";

  @observable loading = false;

  @observable.ref hubConnection: HubConnection | null = null;

  @action createHubConnection = (activityId:string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(()=>this.hubConnection!.invoke('AddToGroup',activityId))
      .catch(error =>
        console.log("error establishing connection :", console.error)
      );


      this.hubConnection.on('ReceiveComment',comment=>{
        console.log(comment)
        runInAction(()=>{
          this.selectedActivity!.comments.push(comment);
        })
       
      })
      this.hubConnection.on('Send',message=>{
        toast.info(message);
      })
  };
@action stopHubConnection = () =>{
  this.hubConnection!.invoke('RemovefromGroup',this.selectedActivity!.id)
  .then(()=>{
    this.hubConnection!.stop();
  })
 .then(()=> console.log('Connection has Stopped '))
 .catch(error=>console.log(error))
}

@action addComment = async (values:any)=>{
  values.activityId=this.selectedActivity!.id;
  try{
    await this.hubConnection!.invoke('SendComment',values)

  }catch(error){
    console.log(error);
  }
}


  @computed get activitiesByDate() {
    return this.groupActivitiesbyDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesbyDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action clearActivity = () => {
    this.selectedActivity = null;
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    const user = this.rootStore.userStore.user!;

    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("Getting Activity", () => {
          setActivityProps(activity, user!);
          console.log("Aymen Toukabri");
          console.log(activity);
          console.log(user);
          console.log(user.userName);
          console.log("useruseruseruseruser");
          this.selectedActivity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("Getting Actrivity Error", () => {
          this.loadingInitial = false;
        });
        // console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    const user = this.rootStore.userStore.user!;

    try {
      const activities = await agent.Activities.list();
      runInAction("Loading activities", () => {
        activities.forEach(activity => {
          setActivityProps(activity, user);
          this.activityRegistry.set(activity.id, activity);
        });

        //  this.activities.push(activity)
      });
      this.loadingInitial = false;
    } catch (error) {
      //  console.log(error);
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
    }
    /*agent.Activities.list()
    .then(activities => {
    
        activities.forEach(activity=>{
        activity.date=activity.date.split('.')[0];
        this.activities.push(activity)
      })
     
     
    })
    .catch(error=> console.log(error))
    .finally(()=>this.loadingInitial=false);*/
  };
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments=[];
      activity.isHost = true;
      runInAction("Creating Activity", () => {
        this.activityRegistry.set(activity.id, activity);

        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Create Activity error", () => {
        this.submitting = false;
      });
      toast.error("Probleme submitting data");
      console.log(error);
    }
  };

  @action openCreateForm = () => {
    // this.editMode=true;
    this.selectedActivity = null;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    //  this.editMode=false;
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("Editing Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;

        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Edit Activty Error", () => {
        this.submitting = false;
      });
      toast.error("Probleme submitting data");

      //   console.log(error);
    }
  };
  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    // this.editMode=true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = null;
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.Activities.delete(id);
      runInAction("Deleting Activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      //console.log(error);
      runInAction("error deleting Activity", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees.push(attendee);
          this.selectedActivity.isGoing = true;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        toast.error("Problem signing up to activity");
      });
    }
  };
  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity) {
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            a => a.userName !== this.rootStore.userStore.user!.userName
          );

          this.selectedActivity.isGoing = false;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling attendance");
    }
  };
}
