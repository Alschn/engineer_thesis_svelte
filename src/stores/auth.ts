import jwtDecode from "jwt-decode";
import { derived, writable } from "svelte/store";

interface JWTContent {
  user_id: number,
  username: string,
  email: string,
  exp: number,
  iat: number,
}

export const token = writable<string | null>(localStorage.getItem("access"));

export const auth = derived(
  token,
  ($token) => {
    let tokenNonEmpty = !!$token;
    let tokenData: JWTContent | null;

    try {
      tokenData = tokenNonEmpty ? jwtDecode<JWTContent>($token!) : null;
    } catch (e) {
      tokenData = null;
    }

    return {
      isAuthenticated: tokenNonEmpty,
      user: tokenData
    };
  }
);
