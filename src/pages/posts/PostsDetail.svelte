<script lang="ts">
  import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
  import { AxiosError } from "axios";
  import { setContext } from "svelte";
  import { navigateTo } from "svelte-router-spa";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
  import { toasts } from "svelte-toasts";
  import { Card, CardHeader, CardSubtitle, CardTitle } from "sveltestrap";
  import type { PostUpdatePayload } from "../../api/posts";
  import PostsApi from "../../api/posts";
  import PostDeleteModal from "../../components/modals/PostDeleteModal.svelte";
  import CommentSection from "../../components/posts/CommentSection.svelte";
  import PostBody from "../../components/posts/PostBody.svelte";
  import { auth } from "../../stores/auth";

  export let currentRoute: CurrentRoute;
  const postSlug = currentRoute.namedParams.post_slug;

  const client = useQueryClient();

  const query = createQuery({
    queryKey: ["posts", postSlug],
    queryFn: ({ queryKey }) => PostsApi.getPost(queryKey[1] as string),
    onError: (error) => {
      if (error.response?.status === 404) {
        toasts.error({
          title: "Post not found",
          description: "The post you are looking for does not exist.",
        });
        navigateTo("/posts");
      }
    },
    retry: (failureCount, error) => {
      return error?.response?.status !== 404;
    }
  });

  $: post = $query.data?.data || null;

  const updatePostMutation = createMutation({
    mutationFn: (data: PostUpdatePayload) => PostsApi.updatePost(postSlug, data),
    onSuccess: ({ data }) => {
      toasts.success("Post updated");
      isEditing = false;
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({ ...old, data: { ...old.data, body: data.body } })
      );
      setContext("post", data);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Failed to update post",
          description: "Try again later...",
        });
        return;
      }

      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    }
  });

  const favouriteMutation = createMutation({
    mutationFn: () => PostsApi.addToFavourites(postSlug),
    onSuccess: ({ data }) => {
      toasts.success("Post added to favourites");
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({
          ...old, data: {
            ...old.data,
            is_favourited: true,
            favourites_count: data.favourites_count
          }
        })
      );
    },
    onError: (error) => {
      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    }
  });

  const unfavouriteMutation = createMutation({
    mutationFn: () => PostsApi.removeFromFavourites(postSlug),
    onSuccess: ({ data }) => {
      toasts.success("Post removed from favourites");
      client.setQueryData(
        ["posts", postSlug],
        (old: any) => ({
          ...old,
          data: {
            ...old.data,
            is_favourited: false,
            favourites_count: data.favourites_count
          }
        })
      );
    },
    onError: (error) => {
      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    }
  });

  let isEditing = false;

  $: if (post) {
    setContext("post", post);
  }

  let isOpenDeletePostModal = false;

  function handlePostUpdate(newBody: string) {
    $updatePostMutation.mutate({ body: newBody });
  }

  function handleOpenDeletePostModal(e) {
    isOpenDeletePostModal = true;
  }
</script>

{#if $query.isLoading}
  <div>Loading...</div>
{:else if $query.isError}
  <div>Something went wrong...</div>
{:else if $query.isSuccess && post}
  <Card class="mb-3">
    <CardHeader>
      <CardTitle>Title: {post.title}</CardTitle>
      <CardSubtitle class="mb-1">Description: {post.description}</CardSubtitle>
      <div class="mb-2">
        <a href="/profiles/{post.author.username}">
          Author: {post.author.username}
        </a>
      </div>
      <div class="d-flex gap-1 mb-2" style="font-size: 1.1em">
        {#each post.tags as tag}
          <span class="badge bg-primary">{tag}</span>
        {/each}
      </div>
      <p>Likes: {post.favourites_count}</p>
      <div class="d-flex justify-content-end gap-2">
        {#if $auth.isAuthenticated && !isEditing && post.author.username === $auth.user.username}
          <button class="btn btn-outline-dark" on:click={() => isEditing = true}>
            Edit
          </button>
        {/if}

        {#if $auth.isAuthenticated && post.author.username !== $auth.user.username}
          {#if post.is_favourited}
            <button class="btn btn-outline-danger" on:click={$unfavouriteMutation.mutate}>
              Remove from favourites
            </button>
          {:else}
            <button class="btn btn-outline-primary" on:click={$favouriteMutation.mutate}>
              Add to favourites
            </button>
          {/if}
        {/if}

        {#if $auth.isAuthenticated && post.author.username === $auth.user.username}
          <PostDeleteModal
            {postSlug}
            isOpen={isOpenDeletePostModal}
            toggle={() => isOpenDeletePostModal = !isOpenDeletePostModal}
          />
          <button class="btn btn-danger" on:click={handleOpenDeletePostModal}>
            Delete
          </button>
        {/if}
      </div>
    </CardHeader>
    <PostBody
      body={post.body}
      handleCancelEdit={() => isEditing = false}
      {isEditing}
      {handlePostUpdate}
    />
  </Card>

  <CommentSection/>
{/if}

<style>
  :global(.card-header + .bytemd) {
    height: calc(100vh - 300px);
  }
</style>
