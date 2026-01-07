export type ShowPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export default async function ShowPage({ params, searchParams }: ShowPageProps) {
  const { slug } = await params;

  return (
    /* eslint-disable-next-line @atlaskit/design-system/no-html-heading */
    <h1>{slug} Show Page</h1>
  );
}
