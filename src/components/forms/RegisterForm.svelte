<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import AuthApi, { type UserRegisterPayload } from "../../api/auth";
  import { toasts } from "svelte-toasts";
  import { navigateTo } from "svelte-router-spa";
  import { AxiosError } from "axios";

  let email = "";
  let username = "";
  let password1 = "";
  let password2 = "";

  const mutation = createMutation({
    mutationFn: (data: UserRegisterPayload) => AuthApi.register(data),
    onSuccess: () => {
      toasts.success({
        title: "Success!",
        description: "Now you can login to your account",
      });
      navigateTo("auth/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toasts.error({
          title: 'Failed to register...',
          description: error.message,
        });
        return;
      }

      toasts.error({
        title: 'Something went wrong...',
        description: 'Please try again later',
      });
    }
  });

  const handleSubmit = (e) => $mutation.mutate({ email, username, password1, password2 });
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input
      id="email"
      name="email"
      class="form-control"
      type="email"
      placeholder="Enter email"
      required
      bind:value={email}
    />
  </div>

  <div class="mb-3">
    <label for="username" class="form-label">Username</label>
    <input
      id="username"
      name="username"
      class="form-control"
      type="text"
      placeholder="Enter username"
      required
      minlength="6"
      bind:value={username}
    />
  </div>

  <div class="mb-3">
    <label for="password1" class="form-label">Password</label>
    <input
      id="password1"
      name="password1"
      class="form-control"
      type="password"
      placeholder="Enter password"
      required
      minlength="6"
      bind:value={password1}
    />
  </div>

  <div class="mb-3">
    <label for="password2" class="form-label">Confirm password</label>
    <input
      id="password2"
      name="password2"
      class="form-control"
      type="password"
      placeholder="Confirm password"
      required
      minlength="6"
      bind:value={password2}
    />
  </div>

  <div class="mb-3">
    <a href="/auth/login">Already have an account?</a>
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
