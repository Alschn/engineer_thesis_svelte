<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import { AxiosError } from "axios";
  import { navigateTo } from "svelte-router-spa";
  import type { CurrentRoute } from "svelte-router-spa/types/components/route";
  import Select from "svelte-select";
  import { toasts } from "svelte-toasts";
  import PostsApi, { type PostCreatePayload } from "../../api/posts";
  import TagsApi from "../../api/tags";
  import MarkdownEditor from "../../components/markdown/MarkdownEditor.svelte";

  export let currentRoute: CurrentRoute;

  let title = "", description = "", body = "";
  let tags = [];

  const mutation = createMutation({
    mutationFn: (data: PostCreatePayload) => PostsApi.createPost(data),
    onSuccess: () => {
      toasts.success({
        title: "Post created",
        description: "Your post has been created successfully."
      });
      navigateTo('posts');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: 'Failed to create post...',
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: 'Something went wrong...',
        description: 'Please try again later',
      });
    }
  });

  function loadOptions(filterText: string) {
    return TagsApi.getAll({ tag__icontains: filterText }).then(res => res.data.results);
  }

  function handleBodyChange(e: CustomEvent) {
    body = e.detail.value;
  }

  function handleSubmit(e: CustomEvent) {
    if (!body) {
      toasts.error("Body is required!");
      return;
    }

    $mutation.mutate({
      title, description, body,
      tags: tags.map(t => t.tag),
    });
  }
</script>

<form class="my-4 p-2" on:submit|preventDefault={handleSubmit}>
  <div class="mb-3">
    <label for="title" class="form-label">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      class="form-control"
      placeholder="Enter title"
      required
      bind:value={title}
      maxlength="255"
    />
  </div>

  <div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea
      id="description"
      name="description"
      class="form-control"
      placeholder="Enter short description"
      required
      bind:value={description}
      maxlength="1000"
    ></textarea>
  </div>

  <div class="mb-3">
    <label for="tags" class="form-label">Tags</label>
    <Select
      id="tags"
      name="tags"
      placeholder="Choose tags..."
      debouncedWait={1500}
      itemId="tag"
      label="tag"
      clearable
      multiple
      required
      {loadOptions}
      bind:value={tags}
    />
  </div>

  <div class="mb-3">
    <label for="body" class="form-label">Body</label>
    <MarkdownEditor
      id="body"
      value={body}
      on:change={handleBodyChange}
    />
  </div>

  <div class="d-flex justify-content-end">
    <button class="btn btn-primary" type="submit">
      Submit
    </button>
  </div>
</form>
