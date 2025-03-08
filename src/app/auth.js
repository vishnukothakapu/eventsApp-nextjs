import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./utils/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from 'next-auth/providers/google'
import user from "./utils/models/User";
export const 
{auth,
  signIn,
  signOut,
  handlers: { GET, POST } } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error("No user found with this email.");
            return null;
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
        };
      },
    }),
      GoogleProvider({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      })
  ],
  secret: process.env.SECRET_KEY,
  callbacks: {
    async signIn({account,profile}){
      if(account.provider==='google'){
        try {
          const user = await User.findOne({ email: profile.email });
          if (!user) {
            await User.create({
              name: profile.name,
              email: profile.email,
              googleId:profile.sub,
              profilePic:profile.picture,
              isVerified:true,
            });
          }
          account.id = user._id.toString();
        }

        catch(err){
          console.error("Error saving Google user:",err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user,account,profile }) {
      console.log("JWT Callback Triggered");
      console.log("Incoming Token:", token);
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);
      if(account?.provider==="google"&&profile){
        const dbUser = await User.findOne({ email: profile.email });
        if (dbUser) {
          token.id=dbUser._id.toString();
          token.name=dbUser.name;
          token.email=dbUser.email;
          token.profilePic=dbUser.profilePic;
        }
      }
      else if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profilePic = user.profilePic;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        profilePic: token.profilePic,
      };
      console.log("Session:", session);
      return session;
    },
  },
  session:{
    strategy:"jwt",
  },
});

