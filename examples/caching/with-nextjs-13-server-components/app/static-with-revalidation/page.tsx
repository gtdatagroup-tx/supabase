import Link from 'next/link'
import supabase from '../../utils/supabase'
import dynamic from 'next/dynamic'

const DynamicSyntaxHighlighter = dynamic(() => import('react-syntax-highlighter'))

// cache this page for 1 minute
export const revalidate = 60

export default async function Posts() {
  const { data: posts } = await supabase.from('posts').select('id, title')

  if (!posts) {
    return <p>No posts found.</p>
  }

  return posts.map((post) => (
    <DynamicSyntaxHighlighter language="javascript">
      <p key={post.id}>
        <Link href={`/static/${post.id}`}>{post.title}</Link>
      </p>
    </DynamicSyntaxHighlighter>
  ))
}
