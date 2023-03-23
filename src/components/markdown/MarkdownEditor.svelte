<script lang="ts">
  import { Editor } from 'bytemd';
  import plugins from "./plugins";

  export let value: string;
</script>

<Editor
  {value}
  {plugins}
  {...$$restProps}
  on:change
/>
