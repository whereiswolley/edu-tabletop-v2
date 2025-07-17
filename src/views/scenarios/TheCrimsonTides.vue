<template>
  <div id="the-crimson-tides">
    <Sampler2 />
  </div>
</template>

<script lang="ts">
import Sampler2 from "@/components/challenges/Sampler-2.vue";
import Sampler1 from "@/components/challenges/Sampler-1.vue";
import Sonar from "@/components/challenges/Sonar.vue";
import DotMatrix from "@/components/challenges/DotMatrix.vue";
import WaterSampleProcessing from "@/components/challenges/WaterSampleProcessing.vue";
import Scene from "@/components/Scene.vue";
export default {
  components: {
    Sampler1,
    Sampler2,
    Sonar,
    DotMatrix,
    Scene,
    WaterSampleProcessing,
  },
  data() {
    return {};
  },
  methods: {},
  watch: {},
  computed: {},
  mounted() {},
};
</script>

<style scoped>
#the-crimson-tides {
  height: 100%;
  width: 100%;
}
</style>
