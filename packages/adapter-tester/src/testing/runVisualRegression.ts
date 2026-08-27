import { test, expect } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "node:fs";
import type { AdapterTarget, AdapterTesterConfig } from "../config.js";
import { getSourceOfTruth } from "../config.js";

const DEFAULT_EXCLUDE_TITLE_PREFIXES = ["Theme", "Tokens", "Introduction"];

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

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function fetchStories(
  sourceOfTruth: AdapterTarget,
  excludeTitlePrefixes: string[],
): Promise<StorybookEntry[]> {
  let stories: StorybookEntry[];
  try {
    const response = await fetch(`${sourceOfTruth.url}/index.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Storybook index: ${response.statusText}`,
      );
    }
    const data = (await response.json()) as any;
    const entries = data.entries || {};
    stories = Object.values(entries).filter(
      (entry: any) =>
        entry.type === "story" &&
        !excludeTitlePrefixes.some(
          (prefix) =>
            entry.title === prefix || entry.title.startsWith(`${prefix}/`),
        ),
    ) as StorybookEntry[];
    stories.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error(
      "Failed to load Storybook index from",
      `${sourceOfTruth.url}/index.json`,
      error,
    );
    throw new Error(
      `Storybook source of truth "${sourceOfTruth.name}" is not responsive or index.json is missing. Please ensure its Storybook is running.`,
    );
  }
  return stories;
}

/**
 * Defines a Playwright suite that diffs every target in `config.targets`
 * against `config.targets`' single `sourceOfTruth` entry, story by story.
 * Call this with a top-level `await` from a Playwright `*.spec.ts` file — it
 * calls `test.describe` at module scope, so it must run inside Playwright's
 * test runner during test-graph compilation.
 */
export async function runVisualRegression(
  config: AdapterTesterConfig,
): Promise<void> {
  const sourceOfTruth = getSourceOfTruth(config);
  const targets = config.targets.filter((target) => !target.sourceOfTruth);
  const excludeTitlePrefixes =
    config.excludeTitlePrefixes ?? DEFAULT_EXCLUDE_TITLE_PREFIXES;
  const relaxedThresholdStoryIds = config.relaxedThresholdStoryIds ?? [];
  const relaxedThresholdPixels = config.relaxedThresholdPixels;

  // Fetched once at test-graph compilation time and shared by every target's
  // describe block below.
  const stories = await fetchStories(sourceOfTruth, excludeTitlePrefixes);

  for (const target of targets) {
    test.describe(`${sourceOfTruth.name} vs ${target.name} — Dynamic Visual Regression Suite`, () => {
      for (const story of stories) {
        test(`Visual regression for: ${story.title} - ${story.name} (${story.id})`, async ({
          browser,
        }, testInfo) => {
          const sourcePage = await browser.newPage();
          const targetPage = await browser.newPage();

          await sourcePage.setViewportSize({ width: 800, height: 600 });
          await targetPage.setViewportSize({ width: 800, height: 600 });

          await Promise.all([
            sourcePage.goto(
              `${sourceOfTruth.url}/iframe.html?id=${story.id}&viewMode=story`,
              { waitUntil: "networkidle" },
            ),
            targetPage.goto(
              `${target.url}/iframe.html?id=${story.id}&viewMode=story`,
              { waitUntil: "networkidle" },
            ),
          ]);

          await Promise.all([
            sourcePage.waitForSelector("#storybook-root"),
            targetPage.waitForSelector("#storybook-root"),
          ]);

          await Promise.all([
            sourcePage.waitForTimeout(300),
            targetPage.waitForTimeout(300),
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

          const sourceDOM = await sourcePage.evaluate(
            extractFn,
            COMMON_STYLES_TO_CAPTURE,
          );
          const targetDOM = await targetPage.evaluate(
            extractFn,
            COMMON_STYLES_TO_CAPTURE,
          );

          await testInfo.attach(`${sourceOfTruth.name} DOM Tree JSON`, {
            body: JSON.stringify(sourceDOM, null, 2),
            contentType: "application/json",
          });
          await testInfo.attach(`${target.name} DOM Tree JSON`, {
            body: JSON.stringify(targetDOM, null, 2),
            contentType: "application/json",
          });

          const sourceSlug = slug(sourceOfTruth.name);
          const targetSlug = slug(target.name);
          fs.writeFileSync(
            `/tmp/${story.id}-${sourceSlug}DOM.json`,
            JSON.stringify(sourceDOM, null, 2),
          );
          fs.writeFileSync(
            `/tmp/${story.id}-${targetSlug}DOM.json`,
            JSON.stringify(targetDOM, null, 2),
          );

          // 2. CAPTURE Headless Viewport Screenshots
          const sourceBuffer = await sourcePage.screenshot();
          const targetBuffer = await targetPage.screenshot();

          // 3. PIXEL-BY-PIXEL COMPARISON
          const img1 = PNG.sync.read(sourceBuffer);
          const img2 = PNG.sync.read(targetBuffer);
          const diff = new PNG({ width: img1.width, height: img1.height });

          const diffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            img1.width,
            img1.height,
            { threshold: 0.1 },
          );

          fs.writeFileSync(`/tmp/${story.id}-diff.png`, PNG.sync.write(diff));
          fs.writeFileSync(`/tmp/${story.id}-${sourceSlug}.png`, sourceBuffer);
          fs.writeFileSync(`/tmp/${story.id}-${targetSlug}.png`, targetBuffer);

          await testInfo.attach("Visual Diff Overlay", {
            body: PNG.sync.write(diff),
            contentType: "image/png",
          });
          await testInfo.attach(
            `${sourceOfTruth.name} Screenshot (Source of Truth)`,
            {
              body: sourceBuffer,
              contentType: "image/png",
            },
          );
          await testInfo.attach(`${target.name} Screenshot (Target)`, {
            body: targetBuffer,
            contentType: "image/png",
          });

          const threshold =
            relaxedThresholdPixels !== undefined &&
            relaxedThresholdStoryIds.some((id) => story.id.startsWith(id))
              ? relaxedThresholdPixels
              : config.diffThresholdPixels;

          // Perform soft assertions so failures are logged but other stories continue
          expect.soft(diffPixels).toBeLessThan(threshold);
        });
      }
    });
  }
}
