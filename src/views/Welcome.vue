<template>
  <div id="welcome">
    <canvas id="pixi-app" height="720" width="1280"></canvas>
  </div>
</template>

<script lang="ts">
import { PixiDialog } from "@/classes/dialog";
import gsap from "gsap";
import {
  Application,
  Sprite,
  Assets,
  Text,
  TextStyle,
  Color,
  Graphics,
  Texture,
  Rectangle,
  Container,
} from "pixi.js";
export default {
  components: {},
  data() {
    return {
      step: 0,
    };
  },
  methods: {
    createPixiApp() {
      const pixiAppEl = document.getElementById(
        "pixi-app"
      ) as HTMLCanvasElement;
      if (pixiAppEl === null) return;

      const pixiApp: Application = new Application({
        hello: true,
        view: pixiAppEl,
        backgroundAlpha: 1,
        background: "#111111",
      });

      this.$options.app = pixiApp;
      this.$options.screen = pixiApp.screen;
      this.$options.stage = pixiApp.stage;

      pixiAppEl.style.width = "100%";
      pixiAppEl.style.height = "auto";
    },
    createGradient(width: number, height: number) {
      const gradientCanvas = document.createElement("canvas");
      gradientCanvas.width = width;
      gradientCanvas.height = height;
    },
    drawBg() {
      const gradientCanvas = document.createElement("canvas");
      gradientCanvas.width = this.$options.screen.width;
      gradientCanvas.height = this.$options.screen.height * 0.75;
      const ctx = gradientCanvas.getContext("2d")!;
      const centerX = this.$options.screen.width / 2;
      const gradient = ctx.createLinearGradient(
        centerX,
        gradientCanvas.height - 10,
        centerX,
        gradientCanvas.height
      );
      gradient.addColorStop(0, "rgba(17, 17, 17,1)");
      gradient.addColorStop(1, "rgba(0, 255, 127, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

      // 2. Convert to PIXI texture
      const texture = Texture.from(gradientCanvas);

      // 3. Use in a sprite
      const sprite = new Sprite(texture);
      this.$options.app.stage.addChild(sprite);
    },
    startEntrance() {
      const line = new Graphics();
      const centerX = this.$options.screen.width / 2;

      const lineData = { y: this.$options.screen.height * 0.75, width: 0 };

      const tl = gsap.timeline({ paused: true });
      const bounds = new Rectangle(
        0,
        0,
        this.$options.screen.width,
        this.$options.screen.height
      );
      let lineTexture = this.$options.app.renderer.generateTexture(line, {
        region: bounds,
      });
      const lineSprite = new Sprite(lineTexture);
      this.$options.app.stage.addChild(lineSprite);

      tl.to(lineData, {
        y: 0,
        onUpdate: () => {
          line.clear();
          line.lineStyle(1, "rgba(0, 255, 127, 1)");
          line.moveTo(centerX, this.$options.screen.height * 0.75);
          line.lineTo(centerX, lineData.y);
          const newTexture = this.$options.app.renderer.generateTexture(line, {
            region: bounds,
          });
          lineSprite.texture = newTexture;
        },
        duration: 2.5,
        delay: 2.5,
      });
      tl.to(lineData, {
        width: 80,
        onUpdate: () => {
          line.clear();
          line.lineStyle(lineData.width, "rgba(0, 255, 127, 1)");
          line.moveTo(centerX, this.$options.screen.height * 0.75);
          line.lineTo(centerX, lineData.y);
          const newTexture = this.$options.app.renderer.generateTexture(line, {
            region: bounds,
          });
          lineSprite.texture = newTexture;
        },
        duration: 2.5,
      });
      tl.play();
    },
    dialog() {
      const dialog = new PixiDialog(
        "aaaaa",
        {
          fontSize: 12,
          fill: ["#333"],
          align: "center",
        },
        "white"
      );
      dialog.node.x = this.$options.screen.width / 2;
      dialog.node.y = this.$options.screen.height / 2;
      console.log(this.$options.screen, "??");
      this.$options.stage.addChild(dialog.bg);
      this.$options.stage.addChild(dialog.node);
      dialog.animIn();

      // const bg = new Graphics();
      // const style = new TextStyle({
      //   fontSize: 12,
      //   fill: ["#333"],
      //   align: "center",
      // });
      // const SECOND_PER_CHARACTER = 0.1;
      // let currentIndex = 0;
      // let text = "Hello! Hello! Hello!\nHello!\nHello!\nHello!";
      // const textNode = new Text("", style);
      // textNode.zIndex = 5;
      // bg.zIndex = 1;
      // textNode.anchor.set(0.5);
      // this.$options.stage.addChild(bg);
      // textNode.x = this.$options.screen.width / 2;
      // textNode.y = this.$options.screen.height / 2;
      // this.$options.stage.addChild(textNode);
      // const typing = gsap.to(
      //   {},
      //   {
      //     duration: SECOND_PER_CHARACTER * text.length,
      //     onUpdate: () => {
      //       const prog = typing.progress();
      //       textNode.text = text.substring(0, Math.round(prog * text.length));
      //       bg.clear();
      //       bg.beginFill("white");
      //       const w = textNode.width + 20;
      //       const h = textNode.height + 20;
      //       bg.drawRoundedRect(
      //         textNode.x + -w / 2,
      //         textNode.y + -h / 2,
      //         w,
      //         h,
      //         10
      //       );
      //       bg.endFill();
      //     },
      //   }
      // );
    },
  },
  watch: {},
  computed: {},
  mounted() {
    this.createPixiApp();
    this.drawBg();
    this.startEntrance();
    this.dialog();
  },
};
</script>

<style scoped>
#welcome {
  width: 100%;
  height: 100;
}
</style>
