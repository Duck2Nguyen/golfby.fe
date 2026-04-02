import CollectionListing from '@/components/CollectionListing';

interface CollectionPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  return <CollectionListing slugSegments={slug} />;
}
