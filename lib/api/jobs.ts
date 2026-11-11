
export const getJobs = async (query = '') => {
   try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?${query}`)
        if(!res.ok){
            return[];
        }
        return res.json()
   }catch(error){
    console.log("getJobs error", error);
    return[]
   }
}