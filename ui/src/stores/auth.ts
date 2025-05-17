import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isUserLoggedIn = ref(false);
  const username: Ref<string | null> = ref(null);
  const userId: Ref<number | null> = ref(null);

  function checkIsUserLoggedIn() {
    const matchedCookies = document.cookie.match(/cocktailist.activeSession\s*=\s*username%3A([^%]*)?%3Bid%3A(\d*)?;*/);
    const isActive = !!matchedCookies;
    isUserLoggedIn.value = isActive;

    if(isActive) {
      username.value = matchedCookies[1];
      userId.value = +matchedCookies[2];
    }
    
    return isActive;
  };

  return { isUserLoggedIn, username, userId, checkIsUserLoggedIn, };
});