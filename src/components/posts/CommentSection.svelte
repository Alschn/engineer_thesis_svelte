<script lang="ts">
  import { createInfiniteQuery, createMutation } from "@tanstack/svelte-query";
  import { getContext } from "svelte";
  import Select from "svelte-select";
  import { toasts } from "svelte-toasts";
  import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";
  import PostsApi, { type PostCommentsFilters } from "../../api/posts";
  import type { Post } from "../../api/types";
  import { getNextPageParam } from "../../utils/tanstack-query";
  import CommentAddForm from "../forms/CommentAddForm.svelte";
  import CommentListItemSkeleton from "../skeletons/CommentListItemSkeleton.svelte";
  import CommentListItem from "./CommentListItem.svelte";

  const { slug: postSlug } = getContext<Post>("post");

  const commentsOrderingItems = [
    { label: "Sort by: Newest", value: "-created_at" },
    { label: "Sort by: Oldest", value: "created_at" },
  ] as const;

  let commentsOrdering = commentsOrderingItems.find(item => item.value === "-created_at")!;

  let params: PostCommentsFilters;
  $: params = {
    ordering: commentsOrdering.value
  };

  $: commentsQuery = createInfiniteQuery({
    queryKey: ["posts", postSlug, "comments", params],
    queryFn: ({ queryKey, pageParam = 1 }) => PostsApi.getAllComments(
      queryKey[1] as string, { page: pageParam, ...queryKey[3] as PostCommentsFilters }
    ),
    getNextPageParam: getNextPageParam
  });

  $: comments = $commentsQuery.data?.pages.flatMap(page => page.data.results) || [];
  $: totalComments = $commentsQuery.data?.pages[0]?.data.count || 0;

  let commentBody = "";
  let commentSubmitLocked = false;

  const addCommentMutation = createMutation({
    mutationFn: (body: string) => PostsApi.addComment(postSlug, body),
    onSuccess: async () => {
      toasts.success("Comment added");
      commentBody = "";
      commentSubmitLocked = true;
      setTimeout(() => {
        commentSubmitLocked = false;
      }, 1000);
      await $commentsQuery.refetch();
    },
    onError: (error) => {
      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    }
  });

  const handleCommentSubmit = () => $addCommentMutation.mutate(commentBody);
</script>

<Card class="shadow-sm mb-3">
  <CardHeader class="bg-white">
    <div class="d-flex align-items-center pt-1">
      <div class="flex-grow-1">
        {#if $commentsQuery.isLoading}
          <p class="placeholder placeholder-glow"></p>
        {:else if $commentsQuery.isSuccess}
          <CardTitle>Comments ({totalComments}):</CardTitle>
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
  </CardHeader>

  <CardBody class="p-2">
    {#if $commentsQuery.isLoading}
      <div class="d-flex flex-column gap-2 p-2">
        {#each Array(2) as _}
          <CommentListItemSkeleton/>
        {/each}
      </div>
    {:else if $commentsQuery.isError}
      <p class="text-danger fw-bold">Something went wrong...</p>
    {:else if $commentsQuery.isSuccess}
      <div class="d-flex flex-column gap-2 p-2">
        {#each comments as comment (`comment-${comment.id}`)}
          <CommentListItem {comment}/>
        {/each}
      </div>
    {/if}

    {#if $commentsQuery.hasNextPage}
      <button
        id="comments-load-more"
        class="btn btn-outline-primary"
        on:click={() => $commentsQuery.fetchNextPage()}
        disabled={$commentsQuery.isFetchingNextPage}
      >
        Load more...
      </button>
    {/if}

    {#if $commentsQuery.isFetchingNextPage}
      <p class="fw-bold">Loading more comments...</p>
    {/if}

    <CommentAddForm
      isSubmitting={commentSubmitLocked || $addCommentMutation.isLoading}
      onClear={() => commentBody = ""}
      on:submit={handleCommentSubmit}
      bind:value={commentBody}
    />
  </CardBody>
</Card>
