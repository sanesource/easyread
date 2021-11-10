import { useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import PDFObject from "pdfobject";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef(null);
  const [currentBook, setCurrentBook] = useState<string>();

  async function onClickSearch() {
    const input = inputRef.current!.value;
    if (currentBook !== input) {
      const res = await fetch(`/api/results?input=${input}`);
      const { results } = await res.json();
      const url = results[0];
      if (url) {
        setCurrentBook(input);
        PDFObject.embed(url, viewerRef.current);
      }
    }
  }

  return (
    <div>
      <Head>
        <title>EasyRead</title>
        <meta
          name="description"
          content="Easily read books, anytime, anywhere."
        />
      </Head>
      <header>
        <input type="text" placeholder="Enter Book Name" ref={inputRef} />
        <button onClick={onClickSearch}>Search</button>
      </header>
      <div id="viewer" ref={viewerRef}></div>
    </div>
  );
};

export default Home;
