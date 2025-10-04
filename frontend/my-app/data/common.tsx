import { Loader } from "@/components/loader/loader"


export interface JwtResponse {
  jwtToken: string;
  expiryDate: Date;
  role:string;
}
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
export const SaveJwt=async (payload:JwtResponse)=>{
   await localStorage.setItem("user",JSON.stringify(payload))
}
export interface LoginPayload {
  email: string;
  password: string;
}
export const loginUser = async (payload: LoginPayload) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {console.log(res)
    throw console.log('Login failed');}
  const data= await res.json();
  const jwtResponse:JwtResponse=data as JwtResponse
   await SaveJwt(jwtResponse);
  return res.json();
};
export const getMeetingList = async (job:number) => {

  const res = await fetch(`${BASE_URL}/meeting/recruiter/${job}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
   
  });

  if (!res.ok) {console.log(res)
    throw console.log('Meeting List');}
  return res.json();
};
export const getWelcome=async()=>{
  const res = await fetch(`${BASE_URL}/user/welcome`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
   
  });
  return res.json();
}
export const logoutUser= async()=>{
  if(checkLogin())
    localStorage.removeItem('user');
}
export const checkLogin=()=>{
    if(localStorage.getItem('user')==null)
        false;
    else{
        const storedUser=localStorage.getItem('user');
        const user:JwtResponse|undefined=storedUser?JSON.parse(storedUser):undefined;
        const  expiry = user?new Date(user.expiryDate):undefined;
        const now = Date.now() / 1000;
        if((expiry?(now-expiry.getTime()/1000<=5*60*60):false))
            return true;
        return false;
    }
}
export const checkRole=()=>{
    const storedUser=localStorage.getItem('user');
    const user:JwtResponse|undefined=storedUser?JSON.parse(storedUser):undefined;
    return user?user.role:undefined;
     
}

export const extractToken=()=>{
    const storedUser=localStorage.getItem('user');
    const user:JwtResponse|undefined=storedUser?JSON.parse(storedUser):undefined;
    return user?user.jwtToken:undefined;

}
export  const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

 
export interface JobPayload{
  jobTitle:string;
  jobDescription:string;
  skills:string;
  type:string;
  location:string;
  deadline:string|undefined;
  stipend:string,
  status:string
}
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page number (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}
export function base64ToBlobUrl(base64: string, mimeType = "application/pdf") {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length).fill(0).map((_, j) => slice.charCodeAt(j));
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  const blob = new Blob(byteArrays, { type: mimeType });
  return URL.createObjectURL(blob);
}
export function DataLoader(){
  return(<>
    <div className="flex items-center space-x-3">
              <Loader variant="spinner" size="lg" />
              <span>Loading...</span>
            </div>
  </>)
}