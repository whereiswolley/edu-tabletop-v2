<template>
  <Scene>
    <div id="dot-matrix">
      <Panel>
        <div class="view">
          <div class="grid" :style="gridStyleObj">
            <div class="dot-wrapper" v-for="dot in size * size">
              <div class="dot"></div>
            </div>
          </div>
        </div>
        <div class="control">
          <ButtonChunky
            text-align="center"
            class="per-button"
            v-for="count in 4"
            >Phase {{ count }}</ButtonChunky
          >
        </div>
      </Panel>
    </div>
  </Scene>
</template>

<script lang="ts">
import Panel from "../Panel.vue";
import ButtonChunky from "../ui/ButtonChunky.vue";
import Scene from "@/components/Scene.vue";
export default {
  props: {
    size: {
      type: Number,
      default: 6,
    },
  },
  components: { Scene, ButtonChunky, Panel },
  data() {
    return {};
  },
  methods: {},
  watch: {},
  computed: {
    gridStyleObj() {
      return {
        gridTemplateColumns: `repeat(${this.size}, 3rem)`,
        gridTemplateRows: `repeat(${this.size}, 3rem)`,
      };
    },
  },
  mounted() {},
};
</script>

<style scoped>
#dot-matrix {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--neutral-bg);
}

.view {
  display: flex;
}
.grid {
  display: grid;
}
.dot-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dot {
  height: 1rem;
  width: 1rem;
  background-color: var(--neutral-bg);
  border-radius: 100%;
}
.control {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
