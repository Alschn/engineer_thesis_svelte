<script>
  import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";
  import RegisterForm from "../../components/forms/RegisterForm.svelte";
</script>

<Card>
  <CardHeader>
    <CardTitle>Register</CardTitle>
  </CardHeader>

  <CardBody class="p-4">
    <RegisterForm/>
  </CardBody>
</Card>
