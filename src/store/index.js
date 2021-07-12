import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    pokemon: {
      selected: {}
    }
  },
  mutations: {
    SET_SELECTED(state, payload) {
      state.pokemon.selected = payload;
    }
  },
  actions: {
    setSelected({ commit }, payload) {
      commit("SET_SELECTED", payload);
    }
  }
});
