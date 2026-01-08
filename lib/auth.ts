import NextAuth, {type DefaultSession, type NextAuthConfig} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import axios, {AxiosError} from "axios";
// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days
import { GoogleLoginApiV1AuthGooglePostData, TokenRefreshRequest, TokenRefreshApiV1AuthTokenRefreshPostData, TokenResponse, UserResponse , GoogleLoginRequest, TokenRefreshResponse, TokenRefreshApiV1AuthTokenRefreshPostError} from "@/src/api-client/auth-service";
const getCurrentEpochTime = ():number =>  Math.floor(new Date().getTime() / 1000);




declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    ref?: number;
    user?: UserResponse
    error?: string;
  }
}

declare module "next-auth" {
  interface Session {
    access_token?: string;
    error?: string;
    user: UserResponse&DefaultSession["user"]
  }
}
const authConfig:NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    // ...
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (!account || account.provider !== "google") {
        return false
      }
        try {
          const responseData:GoogleLoginApiV1AuthGooglePostData = {
            body:<GoogleLoginRequest>{
              token: account.id_token,
              access_token: account.access_token,
            },
            url:"/api/v1/auth/google/"
          } as const
          const response = await axios.post<TokenResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${responseData.url}`,

            responseData?.body,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          (account as any).backend = response.data
          return true;
        } catch (error:unknown) {

          if (axios.isAxiosError(error)){
            console.error(
            "Error during Google sign in:",
            error.response?.data || error.message
          )
          }else{

              console.log(error, "//////////////////////////////////dddddddd");
          }
          return false;
        }
    },
    async jwt({ token, account }) {
      // Initial sign in
      if (account && (account as any).backend) {
        const backend = (account as any).backend as TokenResponse
        token.access_token = backend.access
        token.refresh_token = backend.refresh
        token.user = backend.user
        token.ref = getCurrentEpochTime()+BACKEND_ACCESS_TOKEN_LIFETIME
        return token
      }

      // Token refresh
      if (token.ref && getCurrentEpochTime()>token.ref) {
        try {
          const requestData:TokenRefreshApiV1AuthTokenRefreshPostData = {
            body:<TokenRefreshRequest>{
              refresh: token.refresh_token,
            },
            url:"/api/v1/auth/token/refresh"
          } as const
          const response = await axios.post<TokenRefreshResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${requestData?.url}`,
            requestData?.body,
            
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response?.data?.access
          if (data) {
            token.access_token = data
            token.ref = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
          } else {
            console.log(response, "/////////");
            console.error(
              "Invalid refresh token response format:",
              response.data
            );
            return { ...token, error: "InvalidRefreshResponse" };
          }
        } catch (err) {
            const error  = err as any
            console.log(error)
            
            if (error?.message === "connect ECONNREFUSED 127.0.0.1:8000") {
            return {
              ...token,
              access_token: undefined,
              refresh_token: undefined,
              user: undefined,
              error: "Backend Not Respnsive",
            };
          }

          if (error?.response?.status === 401) {
            return {
              ...token,
              access_token: undefined,
              refresh_token: undefined,
              user: undefined,
              error: "RefreshAccessTokenError",
            };
          }

    return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
        session.access_token = token.access_token;
        session.error = token.error;
        
        
      }
      return session;
    },
  },
  
}
export const {handlers, auth, signIn, signOut } = NextAuth(authConfig)