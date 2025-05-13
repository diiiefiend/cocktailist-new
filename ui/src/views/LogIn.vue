<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { login } from '../api.js';
import type {} from '../models.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import { checkRequiredFields } from '../utils.js';

let isLoading = ref(false);
let errors: Ref<string[]> = ref([]);

let isUserLoggedIn = ref(false);

let payload = ref({
  username: null,
  password: null,
});

async function onSubmit() {
  errors.value = [];
  isLoading.value = true;
  console.log('hello ', payload.value);
  errors.value = errors.value.concat(checkRequiredFields(['username', 'password'], payload));

  console.log(errors);

  if (!errors.value.length) {
    try {
      // @ts-ignore
      await login(payload.value);
    } catch (e) {
      // @ts-ignore
      errors.value.push(e);
    }
  }

  isLoading.value = false;
}
</script>

<template>
  <div id="login">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary" :disabled="isUserLoggedIn">Create Account</button>
      </div>
    </context-menu>
    <div v-if="isLoading">LOADING</div>
    <layout-container v-else>
      <grid-box :width="6" :startCol="3" :applyBoxStyle="true" class="bar-details-box">
        <h1>Login</h1>
        <form @submit.prevent>
          <fieldset>
            <label>Username</label>
            <input type="text" v-model="payload.username" />
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
        <button type="submit" class="primary" @click.stop="onSubmit">Login</button>
        <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
      </grid-box>
    </layout-container>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/login.scss';
</style>
