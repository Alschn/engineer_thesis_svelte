<script lang="ts">
  import { CardBody } from "sveltestrap";
  import MarkdownEditor from "../markdown/MarkdownEditor.svelte";
  import MarkdownViewer from "../markdown/MarkdownViewer.svelte";

  export let isEditing: boolean = false;
  export let handlePostUpdate: (newBody: string) => void;
  export let handleCancelEdit: () => void;

  export let body: string;

  let bodyDraft = body;

  $: if (!isEditing) {
    bodyDraft = body;
  }

  function handleChange(e: CustomEvent) {
    bodyDraft = e.detail.value;
  }

  function handleSave() {
    handlePostUpdate(bodyDraft);
  }
</script>

{#if isEditing}
  <MarkdownEditor
    value={bodyDraft}
    on:change={handleChange}
  />
  <div class="d-flex justify-content-end p-2 gap-2 mr-2">
    <button class="btn btn-outline-dark" type="button" on:click={handleCancelEdit}>
      Cancel
    </button>
    <button class="btn btn-primary" type="button" on:click={handleSave}>
      Save
    </button>
  </div>
{:else }
  <CardBody>
    <MarkdownViewer value={body}/>
  </CardBody>
{/if}
