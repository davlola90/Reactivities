export interface IProfile{
   dislayName:string,

    userName:string,
    image:string,
      bio:string,

      photos:IPhoto[]
}

export interface IPhoto{
    id:string,
    url:string,
    isMain:Boolean
}