import Hero from '../components/Hero'
import Challenge from '../components/Challenge'
import Approach from '../components/Approach'
import Value from '../components/Value'
import WhoWeWorkWith from '../components/WhoWeWorkWith'
import Status from '../components/Status'
import Contact from '../components/Contact'
import ExpertIntakeSection from '../components/ExpertIntakeSection'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Challenge />
      <Approach />
      <Value />
      <WhoWeWorkWith />
      <Status />
      <ExpertIntakeSection />
      <Contact />
    </main>
  )
}
