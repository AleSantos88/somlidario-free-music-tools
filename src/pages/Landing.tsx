import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Headphones, Layers, Download, ArrowRight, Mic, Guitar, Drum } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "AI Stem Separation",
    description: "Split any song into individual instruments using state-of-the-art AI models.",
  },
  {
    icon: Headphones,
    title: "Multitrack Player",
    description: "Solo, mute, and adjust volume for each stem with synchronized playback.",
  },
  {
    icon: Download,
    title: "Download Stems",
    description: "Export high-quality WAV stems for practice, remix, or production work.",
  },
];

const stemTypes = [
  { icon: Mic, label: "Vocals" },
  { icon: Guitar, label: "Guitars" },
  { icon: Drum, label: "Drums" },
  { icon: Music, label: "Bass" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md gradient-amber flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Somlidario</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-amber text-primary-foreground hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.3, 0, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
              Free for musicians worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] mb-6">
              Professional AI stem separation.{" "}
              <span className="text-primary">For everyone.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload any song and separate it into individual instruments. Practice, study, remix, and learn—powered by open-source AI, free for musicians who need it.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gradient-amber text-primary-foreground hover:opacity-90 transition-opacity h-12 px-8 text-base font-medium">
                  Start Separating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium border-border text-foreground hover:bg-muted">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stem Types */}
      <section className="py-12 border-y border-border">
        <div className="container">
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {stemTypes.map((stem) => (
              <motion.div
                key={stem.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <stem.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{stem.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to study your music
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional-grade tools, accessible to everyone. No expensive subscriptions required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.3, 0, 0.2, 1] }}
                className="p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow duration-250"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to separate your first track?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create a free account and start with complimentary credits. No credit card required.
          </p>
          <Link to="/register">
            <Button size="lg" className="gradient-amber text-primary-foreground hover:opacity-90 transition-opacity h-12 px-8 text-base font-medium">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            <span className="font-medium">Somlidario</span>
          </div>
          <p>Democratizing music tools with AI. Open source.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
