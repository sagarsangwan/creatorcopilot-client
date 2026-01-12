import { 
  ContentDetailSchema, 
  GetPostDetailsApiV1ContentPostsContentIdGetData 
} from '@/src/api-client/content-service';

/**
 * Reusable function to fetch posts with strict OpenAPI types
 */
export const fetchPostById = async (
  token: string, 
  content_id:string,
  options: GetPostDetailsApiV1ContentPostsContentIdGetData['query'] = {  job_type:""}
): Promise<ContentDetailSchema> => {
  
  const requestConfig: GetPostDetailsApiV1ContentPostsContentIdGetData = {
    url:"/api/v1/content/posts/{content_id}/",
    path:{
        content_id:content_id
    },
    query: options
  } as const;
  const bUrl = requestConfig.url
  const finalUrl = bUrl.replace("{content_id}", content_id);

  const params = new URLSearchParams();
if (options?.job_type) {
    params.append("job_type", options.job_type);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${finalUrl}?${params}`,
    
    {
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
