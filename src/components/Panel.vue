<template>
  <div class="panel" :style="{ flexDirection }">
    <div class="screw"></div>
    <div class="screw"></div>
    <div class="screw"></div>
    <div class="screw"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  emits: [],
  props: {
    flexDirection: {
      type: String,
      default: "row",
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {},
  mounted() {},
};
</script>

<!-- TODO: This should be a global style class for more flex. -->
<style scoped>
.panel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--dark-bg);
  position: relative;
  box-shadow: inset -1px 1px 0 0 rgba(255, 255, 255, 0.5),
    inset 2px -2px 0 0 rgba(0, 0, 0, 0.5), 0 1rem 0 0 rgb(34, 27, 25),
    0 2.5rem 2.5rem 0 rgba(0, 0, 0, 1);
}

.screw {
  position: absolute;
  height: 0.5rem;
  width: 0.5rem;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 100%;
}

.screw:nth-of-type(1) {
  left: 1rem;
  top: 1rem;
}

.screw:nth-of-type(2) {
  left: 1rem;
  bottom: 1rem;
}

.screw:nth-of-type(3) {
  right: 1rem;
  top: 1rem;
}

.screw:nth-of-type(4) {
  right: 1rem;
  bottom: 1rem;
}
</style>
