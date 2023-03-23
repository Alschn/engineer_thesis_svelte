<script lang="ts">
  import { navigateTo } from "svelte-router-spa";
  import {
    Collapse,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
  } from "sveltestrap";
  import { auth } from "../../stores/auth";
  import { token } from "../../stores/auth.js";

  let isOpen = false;
  let isOpenDropdown = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  function logout() {
    token.set(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigateTo(`auth/login`);
  }
</script>


<Navbar class="container-md" expand="md">
  <NavbarBrand href="/">Thesis - Svelte</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)}/>
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav navbar class="me-auto">
      <NavItem>
        <NavLink href="/posts">Posts</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/posts/feed">Feed</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/profiles">Profiles</NavLink>
      </NavItem>
    </Nav>
    {#if $auth.isAuthenticated}
      <Dropdown isOpen={isOpenDropdown} toggle={() => (isOpenDropdown = !isOpenDropdown)}>
        <DropdownToggle nav caret>{$auth.user.username}</DropdownToggle>
        <DropdownMenu end>
          <DropdownItem href="/profiles/{$auth.user.username}">Profile</DropdownItem>
          <DropdownItem divider/>
          <DropdownItem on:click={logout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    {:else}
      <Nav navbar>
        <NavItem>
          <NavLink href="/auth/login">Login</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/auth/register">Register</NavLink>
        </NavItem>
      </Nav>
    {/if}
  </Collapse>
</Navbar>
