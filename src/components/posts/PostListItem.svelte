<script lang="ts">
  import { Card, CardBody, CardHeader, CardLink, CardText } from "sveltestrap";
  import type { ListPost } from "../../api/types";
  import PostAuthorMeta from "./PostAuthorMeta.svelte";
  import TagBadge from "./TagBadge.svelte";

  export let post: ListPost;
</script>

<Card class="shadow border-0" style="height: 100%">
  <img
    src={post.thumbnail}
    alt="Thumbnail"
    class="rounded-top"
    height="300"
  />
  <CardHeader>
    <CardLink href="/posts/{post.slug}" class="fs-4 fw-bold text-dark text-decoration-none">
      {post.title}
    </CardLink>
    <PostAuthorMeta
      author={post.author}
      createdAt={post.created_at}
    />
    <div class="d-flex gap-2 mt-2">
      {#each post.tags as tag (tag.id)}
        <TagBadge label={tag.tag} color={tag.color}/>
      {/each}
    </div>
  </CardHeader>
  <CardBody>
    <CardText>
      {post.description}
    </CardText>
  </CardBody>
  <div class="d-flex justify-content-end px-3 pb-2">
    <CardLink href="/posts/{post.slug}" class="btn btn-sm btn-dark">
      Show details
    </CardLink>
  </div>
</Card>
