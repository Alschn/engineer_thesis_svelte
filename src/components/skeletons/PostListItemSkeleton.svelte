<script>
  import { Card, CardBody, CardHeader } from "sveltestrap";
</script>

<Card class="shadow border-0" style="height: 100%">
  <span class="placeholder placeholder-wave skeleton-image rounded-top mb-1"></span>
  <CardHeader>
    <span class="placeholder placeholder-glow skeleton-title mb-2"></span>
    <div class="d-flex flex-row align-items-center gap-2 mb-2">
      <span class="placeholder placeholder-wave skeleton-profile__image"></span>
      <div class="d-flex flex-column justify-content-center w-100 gap-1">
        <span class="placeholder placeholder-wave skeleton-profile__text"></span>
        <span class="placeholder placeholder-wave skeleton-profile__text"></span>
      </div>
    </div>
    <div class="d-flex gap-2">
      <span class="placeholder placeholder-wave skeleton-badge"></span>
      <span class="placeholder placeholder-wave skeleton-badge"></span>
      <span class="placeholder placeholder-wave skeleton-badge"></span>
    </div>
  </CardHeader>
  <CardBody class="d-flex flex-column gap-2">
    <span class="placeholder placeholder-wave skeleton-profile__text w-100"></span>
    <span class="placeholder placeholder-wave skeleton-profile__text w-100"></span>
    <span class="placeholder placeholder-wave skeleton-profile__text w-75"></span>
  </CardBody>
  <div class="d-flex justify-content-end px-3 pb-2">
    <div class="placeholder placeholder-wave skeleton-button"></div>
  </div>
</Card>

<style>
  .skeleton-image {
    height: 300px;
  }

  .skeleton-title {
    width: 80%;
    height: 2em;
  }

  .skeleton-profile__image {
    height: 50px;
    width: 60px;
    border-radius: 100%;
  }

  .skeleton-profile__text {
    width: 60%;
    height: 1.5em;
  }

  .skeleton-badge {
    width: 48px;
    height: 16px;
    border-radius: 0.25em;
  }

  .skeleton-button {
    width: 100px;
    height: 30px;
    border-radius: 0.25em;
  }
</style>
