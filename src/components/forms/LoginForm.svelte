<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import AuthApi, { type LoginPayload } from "../../api/auth";
  import { token } from "../../stores/auth";
  import { navigateTo } from "svelte-router-spa";
  import { toasts } from "svelte-toasts";
  import { AxiosError } from "axios";

  let email = "", password = "";

  const mutation = createMutation({
    mutationFn: (data: LoginPayload) => AuthApi.login(data),
    onSuccess: ({ data }) => {
      token.set(data.access);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      toasts.success({
        title: 'Success!',
        description: 'You have successfully logged in',
      });
      navigateTo('posts');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: 'Failed to authenticate...',
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: 'Something went wrong...',
        description: 'Please try again later',
      });
    },
  });

  const handleSubmit = (e) => $mutation.mutate({ email, password });
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input
      id="email"
      name="email"
      type="email"
      placeholder="Enter email"
      class="form-control"
      required
      bind:value={email}
    />
  </div>

  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input
      id="password"
      name="password"
      type="password"
      placeholder="Enter password"
      class="form-control"
      required
      bind:value={password}
    />
  </div>

  <div class="mb-3">
    <a href="/auth/register">Do not have an account?</a>
  </div>

  <div class="d-flex justify-content-center align-items-center mt-4">
    <button class="btn btn-primary" type="submit" disabled={$mutation.isLoading}>
      Submit
    </button>
  </div>
</form>

<style>
  form {
    min-width: 320px;
  }
</style>
