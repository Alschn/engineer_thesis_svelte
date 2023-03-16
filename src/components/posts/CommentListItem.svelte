<script lang="ts">
  import { getContext } from "svelte";
  import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  import type { Comment, Post } from "../../api/types";
  import { auth } from "../../stores/auth";
  import CommentDeleteModal from "../modals/CommentDeleteModal.svelte";

  export let comment: Comment;

  const createdAt = new Date(comment.created_at);

  let isOpenDeleteCommentModal = false;

  function handleOpenDeleteCommentModal() {
    isOpenDeleteCommentModal = true;
  }

  function handleToggleModal() {
    isOpenDeleteCommentModal = !isOpenDeleteCommentModal;
  }

  const post = getContext<Post>("post");
</script>

<Card class="mb-2">
  <CardBody class="px-3 py-2">
    <CardTitle class="d-inline">
      <a
        href="/profiles/{comment.author.username}"
        class="text-decoration-none"
      >
        {comment.author.username}
      </a>
    </CardTitle>
    <CardSubtitle class="d-inline-block text-muted mb-2">
      {createdAt.toLocaleString()}
    </CardSubtitle>
    <CardText>{comment.body}</CardText>
    {#if $auth.isAuthenticated && comment.author.username === $auth.user.username}
      <CommentDeleteModal
        isOpen={isOpenDeleteCommentModal}
        toggle={handleToggleModal}
        commentId={comment.id}
        postSlug={post.slug}
      />
      <div class="d-flex justify-content-end">
        <button
          class="btn btn-danger btn-sm"
          on:click={handleOpenDeleteCommentModal}
        >
          Delete
        </button>
      </div>
    {/if}
  </CardBody>
</Card>
