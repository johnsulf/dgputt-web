import App from './App.svelte';

const app = new App({
  target: document.getElementById('app'), 
  props: {
    title: 'dgputt'
  }
});

export default app;