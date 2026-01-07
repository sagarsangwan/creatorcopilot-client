import NextAuth, {type DefaultSession, type NextAuthConfig} from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import axios, {AxiosError} from "axios";
import { BackendTokenRefreshResponse, BackendUser } from "@/app/types/backend-response/auth-response";
// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = ():number =>  Math.floor(new Date().getTime() / 1000);


interface BackendAuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
    picture: string;
    emailVerified:string
  };
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    ref?: number;
    user?: BackendAuthResponse["user"]
    error?: string;
  }
}

declare module "next-auth" {
  interface Session {
    access_token?: string;
    error?: string;
    user: BackendAuthResponse["user"];
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
          const response = await axios.post<BackendAuthResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/`,

            {
              token: account.id_token,
              access_token: account.access_token,
            },
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
        const backend = (account as any).backend as BackendAuthResponse
        token.access_token = backend.access
        token.refresh_token = backend.refresh
        token.user = backend.user
        token.ref = getCurrentEpochTime()+BACKEND_ACCESS_TOKEN_LIFETIME
        return token
      }

      // Token refresh
      if (token.ref && getCurrentEpochTime()>token.ref) {
        try {
          const response = await axios.post<BackendTokenRefreshResponse>(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token/refresh/`,
            {
              refresh: token.refresh_token,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response?.data?.access) {
            token.access_token = response.data.access
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