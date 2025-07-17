<template>
  <div id="root">
    <div id="screen-positioner">
      <div id="screen-sizer">
        <div id="screen">
          <!-- <Environment /> -->
          <!--<TestOpenCV />-->
          <GestureCatcher />
          <!--<Welcome />-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import GestureCatcher from "@/components/GestureCatcher.vue";
import Welcome from "./views/Welcome.vue";
import Divination from "./views/Divination.vue";
import TestOpenCV from "./components/TestOpenCV.vue";
import Environment from "./components/Environment.vue";
import { Howler } from "howler";
import TheCrimsonTides from "@/views/scenarios/TheCrimsonTides.vue";
import AudioPlayer from "@/components/AudioPlayer.vue";
import Scene from "@/components/Scene.vue";
export default {
  components: {
    GestureCatcher,
    Welcome,
    Divination,
    TestOpenCV,
    Scene,
    TheCrimsonTides,
    Environment,
  },
  data() {
    return {};
  },
  methods: {},
  watch: {},
  computed: {},
  mounted() {
    Howler.volume(0.25);
  },
};
</script>

<style scoped>
#root {
  height: 100%;
}

#screen-positioner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#screen-sizer {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
}

#screen {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-self: center;
  max-height: 100vh;
}
</style>
