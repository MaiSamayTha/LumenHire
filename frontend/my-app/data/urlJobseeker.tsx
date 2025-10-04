import { JwtResponse, SaveJwt,extractToken ,BASE_URL,JobPayload} from "./common";




 export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role:string;
  skills:Array<string>; 
}

export const jobList=async(page:number)=>{
   const res = await fetch(`${BASE_URL}/jobseeker/getJobs?page=${page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
  });
  if (!res.ok) console.log('could not get JobList');
  return res.json();
}
export const savedJobList=async(page:number)=>{
   const res = await fetch(`${BASE_URL}/jobseeker/getSavedJobs?page=${page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
  });
  if (!res.ok) console.log('could not get JobList');
  return res.json();
}
export const appliedJobList=async(page:number)=>{
   const res = await fetch(`${BASE_URL}/jobseeker/appliedJobs?page=${page}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
  });
  if (!res.ok) console.log('could not get JobList');
  return res.json();
}
export const saveJob=async(jobId:number)=>{
   const res = await fetch(`${BASE_URL}/jobseeker/saveJob?jobId=${jobId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
  });
  if (!res.ok) console.log('could not get JobList');
  return res.json();
}
export const applyJob=async(jobId:number)=>{
   const res = await fetch(`${BASE_URL}/jobseeker/applyJob?jobId=${jobId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
  });
  if (!res.ok) console.log('could not get JobList');
  return res.json();
}


export const loginWelcome = async () => {
  await console.log(extractToken());
  const res = await fetch(`${BASE_URL}/user/welcome`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
    
  });

  if (!res.ok) console.log('Login failed');
  return res.json();
};
  export const getSelf= async()=>{
    const res= await fetch(`${BASE_URL}/jobseeker/self`,{
      method:"GET",
      headers:{'Authorization': `Bearer ${extractToken()}`}
    })
    if (!res.ok) console.log('no self');
    return res.json();
  }
  export const getMeetingByJobseeker = async(page:number)=>{
    const res = await fetch(`${BASE_URL}/jobseeker/meeting?page=${page}`, {
      method:'GET',
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},

    })
    if (!res.ok) console.log('Meeting Failed');
  return res.json();
  }
  export const finaliseMeeting=async(meeting:any)=>{
   const res = await fetch(`${BASE_URL}/meeting/finalise`, {
    method: 'POST',
      headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${extractToken()}`},
    body: JSON.stringify(meeting),
  });
   if (!res.ok) console.log('Meeting Failed');
  return res.json();

}
  export const registerUser = async (payload: RegisterPayload,resume :File) => {
    
    const res = await fetch(`${BASE_URL}/jobseeker/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),

    });
    

    if (!res.ok) console.log('Registration failed');
    const data= await res.json();
    const jwtResponse:JwtResponse=data as JwtResponse
    await SaveJwt(jwtResponse);
   
    await uploadResume(resume);

    return res.json();
  };

export const uploadResume = async (resume :File)=>{
  const formData = new FormData();
  formData.append('resume',resume);
  const res = await fetch(`${BASE_URL}/jobseeker/resume`, {
      method: 'POST',
      headers:{'Authorization': `Bearer ${extractToken()}`},
      body: formData,
    });

    const result = await res.json();
    console.log(result);
}


