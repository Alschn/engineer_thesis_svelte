<script lang="ts">
  import { Router } from "svelte-router-spa";
  import AuthLayout from "../components/layouts/AuthLayout.svelte";
  import MainLayout from "../components/layouts/MainLayout.svelte";
  import PageNotFound from "../pages/404.svelte";
  import Login from "../pages/auth/Login.svelte";
  import Register from "../pages/auth/Register.svelte";
  import PostsAdd from "../pages/posts/PostsAdd.svelte";
  import PostsDetail from "../pages/posts/PostsDetail.svelte";
  import PostsFeed from "../pages/posts/PostsFeed.svelte";
  import PostsList from "../pages/posts/PostsList.svelte";
  import Profiles from "../pages/profiles/Profiles.svelte";
  import ProfilesDetail from "../pages/profiles/ProfilesDetail.svelte";
  import { auth } from "../stores/auth";

  const isAuthenticatedGuard = () => $auth.isAuthenticated;
  const isNotAuthenticatedGuard = () => !$auth.isAuthenticated;

  const onlyIfAuthenticated = {
    guard: isAuthenticatedGuard,
    redirect: '/auth/login'
  };

  const routes = [
    {
      name: "/",
      redirectTo: "/posts"
    },
    {
      name: "auth",
      component: AuthLayout,
      nestedRoutes: [
        {
          name: "login",
          component: Login
        },
        {
          name: "register",
          component: Register,
          onlyIf: { guard: isNotAuthenticatedGuard, redirect: '/posts' }
        }
      ]
    },
    {
      name: "posts",
      component: MainLayout,
      nestedRoutes: [
        {
          name: "index",
          component: PostsList
        },
        {
          name: "/add",
          component: PostsAdd,
          onlyIf: onlyIfAuthenticated,
        },
        {
          name: "/feed",
          component: PostsFeed,
          onlyIf: onlyIfAuthenticated,
        },
        {
          name: "/:post_slug",
          component: PostsDetail
        },

      ]
    },
    {
      name: "profiles",
      component: MainLayout,
      nestedRoutes: [
        {
          name: "index",
          component: Profiles
        },
        {
          name: "/:username",
          component: ProfilesDetail
        }
      ]
    },
    {
      name: '404',
      path: '404',
      component: PageNotFound
    }
  ];
</script>

<Router {routes}/>
