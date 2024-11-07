import HeroSection from './components/HeroSection'
import PomodoroPlanner from './components/PomodoroPlanner'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="h-screen">
        <HeroSection />
      </div>
      <section className="bg-indigo-800 py-8">
        <div className="container mx-auto px-4">
          <PomodoroPlanner />
        </div>
      </section>
    </main>
  )
}