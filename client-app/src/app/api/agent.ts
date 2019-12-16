import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/Activity';
import {history} from '../..'
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';

axios.defaults.baseURL='http://localhost:5000/api';


axios.interceptors.request.use((config)=>{
    const token = window.localStorage.getItem('jwt');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
},error=>{
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {

    if(error.message ==='Network Error' && !error.response){
        toast.error('Network error - Make sure API is runing')
    }
    
    const{status,data,config,headers} = error.response;
    //console.log(error.message);
   
   if( status === 404){
       history.push('/notFound404');
   }
   if( status === 401 && String(error.response.headers['www-authenticate']).includes('Bearer error="invalid_token')) {
       console.log(error.response.headers['WWW-Authenticate'])
 window.localStorage.removeItem('jwt')
 history.push('/')
 toast.info('Your Session Has Expired Please Log In Agian ')
}


   if(status === 400 && config.method ==='get' && data.errors.hasOwnProperty('id'))
    {
    history.push('/notFound404');
    }
    if(status===500){
        toast.error('Server Error ---cheack the terminal for more Info!!!')
    }
    throw error.response;
})


const responseBody = (response:AxiosResponse)=>response.data;

const sleep=(ms:number)=>(response :AxiosResponse)=>
new Promise<AxiosResponse>(resolve =>setTimeout(()=>resolve(response),ms));

const requests = {
    get:(url:string)=>axios.get(url).then(sleep(1000)).then(responseBody),
    post:(url:string,body:{})=>axios.post(url,body).then(sleep(1000)).then(responseBody),
    put:(url:string,body:{})=>axios.put(url,body).then(sleep(1000)).then(responseBody),
    del:(url:string)=>axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm:(url:string,file: Blob)=>{
        let formDate = new FormData();
        formDate.append('File',file);
        return axios.post(url,formDate,{
            headers:{'Content-type' : 'multipart/form-data'}
        }).then(responseBody)
    }
}


const Activities = {

    list:(params:URLSearchParams):Promise<IActivitiesEnvelope>=>axios.get('/activities',{params:params}).then(sleep(1000)).then(responseBody),
   // requests.get(`/activities?limit=${limit}&offset=${page ? page* limit! : 0}`),
    details:(id:string) => requests.get(`/activities/${id}`),
    create :(activity:IActivity)=>requests.post('/activities',activity),
    update :(activity:IActivity)=>requests.put(`/activities/${activity.id}`,activity),
    delete:(id:string) => requests.del(`/activities/${id}`),
    attend:(id:string)=> requests.post(`/activities/${id}/attend`,{}),
    unattend:(id:string)=> requests.del(`/activities/${id}/attend`)

}



const User = {
    current:() : Promise<IUser> => requests.get('/user'),
    login:(user:IUserFormValues)=>requests.post(`/user/login/`,user),
    register:(user:IUserFormValues)=>requests.post(`/user/register/`,user),
}

const Profile = {
    get:(username:string):Promise<IProfile>=> requests.get(`/profiles/${username}`),
    uploadPhoto:(photo:Blob):Promise<IPhoto>=> requests.postForm(`/photos/`,photo),
    setMainPhoto:(id:string) => requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto:(id:string) => requests.del(`/photos/${id}`),
    updateProfile:(profile:Partial<IProfile>) => requests.put(`/profiles/`,profile),
    follow:(username:string) => requests.post(`/profiles/${username}/follow`,{}),
    unfollow:(username:string) => requests.del(`/profiles/${username}/follow`),
    listFollowings:(username:string , predicate:string)=> requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listActivities : (username:string,predicate:string) => requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
};


export default{Activities,User,Profile}