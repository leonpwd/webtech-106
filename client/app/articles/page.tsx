import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react'

// Dummy articles data
const articles = [
  {
    id: '1',
    title: 'The Future of Quantum Computing: Breaking Through the Noise Barrier',
    excerpt: 'Recent advances in quantum error correction are bringing us closer to practical quantum computers that could revolutionize cryptography, drug discovery, and optimization problems.',
    author: 'Dr. Sarah Chen',
    category: 'Computer Science',
    publishDate: '2024-10-10',
    readTime: '8 min read',
    tags: ['Quantum Computing', 'Technology', 'Physics']
  },
  {
    id: '2',
    title: 'CRISPR 3.0: Engineering Precision in Gene Editing',
    excerpt: 'The latest generation of CRISPR tools offers unprecedented accuracy in gene editing, opening new possibilities for treating genetic disorders and enhancing crop resistance.',
    author: 'Prof. Michael Rodriguez',
    category: 'Biotechnology',
    publishDate: '2024-10-08',
    readTime: '12 min read',
    tags: ['CRISPR', 'Gene Editing', 'Biotechnology']
  },
  {
    id: '3',
    title: 'Sustainable Materials: From Plastic Waste to High-Performance Composites',
    excerpt: 'Researchers have developed a new process to convert plastic waste into carbon fiber composites that outperform traditional materials in strength and durability.',
    author: 'Dr. Elena Vasquez',
    category: 'Materials Science',
    publishDate: '2024-10-05',
    readTime: '10 min read',
    tags: ['Sustainability', 'Materials', 'Environment']
  },
  {
    id: '4',
    title: 'Neural Networks Inspired by the Human Brain: Neuromorphic Computing',
    excerpt: 'Neuromorphic chips that mimic brain architecture promise ultra-low power AI computing, potentially revolutionizing edge computing and IoT applications.',
    author: 'Dr. James Park',
    category: 'Computer Science',
    publishDate: '2024-10-03',
    readTime: '15 min read',
    tags: ['AI', 'Neuromorphic', 'Computing']
  },
  {
    id: '5',
    title: 'Fusion Energy Breakthrough: ITER and Beyond',
    excerpt: 'Recent milestones in fusion energy research bring us closer to clean, limitless energy. We explore the latest developments and future prospects.',
    author: 'Prof. Lisa Thompson',
    category: 'Energy',
    publishDate: '2024-09-30',
    readTime: '18 min read',
    tags: ['Fusion', 'Energy', 'Physics']
  },
  {
    id: '6',
    title: 'Space Manufacturing: 3D Printing on the International Space Station',
    excerpt: 'Advances in zero-gravity manufacturing are paving the way for in-space production of everything from tools to biological tissues.',
    author: 'Dr. Ahmed Hassan',
    category: 'Aerospace',
    publishDate: '2024-09-28',
    readTime: '11 min read',
    tags: ['Space', '3D Printing', 'Manufacturing']
  }
]

const categories = ['All', 'Computer Science', 'Biotechnology', 'Materials Science', 'Energy', 'Aerospace']

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Latest Articles
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-6">
          Explore cutting-edge research and insights from leading scientists and engineers 
          around the world. Stay updated with the latest breakthroughs and innovations.
        </p>
      </section>

      {/* Filter Section */}
      <section className="py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              size="sm"
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {new Date(article.publishDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/articles/${article.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Load More Section */}
      <section className="text-center py-8">
        <Button size="lg" variant="outline">
          Load More Articles
        </Button>
      </section>
    </div>
  )
}