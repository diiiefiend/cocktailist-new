<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import { createAccount, login, logout } from '../api.js';
import { useAuthStore } from '../stores/auth.js';

import router from '../router/index.js';
import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import { checkRequiredFields } from '../utils.js';

const authStore = useAuthStore();

const isSubmitting = ref(false);
const errors: Ref<string[]> = ref([]);

const isUserLoggedIn = authStore.checkIsUserLoggedIn();
const mode: Ref<'Create Account' | 'Login'> = ref('Login');

const payload = ref({
  username: null,
  password: null,
  email: null,
});

function reset() {
  payload.value = {
    username: null,
    password: null,
    email: null,
  };

  errors.value = [];
}

function getOtherMode() {
  return mode.value === 'Create Account' ? 'Login' : 'Create Account';
}

function switchMode() {
  mode.value = getOtherMode();
  reset();
}

async function onSubmit() {
  errors.value = [];
  isSubmitting.value = true;
  console.log('hello ', payload.value);
  const requiredFields = ['username', 'password'];
  if (mode.value === 'Create Account') {
    requiredFields.push('email');
  }
  errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

  console.log(errors);

  if (!errors.value.length) {
    let response: any;
    try {
      if (mode.value === 'Login') {
        // @ts-ignore
        response = await login(payload.value);
      } else {
        // @ts-ignore
        response = await createAccount(payload.value);
      }

      authStore.$patch((state) => {
        state.isUserLoggedIn = true;
        state.username = response.user.username;
        state.userId = response.user.userId;
      });

      router.push('/lists');
    } catch (e) {
      // @ts-ignore
      errors.value.push(e);
    }
  }

  isSubmitting.value = false;
}

function onCancel() {
  reset();

  router.push('/');
}

onMounted(() => {
  if (isUserLoggedIn.value) {
    router.push('/account');
  }
});
</script>

<template>
  <div v-if="!isUserLoggedIn" id="login">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary" @click="switchMode">
          {{ getOtherMode() }}
        </button>
      </div>
    </context-menu>
    <layout-container>
      <grid-box :width="6" :startCol="3" :applyBoxStyle="true" class="bar-details-box">
        <h1>{{ mode }}</h1>
        <form @submit.prevent>
          <fieldset>
            <label>Username</label>
            <input type="text" v-model="payload.username" />
          </fieldset>
          <fieldset v-if="mode == 'Create Account'">
            <label>Email</label>
            <input type="text" v-model="payload.email" />
          </fieldset>
          <fieldset>
            <label>Password</label>
            <input type="password" v-model="payload.password" />
          </fieldset>
        </form>
        <div v-if="errors.length" class="form-error">
          Please see the following error(s):
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="footer">
          <button type="submit" class="primary" @click.stop="onSubmit" :disabled="isSubmitting">
            {{ mode }}
          </button>
          <button type="reset" class="cancel" @click.stop="onCancel">Cancel</button>
        </div>
      </grid-box>
    </layout-container>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/login.scss';
</style>
