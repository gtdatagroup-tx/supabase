import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import { MDXRemote } from 'next-mdx-remote'

import components from '~/components'
import Layout from '~/layouts/DefaultGuideLayout'
import { getGuidesStaticPaths, getGuidesStaticProps } from '~/lib/docs'

export const getStaticPaths = (async () => {
  return getGuidesStaticPaths('realtime')
}) satisfies GetStaticPaths

export const getStaticProps = (async (args) => {
  return getGuidesStaticProps('realtime', args)
}) satisfies GetStaticProps

export default function RealtimeGuide({
  frontmatter,
  mdxSource,
  editLink,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { hideToc, ...meta } = frontmatter

  return (
    <Layout meta={meta} hideToc={hideToc} editLink={editLink}>
      <MDXRemote {...mdxSource} components={components} />
    </Layout>
  )
}
