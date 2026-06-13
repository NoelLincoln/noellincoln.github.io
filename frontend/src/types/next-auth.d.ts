import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    isStaff?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    isStaff?: boolean;
    error?: string;
  }
}
