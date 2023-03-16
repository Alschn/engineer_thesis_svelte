<script>
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { FlatToast, ToastContainer } from "svelte-toasts";
  import Router from "./routing/Router.svelte";
  import "bytemd/dist/index.css";
  import "highlight.js/styles/default.css";
  import "bootstrap/dist/css/bootstrap.min.css";

  const queryClient = new QueryClient();
</script>

<ToastContainer
  placement="top-right"
  duration={3000}
  theme="dark"
  showProgress
  let:data={data}
>
  <FlatToast {data}/>
</ToastContainer>

<QueryClientProvider client={queryClient}>
  <Router/>
</QueryClientProvider>
