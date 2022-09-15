<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          TEL Intelligent Etch Dashboard
        </q-toolbar-title>
        <q-tabs align="left">
          <q-route-tab to="/" label="Dashboard" />
          <q-route-tab v-if="store.role == 'admin'" to="/audit" label="Login Audit" />
          <q-route-tab v-if="store.role == 'admin'" to="/users" label="User Management" />
        </q-tabs>
        <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
        <q-btn dense flat round icon="account_circle">
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="60px">
                  <q-icon name="account_circle" size="xl" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{store.username}}</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                  @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      class="bg-grey-3"
    >
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered> </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-body1">@Copyright</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, QSpinnerOrbit } from "quasar";
import { useUserStore } from "src/stores/userStore";

const router = useRouter();
const $q = useQuasar();
const store = useUserStore()

const menuList = [
  {
    icon: "inbox",
    label: "Inbox",
    separator: true,
  },
  {
    icon: "send",
    label: "Outbox",
    separator: false,
  },
  {
    icon: "delete",
    label: "Trash",
    separator: false,
  },
  {
    icon: "error",
    label: "Spam",
    separator: true,
  },
  {
    icon: "settings",
    label: "Settings",
    separator: false,
  },
  {
    icon: "feedback",
    label: "Send Feedback",
    separator: false,
  },
  {
    icon: "help",
    iconColor: "primary",
    label: "Help",
    separator: false,
  },
];

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const logout = () => {
  $q.loading.show({
    spinner: QSpinnerOrbit,
    // delay: 2000,
  });

  setTimeout(() => {
    $q.loading.hide();
    router.replace("/login");
  }, 2000);
};
</script>