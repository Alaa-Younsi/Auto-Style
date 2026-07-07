import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function useSeo({ title, description }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    setMeta("og:title", title, "property");
    setMeta("twitter:title", title);

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
