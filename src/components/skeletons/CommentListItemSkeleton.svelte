<script>
  import { Card, CardBody } from "sveltestrap";
</script>

<div class="d-flex flex-row gap-2">
  <div class="placeholder placeholder-image"></div>
  <Card class="shadow-sm rounded-4 mb-2">
    <CardBody class="px-3 py-2">
      <span class="placeholder placeholder-author"></span>
      <span class="d-inline-block placeholder placeholder-date"></span>
      <span class="d-block placeholder placeholder-content"></span>
    </CardBody>
  </Card>
</div>

<style>
  .placeholder-author {
    width: 60px;
  }

  .placeholder-date {
    width: 100px;
  }

  .placeholder-content {
    width: 300px;
  }

  .placeholder-author, .placeholder-date, .placeholder-content {
    height: 1em;
    margin-bottom: 4px;
  }

  .placeholder-image {
    height: 48px;
    width: 48px;
    border-radius: 50%;
  }
</style>
