/// <reference types="vite/client" />
/// <reference types="react" />         
//  // 👈 was "react/jsx-runtime" — this is the fix

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SCRIPT_URL: string;
  readonly VITE_MUSIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}