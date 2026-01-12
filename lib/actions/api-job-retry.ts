import { RetryAiGenerationApiV1ContentJobJobIdPutData,JobRetryResponse } from "@/src/api-client/content-service/types.gen";

/**
 * Reusable function to fetch posts with strict OpenAPI types
 */
export const retryJobById = async (
  token: string, 
  job_id:string,
  options: RetryAiGenerationApiV1ContentJobJobIdPutData['query'] = {  job_type:""}
): Promise<JobRetryResponse> => {
  
  const requestConfig: RetryAiGenerationApiV1ContentJobJobIdPutData = {
    
    url:"/api/v1/content/job/{job_id}/",
    path:{
        job_id:job_id
    },
    query:options
  } as const;
  const bUrl = requestConfig.url
  const finalUrl = bUrl.replace("{job_id}", job_id);

  const params = new URLSearchParams();
if (options?.job_type) {
    params.append("job_type", options.job_type);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${finalUrl}?${params}`,
    
    {
      method:"PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      
    }}
  );

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody?.detail || "Failed to load posts");
  }

  return res.json();
};
