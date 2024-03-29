import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto, IUserActivity } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";
import PhotoUploadWidget from "../common/photoUpload/PhotoUploadWidget";

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadfollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable profLoding = false;
  @observable activeTab: number = 0;

  @observable followings: IProfile[] = [];

  @observable userActivities : IUserActivity[] = [];
  @observable loadingActivities = false;
  @action loadUserActivities = async (userName:string,predicate?:string)=>
  {
    this.loadingActivities  = true;
    try {
      
      const activities = await agent.Profile.listActivities(userName,predicate!);
      runInAction(() => {
     //   alert(activities)
       // console.log(activities)
        this.userActivities = activities;

        console.log( this.userActivities)
        this.loadingActivities  = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem Loading Activities");
      runInAction(() => {
        this.loadingActivities = false;
      });
    }

  }

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName;
    } else {
      return false;
    }
  }
  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  };

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;

    try {
      const profile = await agent.Profile.get(username);

      runInAction(() => {
        this.loadingProfile = false;
        this.profile = profile;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });

      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;

    try {
      const photo = await agent.Profile.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }

          this.uploadingPhoto = false;
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem Uploading Photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.setMainPhoto(photo.id);
      runInAction(() => {
        this.loading = false;
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(a => a.isMain)!.isMain = false;
        this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
      });
    } catch (error) {
      toast.error("Probleme Setting Photo as Main");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profile.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          a => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Probleme deleting the photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    console.log(profile);
    try {
      await agent.Profile.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error("Probleme updating Profile");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profile.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Probleme following profile");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profile.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Probleme unfollowing profile");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadfollowings = async (predicate: string) => {
    this.loading = true;
    //alert(predicate)
    try {
      const profiles = await agent.Profile.listFollowings(
        this.profile!.userName,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Probleme loading followers");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
