<script lang="ts">
  export let currentRoute: CurrentRoute;

  import { createInfiniteQuery, createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
  import { AxiosError } from "axios";
  import { navigateTo } from "svelte-router-spa";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
  import { toasts } from "svelte-toasts";
  import PostsApi from "../../api/posts";
  import ProfilesApi from "../../api/profiles";
  import defaultAvatar from "../../assets/avatar.jpg";
  import { auth } from "../../stores/auth";

  const username = currentRoute.namedParams.username;
  const isCurrentUser = $auth.user!.username === username;

  const client = useQueryClient();

  const query = createQuery({
    queryKey: ["profiles", username],
    queryFn: ({ queryKey }) => ProfilesApi.getProfile(queryKey[1] as string),
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toasts.error({
          title: "Profile not found",
          description: "The profile you are looking for does not exist.",
        });
        navigateTo("/profiles");
      }
    },
    retry: (failureCount, error) => {
      return error.response?.status !== 404;
    }
  });

  $: profile = $query.data?.data || null;

  const followMutation = createMutation({
    mutationFn: () => ProfilesApi.follow(username),
    onSuccess: ({ data }) => {
      client.setQueryData(["profiles", username], old => ({
        ...old,
        data: {
          ...old.data,
          is_followed_by_you: data.is_followed_by_you,
          followers_count: data.followers_count
        }
      }));
      toasts.success({
        title: "Success",
        description: `You are now following user: ${username}`,
        duration: 2000
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Something went wrong...",
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: "Something went wrong...",
        description: "Please try again later.",
      });
    }
  });

  const unfollowMutation = createMutation({
    mutationFn: () => ProfilesApi.unfollow(username),
    onSuccess: ({ data }) => {
      client.setQueryData(["profiles", username], old => ({
        ...old,
        data: {
          ...old.data,
          is_followed_by_you: data.is_followed_by_you,
          followers_count: data.followers_count
        }
      }));
      toasts.success({
        title: "Success",
        description: `You are no longer following user: ${username}`,
        duration: 2000
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Something went wrong...",
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: "Something went wrong...",
        description: "Please try again later.",
      });
    }
  });

  $: followersQuery = createInfiniteQuery({
    queryKey: ["profiles-followers", username],
    queryFn: ({ queryKey }) => ProfilesApi.getFollowers(queryKey[1] as string),
  });
  $: followers = $followersQuery.data?.pages?.flatMap(p => p.data.results) || [];

  $: followedQuery = createInfiniteQuery({
    queryKey: ["profiles-followed", username],
    queryFn: ({ queryKey }) => ProfilesApi.getFollowed(queryKey[1] as string),
    enabled: !!profile
  });
  $: followed = $followedQuery.data?.pages?.flatMap(p => p.data.results) || [];

  $: postsQuery = createInfiniteQuery({
    queryKey: ["posts-authors", username],
    queryFn: ({ queryKey }) => PostsApi.getAll({ author__user__username: queryKey[1] as string }),
    enabled: !!profile
  });
  $: createdPosts = $postsQuery.data?.pages?.flatMap(p => p.data.results) || [];

  $: favouritesQuery = createInfiniteQuery({
    queryKey: ["posts-favourites", username],
    queryFn: () => PostsApi.getFavourites(),
    enabled: !!profile && isCurrentUser
  });
  $: favouritePosts = $favouritesQuery.data?.pages?.flatMap(p => p.data.results) || [];
</script>

{#if $query.isLoading}
  <p>Loading...</p>
{:else if $query.isError}
  <p>Something went wrong...</p>
{:else if $query.isSuccess && profile}
  <div class="row g-1">
    <div class="col-12">
      <div class="card p-4 align-items-center">
        <figure>
          <img
            width="100" height="100"
            src={profile.image || defaultAvatar}
            alt="Profile avatar"
          />
        </figure>
        <h1>{profile.username}</h1>
        <h3>{profile.email}</h3>
        <p class="text-muted">{profile.bio || ""}</p>
        {#if isCurrentUser}
          <a href="#" class="btn btn-primary">Edit profile</a>
        {:else}
          {#if profile.is_followed_by_you}
            <button
              class="btn btn-danger"
              on:click={() => $unfollowMutation.mutate()}
              disabled={$unfollowMutation.isLoading}
            >
              Unfollow
            </button>
          {:else}
            <button
              class="btn btn-primary"
              on:click={() => $followMutation.mutate()}
              disabled={$followMutation.isLoading}
            >
              Follow
            </button>
          {/if}
        {/if}
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card p-4">
        <h3>Followers ({profile.followers_count}):</h3>
        <div class="d-flex flex-column gap-2" style="height: 300px; overflow-y: auto">
          {#each followers as follower}
            <div class="d-flex align-items-center">
              <img
                width="50" height="50"
                src={follower.image || defaultAvatar}
                alt="Profile avatar"
              />
              <a href="/profiles/{follower.username}" class="ms-2">
                {follower.username}
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card p-4">
        <h3>Following ({profile.followed_count}):</h3>
        <div class="d-flex flex-column gap-2" style="height: 300px; overflow-y: auto">
          {#each followed as followee}
            <div class="d-flex align-items-center">
              <img
                width="50" height="50"
                src={followee.image || defaultAvatar}
                alt="Profile avatar"
              />
              <a href="/profiles/{followee.username}" class="ms-2">
                {followee.username}
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>

    {#if isCurrentUser}
      <div class="col-12">
        <div class="card p-4">
          <h3>Favourite Posts ({profile.favourites_count}):</h3>
          TODO:
        </div>
      </div>
    {/if}

    <div class="col-12">
      <div class="card p-4">
        <h3>Created Posts ({profile.posts_count}):</h3>
        TODO:
      </div>
    </div>
  </div>
{/if}
