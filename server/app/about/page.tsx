import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Target, Award, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          About Our Platform
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-6">
          We are dedicated to sharing the latest scientific and engineering knowledge 
          with researchers, students, and enthusiasts worldwide.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                To democratize access to cutting-edge scientific and engineering knowledge.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A global network of researchers, engineers, and science enthusiasts.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Committed to publishing only the highest quality, peer-reviewed content.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Global Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connecting minds across continents to advance human knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2024, our platform emerged from the vision of making scientific 
                and engineering knowledge more accessible to everyone. We believe that the 
                greatest discoveries happen when brilliant minds collaborate and share their insights.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our editorial team consists of PhD researchers, industry experts, and 
                passionate educators who ensure that every article meets the highest 
                standards of accuracy and clarity.
              </p>
              <p className="text-lg text-muted-foreground">
                Join us in our mission to push the boundaries of human knowledge and 
                create a more informed, innovative world.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}