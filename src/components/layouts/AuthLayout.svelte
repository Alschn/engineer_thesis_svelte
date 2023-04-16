<script lang="ts">
  import { Route } from "svelte-router-spa";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";

  export let currentRoute: CurrentRoute;
</script>

<main class="d-flex vh-100 justify-content-center align-items-center">
  <Route {currentRoute}/>
</main>
