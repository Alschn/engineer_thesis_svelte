<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { AxiosError } from "axios";
  import { navigateTo } from "svelte-router-spa";
  import { toasts } from "svelte-toasts";
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import PostsApi from "../../api/posts";

  export let isOpen: boolean;
  export let toggle: () => void;
  export let postSlug: string;

  const client = useQueryClient();

  const deleteMutation = createMutation({
    mutationFn: () => PostsApi.deletePost(postSlug),
    onSuccess: () => {
      toggle();
      toasts.success("Post deleted");
      navigateTo("posts");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: "Failed to delete comment",
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: "Something went wrong",
        description: "Try again later...",
      });
    },
  });
</script>

<Modal {isOpen} {toggle} {...$$restProps}>
  <ModalHeader {toggle}>Delete Post {postSlug}</ModalHeader>
  <ModalBody>
    <p class="fs-5">Are you sure you want to delete this post?</p>
    <p class="fs-5">This action is irreversible!</p>
  </ModalBody>
  <ModalFooter>
    <Button color="danger" on:click={() => $deleteMutation.mutate()}>Delete</Button>
    <Button color="secondary" on:click={toggle}>Cancel</Button>
  </ModalFooter>
</Modal>
