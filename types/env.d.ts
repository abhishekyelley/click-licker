declare namespace NodeJS {
  interface ProcessEnv {
    SENDGRID_API_KEY: string;
    SUPABASE_AUTH_GITHUB_CLIENT_ID: string;
    SUPABASE_AUTH_GITHUB_SECRET: string;
    SENDGRID_EMAIL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SITE_URL: string;
  }
}
