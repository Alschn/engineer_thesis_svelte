<script lang="ts">
  import { LightPaginationNav } from "svelte-paginate";

  export let totalItems: number;
  export let pageSize: number;
  export let currentPage: number;
</script>

<LightPaginationNav
  {totalItems}
  {pageSize}
  {currentPage}
  {...$$restProps}
  showStepOptions
  limit={1}
  on:setPage
/>
