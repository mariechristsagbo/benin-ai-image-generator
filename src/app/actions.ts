"use server";

export async function getApiKeys() {
  const apiKeys = process.env.API_KEYS?.split(" ");
  return apiKeys!;
}

export async function translate(language: string, text: string) {
  const response = await fetch(
    `https://translate.glosbe.com/${
      language === "fon" ? "fon" : "yo"
    }-en/${text}`,
    {
      mode: "no-cors",
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
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
}
