import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  function isUserLoggedIn() {
    const loggedInCookie = document.cookie.match(/^(.*;)?\s*cocktailist.activeSession\s*=\s*[^;]+(.*)?$/);
    return !!loggedInCookie;
  };

  return { isUserLoggedIn };
})
