import { createStore } from "vuex"

export default createStore({
  state() {
      return {
          yolo: 0 as Number
      }
  },
  mutations: {
      increment (state) {
          state.yolo.count++
      }
  }
})