const routes = [
  {
    path: "/component",
    component: () => import("layouts/SingleComponentLayout.vue"),
    children: [
      {
        path: "PyRobotSim",
        component: () => import("components/PyRobotSimCM.vue"),
      },
      {
        path: "numRepr",
        component: () => import("components/NumberRepresentation.vue"),
      },
      // {
      //   path: "PyListsAsCards",
      //   component: () => import("components/PyListsAsCards.vue"),
      // },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
