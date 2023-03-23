<script lang="ts">
  export let currentRoute: CurrentRoute;

  import { Route } from "svelte-router-spa";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
</script>

<main class="d-flex vh-100 justify-content-center align-items-center">
  <Route {currentRoute}/>
</main>
