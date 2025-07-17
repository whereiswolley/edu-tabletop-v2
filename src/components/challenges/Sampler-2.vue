<template>
  <Scene>
    <div id="sampler-2-wrapper">
      <div id="sampler-2" class="panel-3d rounded">
        <div class="view">
          <NumericReadOut />
          <!-- <div class="disc-wrapper">
            <div class="disc"></div>
          </div> -->
        </div>
        <div class="control">
          <SwitchWithSafety />
          <ButtonChunky :text-align="'center'">x</ButtonChunky>
        </div>
      </div>
    </div>
  </Scene>
</template>

<script lang="ts">
import NumericReadOut from "../NumericReadOut.vue";
import SwitchWithSafety from "../SwitchWithSafety.vue";
import ButtonChunky from "../ui/ButtonChunky.vue";
import Scene from "../Scene.vue";
export default {
  emits: [],
  props: {},
  components: { NumericReadOut, ButtonChunky, SwitchWithSafety, Scene },
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
#sampler-2-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#sampler-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dark-bg);
  padding: 1rem;
}

.view {
  width: 15rem;
  display: flex;
  align-self: stretch;
  position: relative;
  background-color: var(--darker-bg);
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--bs-bottom-3d), var(--bs-upper-3d);
}

.disc-wrapper {
  position: relative;
  width: 100%;
  padding-top: 50%;
  overflow: hidden;
}

.disc {
  position: absolute;
  width: 100%;
  padding-top: 100%;
  background: conic-gradient(
    from 180deg at 50% 50%,
    var(--neutral-bg),
    var(--dark-bg)
  );
  box-shadow: inset 0 0 0 2px var(--neutral-bg), var(--bs-upper-3d),
    var(--bs-bottom-3d), inset -1rem 1rem 1rem 0 rgba(0, 0, 0, 0.25);
  top: 100%;
  left: 0;
  right: 0;
  border-radius: 100%;
  transform: translateY(-50%);
}

.control {
  padding: 1rem;
  background-color: var(--dark-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
