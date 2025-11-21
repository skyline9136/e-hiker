import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import FillVcs from "../views/FillVcs.vue";
import TeamCreation from "../views/TeamCreation.vue";
import TeamJoin from "../views/TeamJoin.vue";
import EntryVerification from "../views/EntryVerification.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/fill-vcs",
    name: "FillVcs",
    component: FillVcs,
  },
  {
    path: "/team-creation",
    name: "TeamCreation",
    component: TeamCreation,
  },
  {
    path: "/team-join",
    name: "TeamJoin",
    component: TeamJoin,
  },
  {
    path: "/entry-verification",
    name: "EntryVerification",
    component: EntryVerification,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
