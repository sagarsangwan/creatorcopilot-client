"use server"
import { auth } from "@/lib/auth";
import { cookies } from "next/headers"
export async function fetchPosts({page=1, limit=3}:{page:number, limit:number}){
    // const cookieStore =  await cookies()
    // const token = cookieStore.get("authjs.session-token")?.value
    // console.log(cookieStore, token)
    const session = await auth()
    console.log(session?.access_token, "assssssssss")
    const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      cache: "no-store", 
    }
    );
    if (!res.ok){
        console.log("errorrrrrrrrrrrr")
        // throw new Error("failed to fetch error")

        return []
    }
    const data = res.json()
    console.log(data)
    return data

}