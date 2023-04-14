<script lang="ts">
  import { getContext } from "svelte";
  import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "sveltestrap";
  import type { Comment, Post } from "../../api/types";
  import defaultAvatar from "../../assets/avatar.jpg";
  import { auth } from "../../stores/auth";
  import { formatDate } from "../../utils/dates";
  import CommentDeleteModal from "../modals/CommentDeleteModal.svelte";

  export let comment: Comment;

  let isOpenDeleteCommentModal = false;

  function handleOpenDeleteCommentModal() {
    isOpenDeleteCommentModal = true;
  }

  function handleToggleModal() {
    isOpenDeleteCommentModal = !isOpenDeleteCommentModal;
  }

  const post = getContext<Post>("post");
  const isCurrentUser = $auth.isAuthenticated && comment.author.username === $auth.user?.username;
  const formattedDate = formatDate(comment.created_at);
</script>

<div class="d-flex flex-row gap-2">
  <div>
    <img
      src={comment.author.image || defaultAvatar}
      alt="avatar"
      height="48"
      class="rounded-circle"
    />
  </div>
  <Card class="shadow-sm rounded-4 mb-2">
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
        {formattedDate}
      </CardSubtitle>
      <CardText>{comment.body}</CardText>
      {#if isCurrentUser}
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
</div>
