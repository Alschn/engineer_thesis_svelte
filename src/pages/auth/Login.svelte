<script>
  import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";
  import LoginForm from "../../components/forms/LoginForm.svelte";
</script>

<Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>

  <CardBody class="p-4">
    <LoginForm/>
  </CardBody>
</Card>
