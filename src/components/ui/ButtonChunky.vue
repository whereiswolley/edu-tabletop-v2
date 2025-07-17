<template>
  <div class="wrapper" ref="wrapper" :style="{ borderRadius }">
    <div class="frame" :style="{ borderRadius }"></div>
    <div class="cover" ref="cover"></div>
    <Transition @leave="onBeforeLeave" @enter="onBeforeEnter" appear>
      <button
        class="button-chunky"
        ref="button"
        @click="onPress"
        :key="contentId"
        :style="{ textAlign, borderRadius }"
      >
        <slot></slot>
      </button>
    </Transition>
    <div class="holder" :style="{ borderRadius }"></div>
    <div class="background" :style="{ borderRadius }"></div>
  </div>
</template>

<script lang="ts">
const DELAY_MS_PER_INDEX: number = 0.1;
const COVER_ANIM_DURATION: number = 0.25;
import { Howl } from "howler";
import gsap from "gsap";
export default {
  props: {
    contentId: String,
    transition: {
      type: Boolean,
      default: true,
    },
    childIndex: {
      type: Number,
      default: 0,
    },
    colorTheme: {
      type: String,
      default: "springgreen",
    },
    textAlign: {
      type: String,
      default: "left",
    },
    borderRadius: {
      type: String,
      default: "15px",
    },
  },
  emits: ["onPressed"],
  components: {},
  data() {
    return {};
  },
  methods: {
    onPress() {
      this.$options.buttonChunky.play();
      this.$emit("onPressed");
    },
    onBeforeEnter(el: Element, done: () => void) {
      this.$nextTick(() => {
        const tl = gsap.timeline({
          paused: true,
          onComplete: done,
        });
        const coverEl: HTMLElement = this.$refs.cover as HTMLElement;
        const buttonEl: HTMLElement = this.$refs.button as HTMLElement;
        tl.set(buttonEl, { y: "100%" });
        tl.to(coverEl, {
          height: "100%",
          duration: COVER_ANIM_DURATION,
          delay: this.childIndex * 0.1,
        });
        tl.set(buttonEl, { y: "0%" }, ">");
        tl.to(coverEl, { height: "0%", duration: COVER_ANIM_DURATION });
        tl.play();
      });
    },
    onBeforeLeave(el: Element, done: () => void) {
      if (!this.transition) return done();
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          const animDurMS = COVER_ANIM_DURATION * 1000;
          const childDelayMS = this.childIndex * DELAY_MS_PER_INDEX;
          const delay = animDurMS + childDelayMS;
          setTimeout(done, delay);
        },
      });
      tl.set(el, {
        y: "0%",
        position: "absolute",
        maxHeight: "calc(100% - 1rem)",
        maxWidth: "calc(100% - 1rem)",
      });
      tl.to({}, { duration: this.childIndex * DELAY_MS_PER_INDEX });
      tl.play();
    },
  },
  watch: {},
  computed: {},
  mounted() {
    this.$options.buttonChunky = new Howl({
      src: ["https://cdn.pixabay.com/audio/2023/07/04/audio_5d952efb1c.mp3"],
    });
    const el = this.$refs.wrapper as HTMLElement;
    const style = getComputedStyle(el);
    el.style.minWidth = style.height;
  },
};
</script>

<style scoped>
.wrapper {
  position: relative;
  padding: 0.5rem;
  overflow: hidden;
}

.frame {
  box-shadow: inset 0 0 0 0.25rem #333;
  z-index: 6;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.cover {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background: #4f4146;
  box-shadow: 0 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.25);
}

.background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #777;
  z-index: 1;
}

.holder {
  z-index: 4;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-shadow: inset 0 0 0 0.25rem #333, inset 0 0 0 0.65rem rgba(0, 0, 0, 0.25),
    inset 0 0 0rem 0rem rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.1s;
  pointer-events: none;
}

.button-chunky {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  background: #b49a9b;
  border-top: 0.25rem solid #90777c;
  border-left: 0.25rem solid #917d86;
  border-right: 0.25rem solid #917d86;
  border-bottom: 0.25rem solid #69575d;
  box-shadow: inset -1px 1px 0 0 rgba(255, 255, 255, 0.5),
    inset 2px -2px 0 0 rgba(0, 0, 0, 0.5), 0 0 0.5rem 0.5rem rgba(0, 0, 0, 0);
  font-weight: 700;
  font-size: 1.5rem;
  font-family: "VT323", monospace;
  color: rgba(0, 0, 0, 0.75);
  background: radial-gradient(circle at 25% 50%, #917d86, #69575d);
}

.button-chunky:active + .holder {
  box-shadow: inset 0 0 0 0.25rem #333, inset 0 0 0 0.65rem rgba(0, 0, 0, 0.25),
    inset 0 0 0.75rem 0.25rem rgba(0, 0, 0, 0.5);
}

.button-chunky:active {
  color: white;
  box-shadow: inset -1px 1px 0 0 rgba(255, 255, 255, 0.5),
    inset 2px -2px 0 0 rgba(0, 0, 0, 0.5),
    0 0 0.5rem 0.25rem rgba(0, 0, 0, 0.25);
  border-top: 0.25rem solid transparent;
  border-left: 0.25rem solid transparent;
  border-right: 0.25rem solid transparent;
  border-bottom: 0.25rem solid transparent;
}
</style>
