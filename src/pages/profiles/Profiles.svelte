<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
  import Select from "svelte-select";
  import ProfilesApi, { type ProfilesFilters } from "../../api/profiles";
  import Pagination from "../../components/pagination/Pagination.svelte";
  import ProfileListItem from "../../components/profiles/ProfileListItem.svelte";

  export let currentRoute: CurrentRoute;

  const pageSizes = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ];

  let page = 1;
  let pageSize = { value: 20, label: 20 };
  let search = "";

  let timer: number;
  const debounce = (value: string, delay: number = 750) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search = value;
      page = 1;
    }, delay);
  };

  let queryParams: ProfilesFilters;
  $: queryParams = {
    page,
    page_size: pageSize.value,
    username__icontains: search,
  };

  $: query = createQuery({
    queryKey: ["profiles", queryParams],
    queryFn: ({ queryKey }) => ProfilesApi.getAll(queryKey[1] as ProfilesFilters),
  });

  $: profiles = $query.data?.data.results ?? [];
  $: total = $query.data?.data.count ?? 0;
</script>

<article class="mb-3">
  <header class="d-flex flex-column gap-2 mb-3">
    <h1>Profiles</h1>

    <div class="d-flex gap-2">
      <div class="flex-grow-1">
        <label for="search" class="form-label">Search</label>
        <input
          id="search"
          name="search"
          class="form-control"
          placeholder="Type to search..."
          on:input={(e) => debounce(e.target.value)}
          style:height="42px"
        />
      </div>
      <div>
        <label for="page_size" class="form-label">Page Size</label>
        <Select
          id="page_size"
          name="page_size"
          searchable={false}
          clearable={false}
          showChevron
          bind:value={pageSize}
          items={pageSizes}
        />
      </div>
    </div>
  </header>

  {#if $query.isLoading}
    <div class="d-flex justify-content-center align-items-center" style="height: 100px">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {:else if $query.isError}
    <p class="text-danger fw-bold">Something went wrong...</p>
  {:else if $query.isSuccess}
    <section class="row row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
      {#each profiles as profile (`profile-${profile.id}`)}
        <div class="gy-3">
          <ProfileListItem {profile}/>
        </div>
      {:else}
        <p class="fw-bold">No profiles found.</p>
      {/each}
    </section>
  {/if}

  {#if total}
    <nav class="card-footer p-0">
      <Pagination
        totalItems={total}
        pageSize={pageSize.value}
        currentPage={page}
        on:setPage={(e) => page = e.detail.page}
      />
    </nav>
  {/if}
</article>
