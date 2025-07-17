<template>
  <Scene>
    <div id="sampler-1">
      <div class="view">
        <div id="dish" class="panel-3d">
          <div id="sample"></div>
          <div id="dish-inner"></div>
          <div id="glass"></div>
        </div>
      </div>
      <div class="control-wrapper">
        <div id="handle"></div>
        <div class="control panel-3d rounded">
          <div id="output">
            <TextScreen />
            <Meter :current-value="35" :max-value="100" :is-auto-fill="true" />
          </div>
          <div id="actions">
            <ButtonChunky :text-align="'center'">ll</ButtonChunky>
            <ButtonChunky :text-align="'center'">pp</ButtonChunky>
          </div>
        </div>
      </div>
    </div>
  </Scene>
</template>

<script lang="ts">
import ButtonChunky from "../ui/ButtonChunky.vue";
import TextScreen from "../ui/TextScreen.vue";
import Meter from "../Meter.vue";
import Panel from "../Panel.vue";
import Scene from "../Scene.vue";
export default {
  emits: [],
  props: {},
  components: { ButtonChunky, TextScreen, Meter, Scene, Panel },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {},
  mounted() {},
};
</script>

<style scoped>
#sampler-1 {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#handle {
  position: absolute;
  left: 25%;
  right: 25%;
  bottom: 75%;
  height: 5rem;
  border-radius: var(--border-radius);
  border: 1rem solid var(--dark-bg);
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d), var(--base-shadow);
  z-index: 1;
}

.view {
  height: 8rem;
  width: 8rem;
  border-radius: 100%;
  background: red;
  position: relative;
  z-index: 2;
}

.control-wrapper {
  height: 10rem;
  position: relative;
  z-index: 1;
  display: flex;
}

.control {
  padding: 1rem;
  position: relative;
  z-index: 2;
}

#output {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#dish,
#glass {
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
  height: 100%;
  width: 100%;
}

#dish {
  padding: 1rem;
}

#sample {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: red;
  height: 25%;
  width: 25%;
  border-radius: 100%;
  opacity: 0.5;
  z-index: 1;
}

#dish-inner,
#glass {
  position: absolute;
}

#dish-inner {
  border-radius: 100%;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  background-color: gray;
  box-shadow: inset -1px 1px 0 1px var(--neutral-bg),
    inset 1px -1px 0 1px var(--dark-bg),
    inset -1rem 1rem 1rem 0 rgba(0, 0, 0, 0.25),
    inset 1rem -1rem 1rem 0 rgba(255, 255, 255, 0.75);
}

#glass {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: 100% 0%;
  background: linear-gradient(to bottom right, skyblue 0%, transparent 50%),
    linear-gradient(to top left, skyblue 0%, transparent 50%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  opacity: 0.25;
  transition: transform 1s;
}

#dish:hover #glass {
  transform: rotateY(180deg);
}
</style>
