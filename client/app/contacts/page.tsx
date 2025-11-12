import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, MessageSquare, Users, Newspaper } from 'lucide-react'

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Get In Touch
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-6">
          Have questions, suggestions, or want to contribute? We&apos;d love to hear from you. 
          Reach out to our team through any of the channels below.
        </p>
      </section>

      {/* Contact Options */}
      <section className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>
                General inquiries and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                contact@sciencetech-articles.com
              </p>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Newspaper className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Editorial Team</CardTitle>
              <CardDescription>
                Submit articles or research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                editorial@sciencetech-articles.com
              </p>
              <Button variant="outline" size="sm">
                <Newspaper className="mr-2 h-4 w-4" />
                Submit Article
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Partnerships</CardTitle>
              <CardDescription>
                Collaboration opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                partnerships@sciencetech-articles.com
              </p>
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Partner With Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Send us a Message</CardTitle>
              <CardDescription className="text-center">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium" htmlFor="name">Name</label>
                  <input 
                    id="name"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <input 
                    id="email"
                    type="email"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                <input 
                  id="subject"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  rows={5}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button className="w-full" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                123 Science Avenue<br />
                Tech City, TC 12345<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                +1 (555) 123-4567<br />
                Monday - Friday<br />
                9:00 AM - 6:00 PM EST
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant support through our live chat system.
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}