import Vue from "vue";
import Router from "vue-router";

import { asyncComponent } from "@/utils";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "homepage",
      component: asyncComponent("HomePage.vue"),
    },
    {
      path: "/pokemons/:name",
      name: "pokemon-detail",
      component: asyncComponent("pokemon.vue"),
    },
  ],
});

export default router;
