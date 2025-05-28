import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useManagementAppStore = defineStore('ManagementApp', () => {
  const isAppLoaded = ref(false);
  const isAppOnError = ref(false);
  const displayRadioBox = ref(false);
  const blur = ref(false);
  const openCancelGame = ref(false);
  const openConfirmEndGame = ref(false);
  const computeData = ref(false);

  return { isAppLoaded, isAppOnError, displayRadioBox, blur, openCancelGame, openConfirmEndGame, computeData }
})
