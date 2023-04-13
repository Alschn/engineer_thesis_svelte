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
  import PostAuthorMeta from "../../components/posts/PostAuthorMeta.svelte";
  import PostBody from "../../components/posts/PostBody.svelte";
  import TagBadge from "../../components/posts/TagBadge.svelte";
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
  <div class="d-flex justify-content-center align-items-center" style="height: calc(100vh - 150px)">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{:else if $query.isError}
  <p class="text-danger fw-bold">Something went wrong...</p>
{:else if $query.isSuccess && post}
  {@const isCurrentUser = $auth.isAuthenticated && $auth.user.username === post.author.username}

  <Card class="shadow-sm rounded mb-4">
    <CardHeader class="bg-white p-0 pb-3">
      <div class="d-flex flex-column flex-lg-row gap-3">
        <img
          src={post.thumbnail}
          alt="thumbnail"
          height="300"
          class="border"
        />
        <div class="d-flex flex-column p-3">
          <CardTitle class="fs-1 mb-3">
            Title: {post.title}
          </CardTitle>
          <CardSubtitle class="fs-5 mb-3">
            Description: {post.description}
          </CardSubtitle>
          <div class="d-flex align-items-center gap-1 mb-3" style="font-size: 1.1em">
            <CardSubtitle class="fs-6">Tags:</CardSubtitle>
            {#each post.tags as tag}
              <TagBadge label={tag.tag} color={tag.color}/>
            {/each}
          </div>
          <CardSubtitle class="fs-5">Likes: {post.favourites_count}</CardSubtitle>
          <div class="mb-auto"></div>
          <PostAuthorMeta
            author={post.author}
            createdAt={post.created_at}
          />
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 px-3">
        {#if isCurrentUser && !isEditing}
          <button
            id="post-edit"
            class="btn btn-outline-dark"
            on:click={() => isEditing = true}
          >
            Edit
          </button>
        {/if}

        {#if !isCurrentUser}
          {#if post.is_favourited}
            <button
              id="post-unfavourite"
              class="btn btn-outline-danger"
              on:click={() => $unfavouriteMutation.mutate()}
            >
              Remove from favourites
            </button>
          {:else}
            <button
              id="post-favourite"
              class="btn btn-outline-primary"
              on:click={() => $favouriteMutation.mutate()}
            >
              Add to favourites
            </button>
          {/if}
        {/if}

        {#if isCurrentUser}
          <PostDeleteModal
            {postSlug}
            isOpen={isOpenDeletePostModal}
            toggle={() => isOpenDeletePostModal = !isOpenDeletePostModal}
          />
          <button
            id="post-delete"
            class="btn btn-danger"
            on:click={handleOpenDeletePostModal}
          >
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
