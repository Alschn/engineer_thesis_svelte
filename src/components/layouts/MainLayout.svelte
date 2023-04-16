<script lang="ts">
  import { Route } from "svelte-router-spa";
  import Navbar from "../navbar/Navbar.svelte";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";

  export let currentRoute: CurrentRoute;
</script>

<Navbar/>

<main class="container mt-3">
  <Route {currentRoute}/>
</main>
