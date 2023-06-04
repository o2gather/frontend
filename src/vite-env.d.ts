/// <reference types="vite/client" />

interface ImportMetaEnv {
	VITE_API_PREFIX: string;
	VITE_GOOGLE_CLIENT_ID: string;
	VITE_GOOGLE_LOGIN_URI: string;
}

interface ImportMeta {
	env: ImportMetaEnv;
}
