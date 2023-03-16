<script lang="ts">
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
  import Select from "svelte-select";
  import PostsApi, { type PostsFilters } from "../../api/posts";
  import PostListItem from "../../components/posts/PostListItem.svelte";

  export let currentRoute: CurrentRoute;

  const orderingOptions = [
    { value: "created_at", label: "Created (ascending)" },
    { value: "-created_at", label: "Created (descending)" },
    { value: "updated_at", label: "Updated (ascending)" },
    { value: "-updated_at", label: "Updated (descending)" },
  ];

  let ordering = { value: "-created_at", label: "Created (descending)" };
  let search = "";

  let timer;
  const debounce = (value: string, delay: number = 750) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search = value;
    }, delay);
  };

  let queryParams: PostsFilters;
  $: queryParams = {
    ordering: ordering.value,
    search: search,
  };

  $: query = createInfiniteQuery({
    queryKey: ["posts-feed", queryParams],
    queryFn: ({ queryKey, pageParam = 1 }) => PostsApi.getFeed({
      ...queryKey[1],
      page: pageParam,
      page_size: 10
    } as PostsFilters),
    getNextPageParam: (lastPage) => {
      const nextPage: string | null = lastPage.data.next;
      if (nextPage && nextPage.includes("page=")) {
        const url = new URL(nextPage);
        const page = url.searchParams.get("page");
        const parsed = parseInt(page);
        return !isNaN(parsed) ? parsed : undefined;
      }
      return undefined;
    }
  });

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    if (!$query.hasNextPage || $query.isFetchingNextPage) return;
    $query.fetchNextPage();
  };

  $: posts = $query.data?.pages.flatMap(page => page.data.results) ?? [];
</script>

<svelte:window on:scroll={handleScroll}/>

<div class="d-flex justify-content-between align-items-center mb-3">
  <h1>Your feed</h1>
</div>

<div class="d-flex flex-column flex-md-row gap-3 mb-3">
  <div class="flex-grow-1">
    <label for="search" class="form-label">Search</label>
    <input
      id="search"
      name="search"
      class="form-control"
      placeholder="Type to search..."
      style="height: 42px"
      on:input={(e) => debounce(e.target.value)}
    />
  </div>
  <div>
    <label for="ordering" class="form-label">Ordering</label>
    <Select
      id="ordering"
      name="ordering"
      clearable={false}
      searchable={false}
      showChevron
      items={orderingOptions}
      bind:value={ordering}
    />
  </div>
</div>

{#if $query.isLoading}
  <p>Loading...</p>
{:else if $query.isError}
  <p>Something went wrong...</p>
{:else if $query.isSuccess}
  <div class="d-flex flex-column gap-3">
    {#each posts as post}
      <PostListItem {post}/>
    {/each}
  </div>
  {#if $query.isFetchingNextPage}
    <h4 class="my-2">Loading more...</h4>
  {/if}
  {#if !$query.hasNextPage}
    <h4 class="my-2">No more posts...</h4>
  {/if}
{/if}
