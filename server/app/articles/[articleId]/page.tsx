import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, User, ArrowLeft, Share2, BookmarkPlus } from 'lucide-react'

// Dummy articles data - in a real app, this would come from a database
const articles = {
  '1': {
    id: '1',
    title: 'The Future of Quantum Computing: Breaking Through the Noise Barrier',
    content: `
      <p>Quantum computing has long been heralded as the next frontier in computational power, promising to solve problems that are intractable for classical computers. However, one of the biggest challenges facing quantum computers today is quantum noise – the interference that corrupts quantum information.</p>
      
      <h2>Understanding Quantum Noise</h2>
      <p>Quantum noise arises from the interaction between quantum systems and their environment. Unlike classical bits that are either 0 or 1, quantum bits (qubits) exist in a superposition of both states simultaneously. This delicate quantum state is extremely sensitive to environmental disturbances such as temperature fluctuations, electromagnetic fields, and even cosmic radiation.</p>
      
      <h2>Recent Breakthroughs</h2>
      <p>Recent advances in quantum error correction have shown promising results in mitigating the effects of quantum noise. Researchers at leading institutions have developed new protocols that can detect and correct quantum errors in real-time, bringing us closer to fault-tolerant quantum computing.</p>
      
      <h2>Implications for the Future</h2>
      <p>These breakthroughs could revolutionize multiple fields including cryptography, drug discovery, financial modeling, and artificial intelligence. As quantum computers become more reliable, we may see the emergence of quantum advantage in practical applications within the next decade.</p>
      
      <h2>Challenges Ahead</h2>
      <p>Despite these advances, significant challenges remain. Scaling quantum error correction to larger systems, reducing the overhead of error correction protocols, and developing more robust quantum hardware are all active areas of research.</p>
    `,
    author: 'Dr. Sarah Chen',
    category: 'Computer Science',
    publishDate: '2024-10-10',
    readTime: '8 min read',
    tags: ['Quantum Computing', 'Technology', 'Physics'],
    authorBio: 'Dr. Sarah Chen is a Professor of Quantum Physics at MIT and a leading researcher in quantum computing and quantum information theory.'
  },
  '2': {
    id: '2',
    title: 'CRISPR 3.0: Engineering Precision in Gene Editing',
    content: `
      <p>The CRISPR-Cas9 system has revolutionized genetic engineering since its discovery, but the latest iteration, dubbed CRISPR 3.0, promises even greater precision and fewer off-target effects.</p>
      
      <h2>Evolution of CRISPR Technology</h2>
      <p>From its humble beginnings as a bacterial immune system to becoming the most powerful gene-editing tool in modern biology, CRISPR has undergone continuous refinement. Each generation has brought improvements in accuracy, efficiency, and safety.</p>
      
      <h2>Key Innovations in CRISPR 3.0</h2>
      <p>The latest version incorporates advanced guide RNA designs, improved Cas protein variants, and sophisticated delivery mechanisms that dramatically reduce unintended genetic modifications. These improvements make therapeutic applications much more viable.</p>
      
      <h2>Therapeutic Applications</h2>
      <p>CRISPR 3.0 is being tested in clinical trials for treating genetic disorders such as sickle cell disease, beta-thalassemia, and certain forms of inherited blindness. Early results show remarkable success rates with minimal side effects.</p>
      
      <h2>Ethical Considerations</h2>
      <p>As the technology becomes more powerful and accessible, the scientific community continues to grapple with the ethical implications of human genetic modification, particularly germline editing that could be passed to future generations.</p>
    `,
    author: 'Prof. Michael Rodriguez',
    category: 'Biotechnology',
    publishDate: '2024-10-08',
    readTime: '12 min read',
    tags: ['CRISPR', 'Gene Editing', 'Biotechnology'],
    authorBio: 'Prof. Michael Rodriguez is the Director of Genetic Engineering at Stanford University and has published over 150 papers on CRISPR technology.'
  }
  // Add more articles as needed
}

interface PageProps {
  params: Promise<{
    articleId: string
  }>
}

export default async function ArticlePage({ params }: PageProps) {
  const { articleId } = await params
  const article = articles[articleId as keyof typeof articles]

  // If article not found, show 404-like message
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/articles">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Link href="/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {new Date(article.publishDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Author Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              About the Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{article.author}</h3>
                <p className="text-muted-foreground mt-2">{article.authorBio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Computer Science</Badge>
                <CardTitle className="text-lg">
                  <Link href="/articles/4" className="hover:text-primary transition-colors">
                    Neural Networks Inspired by the Human Brain
                  </Link>
                </CardTitle>
                <CardDescription>
                  Neuromorphic chips that mimic brain architecture promise ultra-low power AI computing...
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Energy</Badge>
                <CardTitle className="text-lg">
                  <Link href="/articles/5" className="hover:text-primary transition-colors">
                    Fusion Energy Breakthrough: ITER and Beyond
                  </Link>
                </CardTitle>
                <CardDescription>
                  Recent milestones in fusion energy research bring us closer to clean, limitless energy...
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </article>
    </div>
  )
}