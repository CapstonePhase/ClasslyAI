// Global Svelte typings to support imports like '...?.svelte' and '?module'
// and to ensure imports such as '$lib/components/Card.svelte?module' are recognized.

declare module '*.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class SvelteComponent<
    Props = Record<string, any>,
    Events = Record<string, any>,
    Slots = Record<string, any>
  > extends SvelteComponentTyped<Props, Events, Slots> {}
}

declare module '*.svelte?module' {
  import type { SvelteComponentTyped } from 'svelte';
  const component: new (...args: any[]) => SvelteComponentTyped<any, any, any>;
  export default component;
}

declare module '*?module' {
  import type { SvelteComponentTyped } from 'svelte';
  const component: new (...args: any[]) => SvelteComponentTyped<any, any, any>;
  export default component;
}

// Specific declarations for $lib imports with query parameters
declare module '$lib/components/*.svelte?module' {
  import type { SvelteComponentTyped } from 'svelte';
  const component: new (...args: any[]) => SvelteComponentTyped<any, any, any>;
  export default component;
}

declare module '*?raw';
declare module '*?url';

export {};
