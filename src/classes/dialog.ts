import { Graphics, Text, type ITextStyle } from "pixi.js";
import gsap from "gsap";

export class PixiDialog {
  static SECOND_PER_CHARACTER: number = 0.1;
  static DEFAULT_MARGIN: number = 10;
  static DEFAULT_ROUNDNESS: number = 5;

  node: Text;
  text: string;
  index: number;
  gsap: GSAPTween | null;
  bg: Graphics;
  bgColor: string;

  constructor(text: string, style: Partial<ITextStyle>, bgColor: string) {
    this.node = new Text("", style);
    this.node.anchor.set(0.5);
    this.text = text;
    this.index = 0;
    this.gsap = null;
    this.bg = new Graphics();
    this.bgColor = bgColor;
  }

  animIn() {
    this.gsap = gsap.to(
      {},
      {
        duration: PixiDialog.SECOND_PER_CHARACTER * this.text.length,
        onUpdate: () => {
          if (this.gsap === null) return;
          const progress: number = this.gsap.progress();
          const lastIndex: number = Math.round(progress * this.text.length);
          this.node.text = this.text.substring(0, lastIndex);

          this.bg.clear();
          this.bg.beginFill(this.bgColor);
          const w = this.node.width + PixiDialog.DEFAULT_MARGIN * 2;
          const h = this.node.height + PixiDialog.DEFAULT_MARGIN;
          const x = this.node.x - w / 2;
          const y = this.node.y - h / 2;
          this.bg.drawRoundedRect(x, y, w, h, PixiDialog.DEFAULT_ROUNDNESS);
        },
      }
    );
    //
  }
}
