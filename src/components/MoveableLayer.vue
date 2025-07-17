<template>
  <div class="moveable-layer">
    <div class="moving-layer" ref="movingLayer">
      <slot name="layer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
const DEFAULT_DURATION: number = 1;
const DEFAULT_FROM_VALUE: string = "100%";
const DEFAULT_AXIS: string = "x";

import { type ITransition } from "@/stores/director";
export default {
  emits: [],
  props: {
    transIn: null as ITransition | null,
    transOut: null as ITransition | null,
  },
  components: {},
  data() {
    return {
      //
    };
  },
  methods: {
    //
  },
  computed: {},
  watch: {},
  mounted() {},
};
</script>

<style scoped>
.moveable-layer {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}

.moving-layer {
  height: 100%;
  width: 100%;
}

.image {
  background-size: cover;
}
</style>
