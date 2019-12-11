
import {observable,action,computed,configure,runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/Activity';
import agent from '../api/agent';
import {history} from'../..';
import { toast } from 'react-toastify';

configure({enforceActions:'always'});

class ActivityStore{
 @observable activityRegistry = new Map();   

@observable loadingInitial = false;

@observable selectedActivity : IActivity|null=null ;

@observable submitting = false;
@observable target = '';


@computed get activitiesByDate(){
    return this.groupActivitiesbyDate(Array.from(this.activityRegistry.values()));
}

groupActivitiesbyDate(activities:IActivity[]){
const sortedActivities = activities.sort(
    (a,b)=> a.date.getTime()-b.date.getTime()
)
return Object.entries(sortedActivities.reduce((activities,activity)=>{
    const date = activity.date.toISOString().split('T')[0];
    activities[date] = activities[date]?[...activities[date],activity]:[activity];
    return activities;
},{} as {[key:string]:IActivity[]}));
}

@action clearActivity =()=>{
    this.selectedActivity= null;
}

@action loadActivity = async(id:string)=>{
let activity = this.getActivity(id);
if(activity){
    this.selectedActivity=activity;
    return activity;
}else{
   this.loadingInitial=true;
   try{
activity = await agent.Activities.details(id);
runInAction('Getting Activity',()=>{
    activity.date= new Date(activity.date)
    this.selectedActivity=activity;
    this.activityRegistry.set(activity.id,activity);
    this.loadingInitial=false;
})
return activity;
   } catch(error){
       runInAction('Getting Actrivity Error',()=>{

 this.loadingInitial=false;
       })
     // console.log(error);
   }
}

}

getActivity=(id:string)=>{
    return this.activityRegistry.get(id);
}

@action loadActivities = async ()=>{
    this.loadingInitial=true;

    try
    {
      const activities = await agent.Activities.list();
      runInAction('Loading activities',()=>{
        activities.forEach(activity=>{
            activity.date=new Date(activity.date);
            this.activityRegistry.set(activity.id,activity);
      });
     
      //  this.activities.push(activity)
      });
      this.loadingInitial=false;
    }
    catch(error){
      //  console.log(error);
        runInAction('load activities error',()=>{
            this.loadingInitial=false;
        })
     
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
}
@action createActivity = async (activity:IActivity)=>{
this.submitting=true;
try
{
 await agent.Activities.create(activity);
 runInAction('Creating Activity',()=>{
    this.activityRegistry.set(activity.id,activity);
  
     this.submitting=false;
 });
 history.push(`/activities/${activity.id}`);

}
catch(error)
{ runInAction('Create Activity error',()=>{
    this.submitting=false;
})
   toast.error('Probleme submitting data');
   console.log(error);
}
}

@action openCreateForm =()=>{
   // this.editMode=true;
    this.selectedActivity=null;

}

@action selectActivity =(id:string)=>{
    this.selectedActivity=this.activityRegistry.get(id);
  //  this.editMode=false;
}

@action editActivity=async(activity:IActivity)=>{
this.submitting=true;
    try{
        await agent.Activities.update(activity);
        runInAction('Editing Activity',()=>{
            this.activityRegistry.set(activity.id,activity);
            this.selectedActivity=activity;
          
            this.submitting=false;
    
        });
        history.push(`/activities/${activity.id}`);
     
    }
    catch(error){
        runInAction('Edit Activty Error',()=>{
            this.submitting=false;
        })
        toast.error('Probleme submitting data');
       
     //   console.log(error);
    }

}
@action openEditForm = (id:string)=>{
    this.selectedActivity=this.activityRegistry.get(id);
   // this.editMode=true;
}

@action cancelSelectedActivity=()=>{
    this.selectedActivity=null;

}



@action deleteActivity=async (event:SyntheticEvent<HTMLButtonElement> ,id:string)=>{
this.submitting=true;
this.target=event.currentTarget.name;

try{
    await agent.Activities.delete(id);
    runInAction('Deleting Activity',()=>{
        this.activityRegistry.delete(id);
        this.submitting=false;
        this.target='';
    })
 
}
catch(error){
//console.log(error);
runInAction('error deleting Activity',()=>{
    this.submitting=false;
    this.target='';
})

}

}

}


export default createContext(new ActivityStore())