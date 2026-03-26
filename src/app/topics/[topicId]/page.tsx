import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { topicsData } from '@/data/topics';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import TopicContent from './TopicContent';

interface Props {
  params: Promise<{ topicId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = topicsData[resolvedParams.topicId];
  if (!topic) {
    return { title: 'Topic Not Found | ZQuiz' };
  }

  return {
    title: topic.seoTitle,
    description: topic.seoDescription,
    openGraph: {
      title: topic.seoTitle,
      description: topic.seoDescription,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return Object.keys(topicsData).map((topicId) => ({
    topicId,
  }));
}

export default async function TopicPage({ params }: Props) {
  const resolvedParams = await params;
  const topic = topicsData[resolvedParams.topicId];

  if (!topic) {
    notFound();
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-0">
        <TopicContent topic={topic} />
      </div>
    </>
  );
}
