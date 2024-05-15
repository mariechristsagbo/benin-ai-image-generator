"use server";

// import { launch } from "puppeteer";

export async function translate(text: string) {
  const response = await fetch(`https://translate.glosbe.com/fon-en/${text}`, {
    mode: "no-cors",
    headers: {
      "Content-Type": "text/html",
    },
  });
  const html = await response.text();
  const regex =
    /<app-page-translator-translation-output>(.*?)<\/app-page-translator-translation-output>/s;
  const match = html.match(regex);
  if (match) {
    const regex2 = /<div[^>]*>(.*?)<\/div>/;
    const match2 = match[1].match(regex2);
    if (match2) {
      return match2[1] as string;
    }
  }
  //   const browser = await launch({
  //     headless: true,
  //     defaultViewport: null,
  //   });
  //   const page = await browser.newPage();
  //   await page.goto("https://glosbe.com/fon/en", {
  //     waitUntil: "domcontentloaded",
  //   }); // URL is given by the "user" (your client-side application)

  //   await page.type("#dictionary-search", text);

  //   await page.keyboard.press("Enter");

  //   await page.waitForNavigation();

  //   const result = await page.evaluate(() => {
  //     return document
  //       .getElementById("glosbeTranslate_container")
  //       ?.innerHTML.toString()
  //       .match(/<a[^>]*>(.*?)<\/a>/);
  //   });
  //   await browser.close();
  //   return result?.[1];
}
