<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Select from "svelte-select";
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'sveltestrap';
  import type { PostFiltersEventDetail } from "../../api/posts";
  import ProfilesApi from "../../api/profiles";
  import TagsApi from "../../api/tags";
  import type { SelectOption } from "../../api/types";

  export let isOpen: boolean;
  export let toggle: () => void;

  const dispatch = createEventDispatcher();

  let title = "", slug = "", created_at__gte = "", created_at__lte = "";
  let author: SelectOption[] = [], tags: SelectOption[] = [];

  function handleClearFilters() {
    title = slug = created_at__gte = created_at__lte = "";
    author = tags = [];
  }

  function loadAuthors(filterText: string) {
    return ProfilesApi.getAll({ username: filterText, page_size: 25 }).then(
      (r) => r.data.results.map(p => ({ label: p.username, value: p.username }))
    );
  }

  function loadTags(filterText: string) {
    return TagsApi.getAll({ tag__icontains: filterText, page_size: 25 }).then(
      (r) => r.data.results.map(t => ({ label: t.tag, value: t.tag }))
    );
  }

  function handleConfirmFilters() {
    toggle();
    const detail: PostFiltersEventDetail = {
      title, slug, created_at__gte, created_at__lte,
      author: author.map(a => a.value),
      tags: tags.map(t => t.value),
    };
    dispatch("confirm", detail);
  }
</script>

<Modal {isOpen} {toggle} {...$$restProps}>
  <ModalHeader {toggle}>Post Filters</ModalHeader>
  <ModalBody>
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        type="text"
        class="form-control"
        id="title"
        name="title"
        placeholder="Type to search by title..."
        maxlength={100}
        bind:value={title}
      />
    </div>

    <div class="mb-3">
      <label for="slug" class="form-label">Slug</label>
      <input
        type="text"
        class="form-control"
        id="slug"
        name="slug"
        placeholder="Type to search by slug..."
        maxlength={100}
        bind:value={slug}
      />
    </div>

    <div class="mb-3">
      <label for="author" class="form-label">Author</label>
      <Select
        id="author"
        name="author"
        placeholder="Choose authors..."
        debouncedWait={1500}
        loadOptions={loadAuthors}
        clearable
        multiple
        bind:value={author}
      />
    </div>

    <div class="mb-3">
      <label for="tags" class="form-label">Tags</label>
      <Select
        id="tags"
        name="tags"
        placeholder="Choose tags..."
        debouncedWait={1500}
        loadOptions={loadTags}
        clearable
        multiple
        bind:value={tags}
      />
    </div>

    <div class="row">
      <div class="col-6 mb-3">
        <label for="created_at__gte" class="form-label">Created at (From)</label>
        <input
          type="date"
          class="form-control"
          id="created_at__gte"
          name="created_at__gte"
          max={created_at__lte}
          bind:value={created_at__gte}
        />
      </div>
      <div class="col-6">
        <label for="created_at__lte" class="form-label">Created at (To)</label>
        <input
          type="date"
          class="form-control"
          id="created_at__lte"
          name="created_at__lte"
          min={created_at__gte}
          bind:value={created_at__lte}
        />
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button color="danger" outline on:click={handleClearFilters}>
      Clear
    </Button>
    <Button color="primary" on:click={handleConfirmFilters}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
