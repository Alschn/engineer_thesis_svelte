<script>
  import LoginForm from "../../components/forms/LoginForm.svelte";
  import AuthCard from "../../components/cards/AuthCard.svelte";
</script>

<AuthCard>
  <h1 slot="title">Login</h1>
  <LoginForm/>
</AuthCard>
