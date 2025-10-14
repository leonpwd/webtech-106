import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Cpu, Atom, Beaker, ArrowRight, Zap, Rocket, Microscope, Calculator } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Animated Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up">
                Science & Engineering
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 animate-fade-in-up animation-delay-300">
                Articles Hub
              </h2>
            </div>
            
            {/* Animated Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
              Discover cutting-edge research, engineering innovations, and scientific breakthroughs. 
              Stay updated with the latest developments in technology and science.
            </p>
            
            {/* Animated Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-900">
              <Link href="/articles">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 group">
                  <BookOpen className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Explore Articles
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:border-purple-600 hover:text-purple-600 transform hover:scale-105 transition-all duration-300">
                <Zap className="mr-2 h-5 w-5" />
                Latest Research
              </Button>
            </div>
            
            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up animation-delay-1200">
              <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Research Articles</div>
              </div>
              <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Expert Authors</div>
              </div>
              <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-pink-600 mb-2">25+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Readers</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Featured Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our diverse collection of scientific and engineering disciplines
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">Computer Science</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  AI, Machine Learning, Software Engineering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Explore the latest in artificial intelligence, algorithms, and computing.
                </p>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    View Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Beaker className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">Engineering</CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Mechanical, Electrical, Civil Engineering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Innovative solutions and breakthrough engineering projects.
                </p>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                    View Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Atom className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">Physics</CardTitle>
                <CardDescription className="text-pink-700 dark:text-pink-300">
                  Theoretical & Applied Physics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Fundamental research and physical discoveries.
                </p>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-800">
                    View Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">Mathematics</CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Pure & Applied Mathematics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Mathematical theories and computational methods.
                </p>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                    View Articles <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Articles Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Latest Discoveries
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay up-to-date with the most recent scientific breakthroughs and engineering innovations
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/articles/1">
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer bg-white dark:bg-gray-900">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      Quantum Computing
                    </span>
                    <Rocket className="h-5 w-5 text-blue-600 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    Quantum Computing Breakthroughs in 2024
                  </CardTitle>
                  <CardDescription>Published 2 days ago • Dr. Sarah Chen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
                    Recent advances in quantum computing have opened new possibilities for solving 
                    complex computational problems that were previously intractable...
                  </p>
                  <Button variant="ghost" size="sm" className="text-blue-600 group-hover:text-blue-800 p-0">
                    Read More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/articles/2">
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer bg-white dark:bg-gray-900">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                      Biotechnology
                    </span>
                    <Microscope className="h-5 w-5 text-purple-600 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="group-hover:text-purple-600 transition-colors">
                    CRISPR 3.0: Engineering Precision
                  </CardTitle>
                  <CardDescription>Published 5 days ago • Prof. Michael Rodriguez</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
                    The latest generation of CRISPR tools offers unprecedented accuracy in gene editing, 
                    opening new possibilities for treating genetic disorders...
                  </p>
                  <Button variant="ghost" size="sm" className="text-purple-600 group-hover:text-purple-800 p-0">
                    Read More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/articles/4">
              <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer bg-white dark:bg-gray-900">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                      Neural Networks
                    </span>
                    <Zap className="h-5 w-5 text-green-600 group-hover:animate-pulse" />
                  </div>
                  <CardTitle className="group-hover:text-green-600 transition-colors">
                    Neuromorphic Computing Revolution
                  </CardTitle>
                  <CardDescription>Published 1 week ago • Dr. James Park</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
                    Exploring new neural network architectures that are revolutionizing 
                    deep learning and artificial intelligence applications...
                  </p>
                  <Button variant="ghost" size="sm" className="text-green-600 group-hover:text-green-800 p-0">
                    Read More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/articles">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:border-blue-600 hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Scientific Community
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Connect with researchers, engineers, and innovators from around the world. 
              Share knowledge, collaborate on projects, and advance human understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                Subscribe to Newsletter
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                Submit Your Research
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}