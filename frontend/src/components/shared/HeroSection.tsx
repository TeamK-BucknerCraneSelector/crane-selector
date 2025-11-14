interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage?: string
  height?: string
}

function HeroSection({ 
  title, 
  subtitle, 
  backgroundImage = 'bg-crane-hero', 
  height = 'h-96' 
}: HeroSectionProps) {
  return (
    <section className={`relative ${height} ${backgroundImage} bg-cover bg-center flex items-center justify-center`}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl">{subtitle}</p>
      </div>
    </section>
  )
}

export default HeroSection