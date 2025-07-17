<template>
  <div id="divination">
    <div>
      <p>write your name on a paper</p>
      <!--  -->
      <button>I'm Ready</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      step: 0,
    };
  },
  methods: {},
  watch: {},
  computed: {},
  mounted() {},
};
</script>

<style scoped>
#divination {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #030f36;
  text-shadow: 0 0 1rem cyan;
  color: white;
}
</style>
