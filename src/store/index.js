import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const defaultSelectedState = {
  sprites: {
    other: {
      "official-artwork": {
        front_default: "",
      },
    },
  },
  types: [],
  stats: [],
  abilities: [],
};

export const store = new Vuex.Store({
  state: {
    selected: {
      sprites: {
        other: {
          "official-artwork": {
            front_default: "",
          },
        },
      },
      types: [],
      stats: [],
      abilities: [],
    },
    types: [],
  },
  mutations: {
    SET_SELECTED(state, payload) {
      state.selected = payload;
    },
    SET_TYPES(state, payload) {
      state.types = payload;
    },
  },
  actions: {
    setSelected({ commit }, payload) {
      commit("SET_SELECTED", payload);
    },
    setDefaultSelected({ commit }) {
      commit("SET_SELECTED", defaultSelectedState);
    },
    setTypes({ commit }, payload) {
      commit("SET_TYPES", payload);
    },
  },
});
