import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Breadcrumbs.module.css'

const Breadcrumbs = () => {
  const router = useRouter()
  const pathSegments = router.asPath.split('/').filter(segment => segment)

  const breadcrumbItems = [
    { name: 'Главная', href: '/' },
    ...pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/')
      const name = segment.charAt(0).toUpperCase() + segment.slice(1)
      return { name, href }
    })
  ]

  if (breadcrumbItems.length <= 1) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}${item.href}`
    }))
  }

  return (
    <>
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <ol className={styles.breadcrumbList} itemScope itemType="https://schema.org/BreadcrumbList">
          {breadcrumbItems.map((item, index) => (
            <li 
              key={item.href} 
              className={styles.breadcrumbItem}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index < breadcrumbItems.length - 1 ? (
                <Link href={item.href} className={styles.breadcrumbLink} itemProp="item">
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent} itemProp="name" aria-current="page">
                  {item.name}
                </span>
              )}
              <meta itemProp="position" content={index + 1} />
              {index < breadcrumbItems.length - 1 && (
                <span className={styles.breadcrumbSeparator} aria-hidden="true"> / </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  )
}

export default Breadcrumbs