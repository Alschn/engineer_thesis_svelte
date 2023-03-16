<script lang="ts">
  export let currentRoute;

  import { Route } from "svelte-router-spa";
  import Navbar from "../navbar/Navbar.svelte";
</script>

<Navbar/>

<main class="container mt-3">
  <Route {currentRoute}/>
</main>
