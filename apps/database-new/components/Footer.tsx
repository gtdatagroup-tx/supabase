import Link from 'next/link'

export const links = [
  { title: ` © Supabase`, url: 'https://supabase.com/' },
  { title: 'FAQs', url: '/faq' },
  { title: 'Open Source', url: 'https://supabase.com/open-source' },
  { title: 'Privacy Settings', url: 'https://supabase.com/privacy' },
]

const Footer = () => (
  <div className="mt-16 border-t py-4 container mx-auto">
    <ul className="flex items-center gap-4 text-xs">
      {links.map((link, index) => (
        <li key={index}>
          <Link href={link.url}>{link.title}</Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Footer
