<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import Select from "svelte-select";
  import PostsApi, { type PostFiltersEventDetail, type PostsFilters } from "../../api/posts";
  import PostsFiltersModal from "../../components/modals/PostsFiltersModal.svelte";
  import Pagination from "../../components/pagination/Pagination.svelte";
  import PostListItem from "../../components/posts/PostListItem.svelte";
  import PostListItemSkeleton from "../../components/skeletons/PostListItemSkeleton.svelte";

  const pageSizes = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 1000, label: 1000 }
  ] as const;

  const orderingOptions = [
    { value: "created_at", label: "Created (ascending)" },
    { value: "-created_at", label: "Created (descending)" },
    { value: "updated_at", label: "Updated (ascending)" },
    { value: "-updated_at", label: "Updated (descending)" },
  ] as const;

  let page = 1;
  let pageSize = pageSizes.find(s => s.value === 50)!;
  let ordering = orderingOptions.find(o => o.value === "-created_at")!;
  let search = "";

  let timer: number;
  const debounce = (value: string, delay: number = 750) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search = value;
      page = 1;
    }, delay);
  };

  let isOpenFiltersModal = false;

  let appliedFilters: Partial<PostsFilters> = {};
  let queryParams: PostsFilters;
  $: queryParams = {
    page,
    page_size: pageSize.value,
    ordering: ordering.value,
    search: search,
  };

  $: query = createQuery({
    queryKey: ["posts", queryParams],
    queryFn: ({ queryKey }) => PostsApi.getAll(queryKey[1] as PostsFilters),
  });

  $: posts = $query.data?.data.results ?? [];
  $: total = $query.data?.data.count ?? 0;

  function handleApplyFilters(e: CustomEvent<PostFiltersEventDetail>) {
    const { title, slug, author, tags, created_at__gte, created_at__lte } = e.detail;
    const activeFilters = {
      title__icontains: title,
      slug__icontains: slug,
      author__user__username__icontains: author.join(","),
      tags__tag__icontains: tags.join(","),
      created_at__gte: created_at__gte,
      created_at__lte: created_at__lte,
    };
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(activeFilters).filter(([_, value]) => !!value)
    );
    if (Object.keys(nonEmptyFilters).length) {
      queryParams = {
        ...queryParams,
        ...nonEmptyFilters,
      };
      appliedFilters = nonEmptyFilters as Partial<PostsFilters>;
    } else {
      queryParams = {
        page,
        page_size: pageSize.value,
        ordering: ordering.value,
        search: search,
      };
      appliedFilters = {};
    }
  }
</script>

<div class="d-flex justify-content-between align-items-center mb-3">
  <h1>Explore posts</h1>
  <a href="/posts/add" class="btn btn-primary">Add Post</a>
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
  <div>
    <label for="page_size" class="form-label">Page Size</label>
    <Select
      id="page_size"
      name="page_size"
      clearable={false}
      searchable={false}
      showChevron
      items={pageSizes}
      bind:value={pageSize}
    />
  </div>
</div>

<div class="d-flex justify-content-end mb-3">
  <PostsFiltersModal
    isOpen={isOpenFiltersModal}
    toggle={() => isOpenFiltersModal = !isOpenFiltersModal}
    on:confirm={handleApplyFilters}
  />
  <button
    class="btn btn-outline-primary"
    on:click={() => isOpenFiltersModal = true}
  >
    Open Filters
  </button>
</div>

<section class="row gy-4 mb-3">
  {#if $query.isLoading}
    {#each Array(6) as _, i}
      <div class="col col-md-6 col-xl-4">
        <PostListItemSkeleton/>
      </div>
    {/each}
  {:else if $query.isError}
    <p class="text-danger fw-bold">Something went wrong...</p>
  {:else if $query.isSuccess}
    {#each posts as post (`post-${post.id}`)}
      <article class="col col-md-6 col-xl-4">
        <PostListItem {post}/>
      </article>
    {:else}
      <p class="fw-bold">No posts found...</p>
    {/each}

    {#if total}
      <nav class="card-footer p-0 mb-3">
        <Pagination
          totalItems={total}
          pageSize={pageSize.value}
          currentPage={page}
          on:setPage={(e) => page = e.detail.page}
        />
      </nav>
    {/if}
  {/if}
</section>
