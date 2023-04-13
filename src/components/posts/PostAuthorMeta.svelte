<script lang="ts">
  import type { ProfileEmbedded } from "../../api/types";
  import defaultAvatar from "../../assets/avatar.jpg";
  import { formatDate } from "../../utils/dates";

  export let author: ProfileEmbedded;
  export let createdAt: string;

  const formattedCreatedAt = formatDate(createdAt);
</script>

<div class="d-flex flex-row align-items-center gap-2 mb-2">
  <img
    src={author.image || defaultAvatar}
    alt="Profile"
    class="rounded-circle"
    height="48"
  />
  <div class="d-flex flex-column justify-content-center">
    <div>
      <a href="/profiles/{author.username}" class="fs-5 fw-bold text-decoration-none">
        {author.username}
      </a>
    </div>
    <span class="text-muted fs-6">
      {formattedCreatedAt}
    </span>
  </div>
</div>
