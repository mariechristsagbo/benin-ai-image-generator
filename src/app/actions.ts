"use server";

import { launch } from "puppeteer";

export async function translate(text: string) {
  const browser = await launch({
    headless: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://glosbe.com/fon/en", {
    waitUntil: "domcontentloaded",
  }); // URL is given by the "user" (your client-side application)

  await page.type("#dictionary-search", text);

  await page.keyboard.press("Enter");

  await page.waitForNavigation();

  const result = await page.evaluate(() => {
    return document
      .getElementById("glosbeTranslate_container")
      ?.innerHTML.toString()
      .match(/<a[^>]*>(.*?)<\/a>/);
  });
  await browser.close();
  return result?.[1];
}
