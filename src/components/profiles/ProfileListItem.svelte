<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { AxiosError } from "axios";
  import { toasts } from "svelte-toasts";
  import ProfilesApi from "../../api/profiles";
  import type { ListProfile } from "../../api/types";
  import defaultAvatar from "../../assets/avatar.jpg";
  import { auth } from "../../stores/auth.js";

  export let profile: ListProfile;

  const client = useQueryClient();

  const followMutation = createMutation({
    mutationFn: () => ProfilesApi.follow(profile.username),
    onSuccess: () => {
      client.refetchQueries(["profiles"]);
      toasts.success({
        title: "Success",
        description: `You are now following user: ${profile.username}`,
        duration: 2000,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Something went wrong...",
          description: "Could not follow user.",
        });
        return;
      }

      toasts.error({
        title: "Something went wrong...",
        description: "Please try again later.",
      });
    },
  });

  const unfollowMutation = createMutation({
    mutationFn: () => ProfilesApi.unfollow(profile.username),
    onSuccess: () => {
      client.refetchQueries(["profiles"]);
      toasts.success({
        title: "Success",
        description: `You are no longer following user: ${profile.username}`,
        duration: 2000,
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Something went wrong...",
          description: "Could not unfollow user.",
        });
        return;
      }

      toasts.error({
        title: "Something went wrong...",
        description: "Please try again later.",
      });
    },
  });
</script>

<div class="card d-flex flex-column align-items-center gap-2 p-2">
  <img
    class="rounded-circle"
    width="50"
    height="50"
    src={profile.image || defaultAvatar}
    alt=""
  />
  <a href="/profiles/{profile.username}">{profile.username}</a>
  <div>
    {#if profile.username !== $auth.user.username}
      {#if profile.is_followed_by_you}
        <button
          class="btn btn-sm btn-outline-danger"
          disabled={$unfollowMutation.isLoading}
          on:click={() => $unfollowMutation.mutate()}
        >
          Unfollow {profile.username}
        </button>
      {:else}
        <button
          class="btn btn-sm btn-outline-primary"
          disabled={$followMutation.isLoading}
          on:click={() => $followMutation.mutate()}
        >
          Follow {profile.username}
        </button>
      {/if}
    {:else}
      <a href="/profiles/{profile.username}" class="btn btn-sm btn-outline-secondary">
        Edit Profile
      </a>
    {/if}
  </div>
</div>
