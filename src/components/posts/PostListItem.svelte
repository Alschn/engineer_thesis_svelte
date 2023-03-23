<script lang="ts">
  import { Card, CardBody, CardHeader, CardLink, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  import type { ListPost } from "../../api/types";

  export let post: ListPost;

  const createdAt = new Date(post.created_at);
</script>

<Card>
  <CardHeader>
    <CardTitle>
      {post.title}
    </CardTitle>
    <CardSubtitle class="mb-2">
      {post.author.username}
    </CardSubtitle>
    <CardSubtitle class="text-muted mb-2">
      {createdAt.toLocaleString()}
    </CardSubtitle>
    <CardLink href="/posts/{post.slug}" class="text-decoration-none">
      {post.slug}
    </CardLink>
    <div class="d-flex gap-2 mt-2">
      {#each post.tags as tag}
        <span class="badge text-bg-primary">{tag}</span>
      {/each}
    </div>
  </CardHeader>
  <CardBody>
    <CardText>
      {post.description}
    </CardText>
  </CardBody>
</Card>
