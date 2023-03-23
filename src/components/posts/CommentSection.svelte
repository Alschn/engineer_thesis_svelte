<script lang="ts">
  import { createInfiniteQuery, createMutation } from "@tanstack/svelte-query";
  import { getContext } from "svelte";
  import Select from "svelte-select";
  import { toasts } from "svelte-toasts";
  import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";
  import PostsApi, { type PostCommentsFilters } from "../../api/posts";
  import type { Post } from "../../api/types";
  import CommentAddForm from "../forms/CommentAddForm.svelte";
  import CommentListItem from "./CommentListItem.svelte";

  const { slug: postSlug } = getContext<Post>("post");

  const commentsOrderingItems = [
    { label: "Sort by: Newest", value: "-created_at" },
    { label: "Sort by: Oldest", value: "created_at" },
  ];

  let commentsOrdering = { value: "-created_at", label: "Sort by: Newest" };

  let params: PostCommentsFilters;
  $: params = {
    ordering: commentsOrdering.value
  };

  $: commentsQuery = createInfiniteQuery({
    queryKey: ["posts", postSlug, "comments", params],
    queryFn: ({ queryKey, pageParam = 1 }) => PostsApi.getAllComments(
      queryKey[1] as string, { page: pageParam, ...queryKey[3] as PostCommentsFilters }
    ),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.next;
      if (!nextPage) return undefined;
      const url = new URL(nextPage);
      const parsed = parseInt(url.searchParams.get("page"));
      return !isNaN(parsed) ? parsed : undefined;
    }
  });

  $: comments = $commentsQuery.data?.pages.flatMap(page => page.data.results) || [];
  $: totalComments = $commentsQuery.data?.pages[0]?.data.count || 0;

  let commentBody = "";
  let commentSubmitLocked = false;

  const addCommentMutation = createMutation({
    mutationFn: (body: string) => PostsApi.addComment(postSlug, body),
    onSuccess: () => {
      toasts.success("Comment added");
      commentBody = "";
      commentSubmitLocked = true;
      setTimeout(() => {
        commentSubmitLocked = false;
      }, 1000);
      $commentsQuery.refetch();
    },
    onError: (error) => {
      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    }
  });

  function handleCommentSubmit(e) {
    $addCommentMutation.mutate(commentBody);
  }
</script>

<Card class="mb-3">
  <CardHeader>
    <CardTitle>
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">
          {#if $commentsQuery.isLoading}
            <p>Loading...</p>
          {:else if $commentsQuery.isSuccess}
            <p>Comments ({$commentsQuery.data.pages[0].data.count}):</p>
          {/if}
        </div>

        <div style="min-width: 200px">
          <Select
            id="comments_ordering"
            name="comments_ordering"
            showChevron
            clearable={false}
            searchable={false}
            items={commentsOrderingItems}
            bind:value={commentsOrdering}
          />
        </div>
      </div>
    </CardTitle>
  </CardHeader>

  <CardBody class="p-2">
    {#if $commentsQuery.isLoading}
      <p>Loading comments...</p>
    {:else if $commentsQuery.isError}
      <p>Something went wrong...</p>
    {:else if $commentsQuery.isSuccess}
      {#each comments as comment}
        <CommentListItem {comment}/>
      {/each}
    {/if}

    {#if $commentsQuery.hasNextPage}
      <button class="btn btn-outline-primary" on:click={$commentsQuery.fetchNextPage}>
        Load more...
      </button>
    {/if}

    {#if $commentsQuery.isFetchingNextPage}
      Loading more comments...
    {/if}

    <CommentAddForm
      isSubmitting={commentSubmitLocked || $addCommentMutation.isLoading}
      onClear={() => commentBody = ""}
      on:submit={handleCommentSubmit}
      bind:value={commentBody}
    />
  </CardBody>
</Card>
