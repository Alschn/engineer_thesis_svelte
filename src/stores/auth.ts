import jwtDecode from "jwt-decode";
import { derived, writable } from "svelte/store";

interface JWTContent {
  user_id: number,
  username: string,
  email: string,
  exp: number,
  iat: number,
}

function retrieveUser(token: string | null) {
  if (!token) return null;
  try {
    return jwtDecode<JWTContent>(token);
  } catch (e) {
    return null;
  }
}

export const token = writable<string | null>(localStorage.getItem("access"));

export const auth = derived(
  token,
  (value) => {
    const user = retrieveUser(value);
    const isAuthenticated = !!user;
    return { isAuthenticated, user };
  }
);
