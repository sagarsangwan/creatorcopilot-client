import { 
  ContentListResponse, 
  GetAllPostsApiV1ContentPostsGetData 
} from '@/src/api-client/content-service';

/**
 * Reusable function to fetch posts with strict OpenAPI types
 */
export const fetchPosts = async (
  token: string, 
  options: GetAllPostsApiV1ContentPostsGetData['query'] = { limit: 10, offset: 0 }
): Promise<ContentListResponse> => {
  
  const requestConfig: GetAllPostsApiV1ContentPostsGetData = {
    url: "/api/v1/content/posts",
    query: options
  } as const;

  const params = new URLSearchParams();
  if (requestConfig.query?.limit) params.append("limit", requestConfig.query.limit.toString());
  if (requestConfig.query?.offset) params.append("offset", requestConfig.query.offset.toString());

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${requestConfig.url}?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody?.detail || "Failed to load posts");
  }

  return res.json();
};
