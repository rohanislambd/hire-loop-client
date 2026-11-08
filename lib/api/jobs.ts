
export const getJobs = async () => {
   try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`)
        if(!res.ok){
            return[];
        }
        return res.json()
   }catch(error){
    console.log("getJobs error", error);
    return[]
   }
}