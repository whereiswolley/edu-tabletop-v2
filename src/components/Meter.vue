<template>
  <div
    :class="[
      'meter',
      { 'is-vertical': isVertical, 'is-auto-fill': isAutoFill },
    ]"
  >
    <div
      :class="['per-step', { 'is-lit': step.isLit }]"
      v-for="step in dynamicSteps"
      :key="step.id"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  emits: [],
  props: {
    isAutoFill: {
      type: Boolean,
      default: false,
    },
    isVertical: {
      type: Boolean,
      default: false,
    },
    steps: {
      type: Number,
      default: 10,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    maxValue: {
      type: Number,
      required: true,
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    dynamicSteps() {
      const valuePerStep = this.maxValue / this.steps;
      const steps = Array(this.steps)
        .fill(null)
        .map((step, index) => {
          const maxStepValue = valuePerStep * index;
          return { id: index, isLit: this.currentValue > maxStepValue };
        });

      if (this.isVertical) return steps.reverse();
      return steps;
    },
  },
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.meter {
  display: flex;
  gap: 0.25rem;
  border: 0.25rem solid transparent;
}

.meter.is-vertical {
  flex-direction: column;
}

.meter.is-vertical.is-auto-fill {
  height: 100%;
}

.meter.is-auto-fill {
  width: 100%;
}

.per-step {
  height: 0.5rem;
  width: 0.5rem;
  background-color: var(--dark-bg);
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d);
}

.meter.is-auto-fill .per-step {
  width: auto;
  flex-basis: auto;
  flex-grow: 1;
}

.per-step.is-lit {
  background-color: springgreen;
}
</style>
