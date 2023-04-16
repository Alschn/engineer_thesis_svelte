<script lang="ts">
  import { Card, CardBody } from "sveltestrap";
</script>

<Card class="shadow border-0 p-3" {...$$props}>
  <header class="bg-white border-bottom-0 d-flex justify-content-center">
    <slot name="title"/>
  </header>
  <CardBody>
    <slot/>
  </CardBody>
</Card>
