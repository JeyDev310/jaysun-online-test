<template>
  <MyComponent :items="items" />
</template>

<script>

import MyComponent from './components/MyComponent.vue'
const items = {
  name: 'My Items',
  items: [
    { id: 1, name: 'Item 1', score: 30 },
    { id: 2, name: 'Item 2', score: 50 },
    { id: 3, name: 'Item 3', score: 20 },
    { id: 4, name: 'Item 4', score: 20 },
    { id: 5, name: 'Item 5', score: 30 },
    { id: 6, name: 'Item 6', score: 20 }
  ]
}
export default {
  name: 'App',
  data() {
    return {
      items
    }
  },
  components: {
    MyComponent
  }
}
</script>