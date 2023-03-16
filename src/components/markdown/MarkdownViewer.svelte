<script lang="ts">
  import { Viewer } from "bytemd";
  import plugins from "./plugins";

  export let value: string;
</script>

<Viewer {value} {plugins}/>
