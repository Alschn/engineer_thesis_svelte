<script lang="ts">
  export let label: string;
  export let color: string;
</script>

<span class="badge" style="--tag-color: {color}">{label}</span>

<style>
  span {
    background-color: var(--tag-color);
  }
</style>
