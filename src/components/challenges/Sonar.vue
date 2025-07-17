<template>
  <Scene>
    <div id="sonar">
      <Panel>
        <div id="view">
          <div id="aux-indicator"></div>
          <div id="radar" :style="lighting"></div>
        </div>
        <div id="control">
          <Knob />
          <Knob />
          <Knob />
        </div>
      </Panel>
    </div>
  </Scene>
</template>

<script lang="ts">
import Panel from "../Panel.vue";
import Scene from "../Scene.vue";
import Knob from "../Knob.vue";
import gsap from "gsap";
export default {
  emits: [],
  props: {},
  components: { Scene, Knob, Panel },
  data() {
    return {
      rotation: { value: 0 },
    };
  },
  methods: {
    setupChallenge() {
      //
    },
  },
  computed: {
    lighting() {
      const grad = [
        // "radial-gradient(ellipse at 50% 50%, transparent, rgba(0,0,0,0.25))",
        `conic-gradient(from ${Math.round(
          this.rotation.value
        )}deg at 50% 50%, transparent, rgba(0,255,127,0.75) )`,
      ];
      return {
        background: grad.join(", "),
      };
    },
  },
  watch: {},
  mounted() {
    gsap.to(this.rotation, {
      value: 360,
      ease: "linear",
      duration: 5,
      repeat: -1,
    });
  },
};
</script>

<style scoped>
#sonar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--neutral-bg);
  background-image: url(/img/metal-grunge-3.jpg);
  background-size: cover;
  background-position: center;
}

#view {
  position: relative;
}

#radar {
  position: relative;
  width: 10rem;
  padding-top: 100%;
  border-radius: 100%;
  box-shadow: inset 0 0 1rem 0.25rem rgba(0, 0, 0, 0.75),
    inset -1px 1px 0 0 rgba(255, 255, 255, 0.5),
    inset 2px -2px 0 0 rgba(0, 0, 0, 0.5);
}

#edge {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 100%;
  box-shadow: 0 0 0 1rem rgba(31, 25, 25, 0.85);
}

#aux-indicator {
  position: absolute;
  top: 0;
  right: 0;
  background-color: springgreen;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 100%;
  box-shadow: var(--bs-upper-3d), var(--bs-bottom-3d),
    0 0 0.5rem 0.05rem springgreen;
}

#control {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
