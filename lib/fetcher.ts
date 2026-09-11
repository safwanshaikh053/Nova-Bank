export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  });
