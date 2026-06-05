import ENV from '@/configs/env';
import moment from 'moment';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";

export const useSessionStore = defineStore('session', () => {
  const { cookies } = useCookies();
  const session = ref(moment());

  let timer = null;

  const checkSession = () => {
    const oldSession = cookies.get('session');
    if (!oldSession) {
      return;
    }

    session.value = moment(oldSession);
    return Math.abs(session.value.diff(moment(), 'seconds')) <= ENV.APP_SESSION_EXPIRE_IN;
  }

  const refreshSession = (config) => {
    if (config?.immediate) {
      session.value = moment();
      cookies.set('session', session.value.format('YYYY-MM-DD HH:mm:ss'), moment().add(ENV.APP_SESSION_EXPIRE_IN, 'seconds').toDate())
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      session.value = moment();
      cookies.set('session', session.value.format('YYYY-MM-DD HH:mm:ss'), moment().add(ENV.APP_SESSION_EXPIRE_IN, 'seconds').toDate())
    }, 500);
  }

  return {
    checkSession,
    refreshSession
  }
});
