<template>
  <div class="numeric-read-out">
    <span>{{ value }}</span>
  </div>
</template>

<script lang="ts">
import gsap from "gsap";
export default {
  emits: [],
  props: {},
  components: {},
  data() {
    return {
      value: 0,
    };
  },
  methods: {},
  computed: {},
  watch: {},
  mounted() {
    gsap.to(
      {},
      {
        duration: 0.1,
        repeat: -1,
        onUpdate: () => {
          this.value += 1;
        },
      }
    );
  },
};
</script>

<style scoped>
.numeric-read-out {
  font-family: "Share Tech Mono", monospace;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: springgreen;
  font-size: 2rem;
}
</style>
