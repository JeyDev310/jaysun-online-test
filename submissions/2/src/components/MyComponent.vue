<template>
  <div id="items">
    <h1>{{ items.name }}</h1>
    <div v-for="(group, index) in convertedItems" :key="index" class="item">
      <h3>Items with Score {{group.score}}</h3>
      <ul>
        <li v-for="(item, id) in group.els" :key="id">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  computed: {
    convertedItems() {
      const items = this.items.items
      const sorted = items.sort((a, b) => {
        if (a.id > b.id) return -1;
        if (a.id === b.id) return 0;
        if (a.id < b.id) return 1;
      }).sort((a, b) => {
        if (Number(a.score) > Number(b.score)) return 1;
        if (Number(a.score) === Number(b.score)) return 0;
        if (Number(a.score) < Number(b.score)) return -1;
      })
      let r = [];
      let els = [];
      let score = "";
      console.log(sorted);
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          score = sorted[0].score;
        }
        if (sorted[i].score === score) {
          els.push(sorted[i]);
        } else {
          r.push({
            score: score,
            els: els
          })
          els = [sorted[i]];
          score = sorted[i].score;
        }
      }
      r.push({
        score: score,
        els: els
      })
      console.log(r);
      return r
    }
  }
}
</script>