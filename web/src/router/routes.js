const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { role: ["admin", "user"] },
      },
      {
        path: "/audit",
        component: () => import("pages/LoginAudit.vue"),
        meta: { role: ["admin"] },
      },
      {
        path: "/users",
        component: () => import("pages/UserManage.vue"),
        meta: { role: ["admin"] },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("pages/LoginPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
