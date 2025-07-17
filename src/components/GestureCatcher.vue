<template>
  <div id="gesture-catcher">
    <canvas id="gesture-catcher-pixi"></canvas>
  </div>
</template>

<script lang="ts">
interface IOrb {
  node: Graphics;
  id: string;
  value: string;
}
const lastKnownPos = { x: null as null | number, y: null as null | number };
let distanceMoved = 0;
import gsap from "gsap";
import Chance from "chance";
import {
  Application,
  Sprite,
  Assets,
  Text,
  TextStyle,
  Color,
  Graphics,
  Texture,
  Ticker,
  Rectangle,
  Container,
  FederatedPointerEvent,
  Point,
  ParticleContainer,
} from "pixi.js";
export default {
  components: {},
  data() {
    return {
      inputs: [] as string[],
    };
  },
  methods: {
    getRootStyle(): CSSStyleDeclaration | null {
      const el = document.getElementById("gesture-catcher");
      if (el === null) return null;
      return getComputedStyle(el);
    },
    getRandX(): number {
      const margins = 100;
      const style: CSSStyleDeclaration | null = this.getRootStyle();
      const baseWidth = style ? parseFloat(style.width) : window.innerWidth;
      const availableWidth = baseWidth - margins * 2;
      return Math.random() * availableWidth + margins;
    },
    getRandY(): number {
      const margins = 100;
      const style: CSSStyleDeclaration | null = this.getRootStyle();
      const baseHeight = style ? parseFloat(style.height) : window.innerHeight;
      const availableHeight = baseHeight - margins * 2;
      return Math.random() * availableHeight + margins;
    },
    spawnOrb(): void {
      const chance = new Chance();
      const radius = 50;

      const newOrb = new Graphics();
      newOrb.beginFill("gold", 1);
      newOrb.drawCircle(0, 0, radius);
      newOrb.endFill();
      newOrb.eventMode = "static";
      newOrb.position.x = this.getRandX();
      newOrb.position.y = this.getRandY();
      const data = {
        id: Math.random().toString(36).substring(2, 9),
        value: chance.letter(),
        node: newOrb,
      };

      console.log(data.value);

      const text = new Text(data.value, {
        fontFamily: "JungleSlang",
        fontSize: 60,
      });
      text.anchor.set(0.5);
      newOrb.addChild(text);

      let foundValidPos = false;
      while (!foundValidPos) {
        foundValidPos = true;

        const targetX = this.getRandX();
        const targetY = this.getRandY();

        newOrb.position.x = targetX;
        newOrb.position.y = targetY;

        this.$options.orbs.forEach((oldOrb: IOrb) => {
          const isOverlapping = this.isOrbOverlapping(
            newOrb.position,
            oldOrb.node.position,
            radius
          );
          if (isOverlapping) foundValidPos = false;
        });
      }

      //newOrb.once("pointerdown", this.onStart);

      this.$options.orbsContainer.addChild(newOrb);
      this.$options.orbs.push(data);
    },
    spawnInputOrb(orb: IOrb) {
      const radius = 25;
      const gap = 10;
      const margin = 50;

      const newOrb = new Graphics();
      newOrb.beginFill("gold", 1);
      newOrb.drawCircle(0, 0, radius);
      newOrb.endFill();
      newOrb.eventMode = "static";

      newOrb.position.x = margin;
      newOrb.position.x += (radius * 2 + gap) * this.$options.inputs.length;
      newOrb.position.y = margin;
      const data = {
        id: orb.id,
        value: orb.value,
        node: newOrb,
      };

      const text = new Text(orb.value, {
        fontFamily: "JungleSlang",
        fontSize: 30,
        align: "center",
      });
      text.anchor.set(0.5);

      newOrb.addChild(text);

      this.$options.inputsContainer.addChild(newOrb);
      this.$options.inputs.push(data);
    },
    despawnOrb(orb: IOrb) {
      const id = orb.id;
      this.$options.orbs.forEach((orb: IOrb) => {
        if (orb.id !== id) return;
        this.$options.orbs = this.$options.orbs.filter(
          (o: IOrb) => o.id !== id
        );
        this.$options.orbsContainer.removeChild(orb.node);
      });
      this.spawnInputOrb(orb);
    },
    onStart(e: PointerEvent) {
      const el = document.getElementById("screen-sizer");
      if (el === null) return;

      const bounds = el.getBoundingClientRect();
      lastKnownPos.x = e.x;
      lastKnownPos.y = e.y - bounds.top;

      window.addEventListener("pointermove", this.updateHandArmPos);
    },
    onEnd() {
      this.$options.inputs = [];
      lastKnownPos.x = null;
      lastKnownPos.y = null;
      this.$options.inputsContainer.removeChildren();
      this.$options.orbsContainer.removeChildren();
      this.$options.trailContainer.removeChildren();
      this.$options.orbs = [];

      this.setupChallenge();
      window.removeEventListener("pointermove", this.updateHandArmPos);
    },
    updateHandArmPos(e: PointerEvent) {
      const el = document.getElementById("screen-sizer");
      if (el === null) return;

      const bounds = el.getBoundingClientRect();
      lastKnownPos.x = e.x;
      lastKnownPos.y = e.y - bounds.top;

      distanceMoved += Math.abs(e.movementX);
      distanceMoved += Math.abs(e.movementY);
    },
    isOrbOverlapping(orbPos1: Point, orbPos2: Point, radius: number) {
      const dx = orbPos1.x - orbPos2.x;
      const dy = orbPos1.y - orbPos2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < radius * 2;
    },
    setupChallenge() {
      const orbCount = 5;
      let spawned = 0;
      while (spawned < orbCount) {
        this.spawnOrb();
        spawned += 1;
      }
    },
    createPixiApp() {
      const pixiAppEl = document.getElementById(
        "gesture-catcher-pixi"
      ) as HTMLCanvasElement;
      if (pixiAppEl === null) return;

      const el = document.getElementById("gesture-catcher");
      if (el === null) return;

      const style = getComputedStyle(el);

      const pixiApp: Application = new Application({
        hello: true,
        view: pixiAppEl,
        backgroundAlpha: 1,
        height: parseFloat(style.height),
        width: parseFloat(style.width),
        background: "#111111",
        antialias: true,
      });

      this.$options.app = pixiApp;
      this.$options.screen = pixiApp.screen;
      this.$options.stage = pixiApp.stage;

      const trailContainer = new Container();
      this.$options.stage.addChild(trailContainer);
      this.$options.trailContainer = trailContainer;

      const inputsContainer = new Container();
      this.$options.stage.addChild(inputsContainer);
      this.$options.inputsContainer = inputsContainer;

      const orbsContainer = new Container();
      this.$options.stage.addChild(orbsContainer);
      this.$options.orbsContainer = orbsContainer;
    },
    goFullscreen() {
      const elem = document.documentElement;
      try {
        elem.requestFullscreen();
        this.$options.app.resize();
      } catch (error) {
        alert(error);
      }
    },
    getOverlappingOrbs() {
      if (lastKnownPos.x === null || lastKnownPos.y === null) return [];
      if (this.$options.handArm === null) return [];
      return this.$options.orbs.filter((orb: IOrb) => {
        return orb.node.containsPoint(this.$options.handArm.position);
      });
    },
    getHandArmTargetPos() {
      return {
        x: lastKnownPos.x === null ? window.innerWidth / 2 : lastKnownPos.x,
        y: lastKnownPos.y === null ? window.innerHeight : lastKnownPos.y,
      };
    },
    tickerLoop(deltaMulti: number) {
      const handArm = this.$options.handArm;
      if (!handArm) return;

      const targetPos = this.getHandArmTargetPos();
      const overlappingOrbs: IOrb[] = this.getOverlappingOrbs();
      overlappingOrbs.forEach((orb: IOrb) => this.despawnOrb(orb));
      handArm.x += (targetPos.x - handArm.x) * 0.1 * deltaMulti;
      handArm.y += (targetPos.y - handArm.y) * 0.1 * deltaMulti;

      if (distanceMoved > 25) {
        distanceMoved = 0;
        const particle = this.makeParticle(handArm.position);
        this.$options.trailContainer.addChild(particle);
      }
    },
    makeParticle(pos: Point): Graphics {
      const dot = new Graphics();
      dot.beginFill("red", 1);
      dot.drawCircle(0, 0, 5);
      dot.endFill();
      dot.position.x = pos.x;
      dot.position.y = pos.y;
      return dot;
    },
  },
  watch: {},
  created() {
    this.$options.inputs = [];
    this.$options.orbs = [];
  },
  async mounted() {
    // Trigger on user interaction (tap/click)
    //document.addEventListener("click", this.goFullscreen, { once: true });

    window.addEventListener("pointerdown", this.onStart);
    window.addEventListener("pointerup", this.onEnd);

    Assets.addBundle("texture", { HandArm: "/img/hand-arm.png" });
    Assets.addBundle("font", { JungleSlang: "/font/JungleSlang.ttf" });
    await Assets.loadBundle("texture");
    await Assets.loadBundle("font");

    this.createPixiApp();

    const handArmTexture = Assets.get("HandArm");
    const handArm = Sprite.from(handArmTexture);
    handArm.anchor.set(0.5, 0.1);
    handArm.x = window.innerWidth / 2;
    handArm.y = window.innerHeight;
    this.$options.stage.addChild(handArm);
    this.$options.handArm = handArm;

    this.setupChallenge();

    Ticker.shared.add(this.tickerLoop);
  },
  unmounted() {
    window.removeEventListener("pointerdown", this.onStart);
    window.removeEventListener("pointerup", this.onEnd);
    Ticker.shared.remove(this.tickerLoop);
  },
  computed: {},
};
</script>

<style scoped>
#gesture-catcher,
#gesture-catcher-pixi {
  width: 100%;
  height: 100%;
}

#hand-arm {
  position: fixed;
}
</style>
