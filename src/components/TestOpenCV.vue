<template>
  <div id="test-open-cv">
    <canvas id="stage"></canvas>
    <img id="input-image" src="" alt="" />
    {{ output }}
  </div>
</template>

<script lang="ts">
// @ts-nocheck

// Add this to your existing class
interface GlyphMatch {
  glyphId: string;
  confidence: number;
  method: "template" | "feature" | "contour";
  transform?: {
    scale: number;
    rotation: number;
    translation: { x: number; y: number };
  };
}
export default {
  emits: [],
  props: {},
  components: {},
  data() {
    return {
      output: "a",
    };
  },
  methods: {
    detectFrames(imgEl: HTMLImageElement) {
      const canvas = document.getElementById(
        "stage"
      ) as HTMLCanvasElement | null;
      console.log(canvas);
      if (canvas === null) return;
      console.log("canvas");
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;

      // ? Keep in mind this doesn't scale with CSS rules.

      const ctx = canvas.getContext("2d");
      if (ctx === null) return;
      console.log("ctx");
      ctx.drawImage(imgEl, 0, 0);

      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      let blurred = new cv.Mat();
      let edges = new cv.Mat();
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      // Preprocess
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      cv.Canny(blurred, edges, 75, 200);

      // Contour detection
      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Store detected frames for perspective correction
      const detectedFrames: any[] = [];

      // Filter and draw
      for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        let approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);

        if (
          approx.rows === 4 &&
          cv.contourArea(approx) > 1000 &&
          cv.isContourConvex(approx)
        ) {
          const color = new cv.Scalar(0, 255, 0, 255);
          cv.drawContours(src, contours, i, color, 2);

          // Store the frame corners for perspective correction
          const corners = [];
          for (let j = 0; j < approx.rows; j++) {
            const point = approx.data32S.slice(j * 2, j * 2 + 2);
            corners.push({ x: point[0], y: point[1] });
          }

          detectedFrames.push({
            corners: corners,
            contour: cnt.clone(),
            approx: approx.clone(),
          });
        }

        approx.delete();
        cnt.delete();
      }

      cv.imshow(canvas, src);

      // Apply perspective correction to each detected frame
      this.correctPerspective(detectedFrames, src);

      // Cleanup
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();

      // Cleanup detected frames
      detectedFrames.forEach((frame) => {
        frame.contour.delete();
        frame.approx.delete();
      });
    },

    // Load reference glyph images
    async loadGlyphReferences(glyphImagePaths: { [key: string]: string }) {
      const glyphRefs: { [key: string]: any } = {};

      for (const [glyphId, imagePath] of Object.entries(glyphImagePaths)) {
        try {
          const img = new Image();
          img.src = imagePath;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Convert to OpenCV Mat
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);

          const srcMat = cv.imread(canvas);
          const grayMat = new cv.Mat();
          cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);

          glyphRefs[glyphId] = {
            original: srcMat,
            gray: grayMat,
            width: img.width,
            height: img.height,
          };
        } catch (error) {
          console.error(`Failed to load glyph ${glyphId}:`, error);
        }
      }

      this.glyphReferences = glyphRefs;
      console.log(`Loaded ${Object.keys(glyphRefs).length} glyph references`);
    },

    // Enhanced perspective correction with glyph matching
    correctPerspective(detectedFrames: any[], src: any) {
      const matches: GlyphMatch[] = [];

      detectedFrames.forEach((frame, index) => {
        // Order corners: top-left, top-right, bottom-right, bottom-left
        const orderedCorners = this.orderCorners(frame.corners);

        // Calculate dimensions for the corrected frame
        const width = Math.max(
          this.distance(orderedCorners[0], orderedCorners[1]),
          this.distance(orderedCorners[2], orderedCorners[3])
        );
        const height = Math.max(
          this.distance(orderedCorners[0], orderedCorners[3]),
          this.distance(orderedCorners[1], orderedCorners[2])
        );

        // Source points (detected corners)
        const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
          orderedCorners[0].x,
          orderedCorners[0].y,
          orderedCorners[1].x,
          orderedCorners[1].y,
          orderedCorners[2].x,
          orderedCorners[2].y,
          orderedCorners[3].x,
          orderedCorners[3].y,
        ]);

        // Destination points (rectangle)
        const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
          0,
          0,
          width,
          0,
          width,
          height,
          0,
          height,
        ]);

        // Get perspective transform matrix
        const transformMatrix = cv.getPerspectiveTransform(
          srcPoints,
          dstPoints
        );

        // Apply perspective correction
        const corrected = new cv.Mat();
        cv.warpPerspective(
          src,
          corrected,
          transformMatrix,
          new cv.Size(width, height)
        );

        // Match against glyph references
        const bestMatch = this.matchGlyph(corrected, index);
        if (bestMatch) {
          matches.push(bestMatch);
        }

        // Display the corrected frame
        this.displayCorrectedFrame(corrected, index, bestMatch);

        // Cleanup
        srcPoints.delete();
        dstPoints.delete();
        transformMatrix.delete();
        corrected.delete();
      });

      return matches;
    },

    // Main glyph matching function
    matchGlyph(correctedFrame: any, frameIndex: number): GlyphMatch | null {
      if (!this.glyphReferences) {
        console.warn("No glyph references loaded");
        return null;
      }

      // Convert corrected frame to grayscale
      const frameGray = new cv.Mat();
      cv.cvtColor(correctedFrame, frameGray, cv.COLOR_RGBA2GRAY);

      let bestMatch: GlyphMatch | null = null;
      let bestScore = 0;

      // Try each glyph reference
      for (const [glyphId, ref] of Object.entries(this.glyphReferences)) {
        // Method 1: Template matching with multiple scales
        const templateMatch = this.templateMatching(
          frameGray,
          ref.gray,
          glyphId
        );
        if (templateMatch && templateMatch.confidence > bestScore) {
          bestMatch = templateMatch;
          bestScore = templateMatch.confidence;
        }

        // Method 2: Feature matching (for more robust matching)
        const featureMatch = this.featureMatching(frameGray, ref.gray, glyphId);
        if (featureMatch && featureMatch.confidence > bestScore) {
          bestMatch = featureMatch;
          bestScore = featureMatch.confidence;
        }

        // Method 3: Contour matching
        const contourMatch = this.contourMatching(frameGray, ref.gray, glyphId);
        if (contourMatch && contourMatch.confidence > bestScore) {
          bestMatch = contourMatch;
          bestScore = contourMatch.confidence;
        }
      }

      frameGray.delete();

      // Only return matches above threshold
      if (bestMatch && bestMatch.confidence > 0.6) {
        console.log(
          `Frame ${frameIndex} matched glyph: ${
            bestMatch.glyphId
          } (${bestMatch.confidence.toFixed(3)})`
        );
        return bestMatch;
      }

      return null;
    },

    // Template matching with multiple scales
    templateMatching(
      frame: any,
      template: any,
      glyphId: string
    ): GlyphMatch | null {
      const scales = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
      let bestMatch: GlyphMatch | null = null;
      let bestScore = 0;

      for (const scale of scales) {
        const scaledTemplate = new cv.Mat();
        const newSize = new cv.Size(
          Math.round(template.cols * scale),
          Math.round(template.rows * scale)
        );

        cv.resize(template, scaledTemplate, newSize);

        // Skip if template is larger than frame
        if (
          scaledTemplate.cols > frame.cols ||
          scaledTemplate.rows > frame.rows
        ) {
          scaledTemplate.delete();
          continue;
        }

        const result = new cv.Mat();
        cv.matchTemplate(frame, scaledTemplate, result, cv.TM_CCOEFF_NORMED);

        const minMax = cv.minMaxLoc(result);
        const confidence = minMax.maxVal;

        if (confidence > bestScore) {
          bestScore = confidence;
          bestMatch = {
            glyphId,
            confidence,
            method: "template",
            transform: {
              scale,
              rotation: 0,
              translation: { x: minMax.maxLoc.x, y: minMax.maxLoc.y },
            },
          };
        }

        scaledTemplate.delete();
        result.delete();
      }

      return bestMatch;
    },

    // Feature-based matching using ORB
    featureMatching(
      frame: any,
      template: any,
      glyphId: string
    ): GlyphMatch | null {
      try {
        const orb = new cv.ORB();

        // Detect keypoints and compute descriptors
        const kp1 = new cv.KeyPointVector();
        const kp2 = new cv.KeyPointVector();
        const desc1 = new cv.Mat();
        const desc2 = new cv.Mat();

        orb.detectAndCompute(frame, new cv.Mat(), kp1, desc1);
        orb.detectAndCompute(template, new cv.Mat(), kp2, desc2);

        // Match features
        const bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
        const matches = new cv.DMatchVector();
        bf.match(desc1, desc2, matches);

        // Filter good matches
        const goodMatches = [];
        for (let i = 0; i < matches.size(); i++) {
          const match = matches.get(i);
          if (match.distance < 50) {
            // Threshold for good matches
            goodMatches.push(match);
          }
        }

        const confidence =
          goodMatches.length / Math.max(kp1.size(), kp2.size());

        // Cleanup
        orb.delete();
        kp1.delete();
        kp2.delete();
        desc1.delete();
        desc2.delete();
        bf.delete();
        matches.delete();

        if (confidence > 0.1) {
          return {
            glyphId,
            confidence,
            method: "feature",
          };
        }
      } catch (error) {
        console.warn("Feature matching failed:", error);
      }

      return null;
    },

    // Contour-based matching
    contourMatching(
      frame: any,
      template: any,
      glyphId: string
    ): GlyphMatch | null {
      try {
        // Find contours in both images
        const frameContours = this.findMainContour(frame);
        const templateContours = this.findMainContour(template);

        if (!frameContours || !templateContours) {
          return null;
        }

        // Compare contours using Hu moments
        const frameMoments = cv.moments(frameContours);
        const templateMoments = cv.moments(templateContours);

        const frameHu = new cv.Mat();
        const templateHu = new cv.Mat();

        cv.HuMoments(frameMoments, frameHu);
        cv.HuMoments(templateMoments, templateHu);

        // Calculate similarity (lower is better for Hu moments)
        let similarity = 0;
        for (let i = 0; i < 7; i++) {
          const diff = Math.abs(frameHu.data64F[i] - templateHu.data64F[i]);
          similarity += diff;
        }

        // Convert to confidence (higher is better)
        const confidence = Math.max(0, 1 - similarity / 7);

        // Cleanup
        frameContours.delete();
        templateContours.delete();
        frameHu.delete();
        templateHu.delete();

        if (confidence > 0.3) {
          return {
            glyphId,
            confidence,
            method: "contour",
          };
        }
      } catch (error) {
        console.warn("Contour matching failed:", error);
      }

      return null;
    },

    // Helper to find the main contour in an image
    findMainContour(image: any): any | null {
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(
        image,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      if (contours.size() === 0) {
        contours.delete();
        hierarchy.delete();
        return null;
      }

      // Find largest contour
      let maxArea = 0;
      let maxContour = null;

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);

        if (area > maxArea) {
          maxArea = area;
          if (maxContour) maxContour.delete();
          maxContour = contour.clone();
        }

        contour.delete();
      }

      contours.delete();
      hierarchy.delete();

      return maxContour;
    },
    orderCorners(
      corners: { x: number; y: number }[]
    ): { x: number; y: number }[] {
      // Sort by y-coordinate to separate top and bottom
      corners.sort((a, b) => a.y - b.y);

      // Top two points
      const top = corners.slice(0, 2);
      // Bottom two points
      const bottom = corners.slice(2, 4);

      // Sort top points by x-coordinate (left to right)
      top.sort((a, b) => a.x - b.x);
      // Sort bottom points by x-coordinate (left to right)
      bottom.sort((a, b) => a.x - b.x);

      // Return ordered as: top-left, top-right, bottom-right, bottom-left
      return [top[0], top[1], bottom[1], bottom[0]];
    },

    distance(
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ): number {
      return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    },

    // Enhanced display with match results
    displayCorrectedFrame(
      correctedMat: any,
      index: number,
      match?: GlyphMatch
    ) {
      let correctedCanvas = document.getElementById(
        `corrected-frame-${index}`
      ) as HTMLCanvasElement;

      if (!correctedCanvas) {
        correctedCanvas = document.createElement("canvas");
        correctedCanvas.id = `corrected-frame-${index}`;
        correctedCanvas.style.border = match
          ? "3px solid green"
          : "2px solid blue";
        correctedCanvas.style.margin = "10px";

        // Add match info
        const info = document.createElement("div");
        info.style.fontSize = "12px";
        info.style.marginBottom = "5px";

        if (match) {
          info.innerHTML = `
        <strong>Match:</strong> ${match.glyphId}<br>
        <strong>Confidence:</strong> ${match.confidence.toFixed(3)}<br>
        <strong>Method:</strong> ${match.method}
      `;
          info.style.color = "green";
        } else {
          info.innerHTML = "<strong>No match found</strong>";
          info.style.color = "red";
        }

        const container = document.createElement("div");
        container.appendChild(info);
        container.appendChild(correctedCanvas);
        document.body.appendChild(container);
      }

      cv.imshow(correctedCanvas, correctedMat);
      console.log(
        `Frame ${index} processed${match ? ` - matched: ${match.glyphId}` : ""}`
      );
    },
  },
  computed: {},
  watch: {},
  async mounted() {
    await this.loadGlyphReferences({ lol: "/img/glyph-source.png" });
    const imgEl = document.getElementById(
      "input-image"
    ) as HTMLImageElement | null;
    if (imgEl === null) return;
    imgEl.onload = () => this.detectFrames(imgEl);
    imgEl.setAttribute("src", "/img/signature.jpg");
  },
};
</script>

<style scoped>
#test-open-cv {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#test-open-cv img {
}
</style>
