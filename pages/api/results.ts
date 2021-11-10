import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";

type ResponseData = {
  success: boolean;
  results: Array<string>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { input } = req.query;
  const searchQuery = encodeURI(`filetype:pdf ${input}`);
  const searchURL = `https://www.google.com/search?q=${searchQuery}`;

  let results: Array<string> = [];

  try {
    const searchRes = await fetch(searchURL);
    const html = await searchRes.text();

    const $ = cheerio.load(html);
    $("a[href*='.pdf']").each((i, el) => {
      const link = el.attribs.href;
      const pdfURL = new URLSearchParams(link).get("/url?q");
      results.push(pdfURL!);
    });

    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ success: false, results: [] });
  }
}
