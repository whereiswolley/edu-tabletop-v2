<template>
  <div class="text-screen">
    <div class="mover" :style="{ backgroundColor: bgColor }">
      <marquee class="text" :style="textStyleObj"
        >Hand soap. Don't throw.</marquee
      >
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    r: {
      type: Number,
      default: 75,
    },
    g: {
      type: Number,
      default: 50,
    },
    b: {
      type: Number,
      default: 50,
    },
    bgColor: {
      type: String,
      default: "var(--neutral-bg)",
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
  watch: {},
  computed: {
    textStyleObj() {
      return {
        color: `rgba(${this.r}, ${this.g}, ${this.b}, 0.1)`,
        textShadow: `0.15rem 0.15rem 0.015rem rgba(${this.r}, ${this.g}, ${this.b}, 1), 0.3rem 0.3rem 0.015rem rgba(${this.r}, ${this.g}, ${this.b}, 0.1)`,
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
.mover {
  position: relative;
  background-color: rgba(0, 0, 0, 1);
  border-radius: 5px;
  padding: 0.25rem 0;
  box-shadow: inset -1px 1px 0 0 rgba(255, 255, 255, 0.5),
    inset 2px -2px 0 0 rgba(0, 0, 0, 0.5),
    inset 0 0 1rem 0.1rem rgba(0, 0, 0, 0.5);
  border: 4px solid #333;
}

.text {
  font-family: "VT323", monospace;
  white-space: nowrap;
  font-size: 2rem;
}
</style>
