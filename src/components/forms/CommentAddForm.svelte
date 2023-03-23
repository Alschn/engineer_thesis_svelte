<script lang="ts">
  export let isSubmitting: boolean = false;
  export let onClear: () => void;

  export let value: string = "";
</script>

<form class="mt-3" on:submit|preventDefault>
  <textarea
    id="comment"
    class="form-control"
    placeholder="Write a comment..."
    rows="3"
    required
    style="resize: none;"
    bind:value
  ></textarea>
  <div class="d-flex justify-content-end gap-2">
    {#if value.length}
      <button class="btn btn-outline-danger mt-2" type="button" on:click={onClear}>
        Clear
      </button>
    {/if}
    <button class="btn btn-primary mt-2" type="submit" disabled={isSubmitting}>
      Comment
    </button>
  </div>
</form>
