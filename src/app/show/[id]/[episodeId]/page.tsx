export type EpisodePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;

  return (
    /* eslint-disable-next-line @atlaskit/design-system/no-html-heading */
    <h1>{slug} Episode Page</h1>
  );
}
