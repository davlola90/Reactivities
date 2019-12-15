export interface IProfile {
  displayName: string;
  userName: string;
  image: string;
  bio: string;

  photos: IPhoto[];
  following:Boolean;
  followersCount:number;
  followingCount:number;

}

export interface IPhoto {
  id: string;
  url: string;
  isMain: Boolean;
}

export interface IUserActivity{
  id:string;
  title:string;
  category:string;
  date:Date;
}
