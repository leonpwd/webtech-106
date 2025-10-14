import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Cpu, Atom, Beaker } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Science & Engineering
          <span className="block text-primary">Articles Hub</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-6">
          Discover cutting-edge research, engineering innovations, and scientific breakthroughs. 
          Stay updated with the latest developments in technology and science.
        </p>
        <div className="space-x-4 mt-8">
          <Button size="lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Explore Articles
          </Button>
          <Button variant="outline" size="lg">
            Latest Research
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Categories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Cpu className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Computer Science</CardTitle>
              <CardDescription>
                AI, Machine Learning, Software Engineering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore the latest in artificial intelligence, algorithms, and computing.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Beaker className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Engineering</CardTitle>
              <CardDescription>
                Mechanical, Electrical, Civil Engineering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Innovative solutions and breakthrough engineering projects.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Atom className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Physics</CardTitle>
              <CardDescription>
                Theoretical & Applied Physics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fundamental research and physical discoveries.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Mathematics</CardTitle>
              <CardDescription>
                Pure & Applied Mathematics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mathematical theories and computational methods.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Articles Preview */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Quantum Computing Breakthroughs in 2024</CardTitle>
              <CardDescription>Published 2 days ago • Computer Science</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Recent advances in quantum computing have opened new possibilities for solving 
                complex computational problems that were previously intractable...
              </p>
              <Button variant="outline" size="sm">Read More</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Sustainable Engineering Solutions</CardTitle>
              <CardDescription>Published 5 days ago • Engineering</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                How modern engineering is addressing climate change through innovative 
                sustainable technologies and green infrastructure...
              </p>
              <Button variant="outline" size="sm">Read More</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Neural Network Architectures</CardTitle>
              <CardDescription>Published 1 week ago • AI & Machine Learning</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Exploring new neural network architectures that are revolutionizing 
                deep learning and artificial intelligence applications...
              </p>
              <Button variant="outline" size="sm">Read More</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}