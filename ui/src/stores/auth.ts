import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isUserLoggedIn = ref(checkIsUserLoggedIn());
  const username: Ref<string | null> = ref(null);

  function checkIsUserLoggedIn() {
    const loggedInCookie = document.cookie.match(/^(.*;)?\s*cocktailist.activeSession\s*=\s*[^;]+(.*)?$/);
    return !!loggedInCookie;
  };

  return { isUserLoggedIn, username, checkIsUserLoggedIn, };
})
