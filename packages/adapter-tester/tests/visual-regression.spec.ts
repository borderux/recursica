import { test, expect } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { VISUAL_DIFF_THRESHOLD_PIXELS } from "./config";

const MANTINE_URL = "http://localhost:6011";
const MUI_URL = "http://localhost:6012";

const COMMON_STYLES_TO_CAPTURE = [
  "color",
  "background-color",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "font-size",
  "font-weight",
  "display",
  "flex-direction",
  "gap",
  "height",
];

interface StorybookEntry {
  type: string;
  id: string;
  name: string;
  title: string;
}

// Fetch all shared Stories dynamically at test-graph compilation time
let stories: StorybookEntry[] = [];
try {
  const response = await fetch(`${MANTINE_URL}/index.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Storybook index: ${response.statusText}`);
  }
  const data = (await response.json()) as any;
  const entries = data.entries || {};
  stories = Object.values(entries).filter(
    (entry: any) => entry.type === "story" && entry.id.startsWith("ui-kit-"),
  ) as StorybookEntry[];

  // Sort stories alphabetically by ID to keep the test output ordered
  stories.sort((a, b) => a.id.localeCompare(b.id));
} catch (error) {
  console.error(
    "Failed to load Storybook index from",
    `${MANTINE_URL}/index.json`,
    error,
  );
  throw new Error(
    "Storybook servers are not responsive or index.json is missing. Please ensure Storybooks are running.",
  );
}

test.describe("UI-Kit Dynamic Visual Regression Suite", () => {
  for (const story of stories) {
    test(`Visual regression for: ${story.title} - ${story.name} (${story.id})`, async ({
      browser,
    }, testInfo) => {
      const pageMantine = await browser.newPage();
      const pageMui = await browser.newPage();

      await pageMantine.setViewportSize({ width: 800, height: 600 });
      await pageMui.setViewportSize({ width: 800, height: 600 });

      // Navigate to isolated story iframes
      await Promise.all([
        pageMantine.goto(
          `${MANTINE_URL}/iframe.html?id=${story.id}&viewMode=story`,
          { waitUntil: "networkidle" },
        ),
        pageMui.goto(`${MUI_URL}/iframe.html?id=${story.id}&viewMode=story`, {
          waitUntil: "networkidle",
        }),
      ]);

      // Wait for the root elements to render completely
      await Promise.all([
        pageMantine.waitForSelector("#storybook-root"),
        pageMui.waitForSelector("#storybook-root"),
      ]);

      // Allow fonts, rendering, and animations to stabilize
      await Promise.all([
        pageMantine.waitForTimeout(300),
        pageMui.waitForTimeout(300),
      ]);

      // 1. EXTRACT DOM STRUCTURE AND STYLES
      const extractFn = (stylesToCapture: string[]) => {
        function crawl(el: Element): any {
          const data: any = {
            tag: el.tagName.toLowerCase(),
            styles: {},
            children: [],
          };
          const computed = window.getComputedStyle(el);
          for (const prop of stylesToCapture) {
            data.styles[prop] = computed.getPropertyValue(prop);
          }
          for (const child of Array.from(el.children)) {
            data.children.push(crawl(child));
          }
          return data;
        }
        const root = document.querySelector("#storybook-root");
        return root ? crawl(root) : null;
      };

      const mantineDOM = await pageMantine.evaluate(
        extractFn,
        COMMON_STYLES_TO_CAPTURE,
      );
      const muiDOM = await pageMui.evaluate(
        extractFn,
        COMMON_STYLES_TO_CAPTURE,
      );

      // Attach DOM trees to the Playwright report
      await testInfo.attach("Mantine DOM Tree JSON", {
        body: JSON.stringify(mantineDOM, null, 2),
        contentType: "application/json",
      });
      await testInfo.attach("MUI DOM Tree JSON", {
        body: JSON.stringify(muiDOM, null, 2),
        contentType: "application/json",
      });

      // 2. CAPTURE Headless Viewport Screenshots
      const mantineBuffer = await pageMantine.screenshot();
      const muiBuffer = await pageMui.screenshot();

      // 3. PIXEL-BY-PIXEL COMPARISON
      const img1 = PNG.sync.read(mantineBuffer);
      const img2 = PNG.sync.read(muiBuffer);
      const diff = new PNG({ width: img1.width, height: img1.height });

      const diffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        { threshold: 0.1 },
      );

      // Attach visual assets to the Playwright HTML report
      await testInfo.attach("Visual Diff Overlay", {
        body: PNG.sync.write(diff),
        contentType: "image/png",
      });
      await testInfo.attach("Mantine Screenshot (Source of Truth)", {
        body: mantineBuffer,
        contentType: "image/png",
      });
      await testInfo.attach("MUI Screenshot (Target)", {
        body: muiBuffer,
        contentType: "image/png",
      });

      console.log(
        `[Visual Spec] ${story.id} | Mismatched Pixels: ${diffPixels}`,
      );

      // Perform soft assertions so failures are logged but other stories continue
      expect.soft(diffPixels).toBeLessThan(VISUAL_DIFF_THRESHOLD_PIXELS);
    });
  }
});
