import '../Style/Home1.css';
import i1 from '../Images/Organo/i1.jpeg';
import i2 from '../Images/Organo/i2.jpeg';
import i3 from '../Images/Organo/i3.jpeg';
import i4 from '../Images/Organo/i4.jpeg';
import i5 from '../Images/Organo/i5.jpeg';
import i6 from '../Images/Organo/i6.jpeg';
import i7 from '../Images/Organo/i7.jpeg';
import i8 from '../Images/Organo/i8.jpeg';
import i9 from '../Images/Organo/i9.jpeg';
import i12 from '../Images/Organo/i10.jpeg';
import fi1 from '../Images/Farmhouse/i1.jpeg';
import fi2 from '../Images/Farmhouse/i2.jpeg';
import fi3 from '../Images/Farmhouse/i3.jpeg';
import fi4 from '../Images/Farmhouse/i4.jpeg';
import fi5 from '../Images/Farmhouse/i5.jpeg';
import fi6 from '../Images/Farmhouse/i6.jpeg';
import fi7 from '../Images/Farmhouse/i7.jpeg';
import fi9 from '../Images/Farmhouse/i9.jpeg';
import fi10 from '../Images/Farmhouse/i10.jpeg';
import fi11 from '../Images/Farmhouse/i11.jpeg';
import fi12 from '../Images/Farmhouse/i12.jpeg';
import heroImage from '../Images/general/hero-trees.webp';
import g2 from '../Images/general/g2.jpeg';
import g3 from '../Images/general/g3.jpeg';
import g4 from '../Images/general/g4.jpeg';
import Footer from './Footer';

export default function HomePage() {
  return (
    <div className="home-wrapper w-100">
      {/* Header */}
      <header className="header w-100 d-flex justify-content-between align-items-center p-3 shadow-sm">
        <nav className="d-flex gap-4">
          <a href="/" className="nav-link-custom">Home</a>
          <a href="/book" className="nav-link-custom">Book Now</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero text-center py-5 px-3" style={{'--hero-bg': `url(${heroImage})`}}>
        <h1 className="fw-bold hero-title">Sukshetram</h1>
        <h4>The Natural Way of Living</h4>
        <p className="mt-3 text-muted mx-auto hero-desc">
        Disconnect from the chaos and reconnect with nature. Experience mindful living,
          organic food, yoga, and calm surroundings.
        </p>
      </section>

      {/* Purpose Section */}
       <section className="container py-5">
        {[
          { 
            text: "Harmonious Existence", 
            img: i1,
            description: "Life unfolds in unseen layers, where tiny organisms quietly sustain balance beneath soil, water, and air. When undisturbed, this hidden world strengthens everything above it—roots deepen, systems renew, growth steadies. But when silenced, something essential fades. Harmony thrives not through control, but by allowing life to support life, naturally and invisibly."
          },
          { 
            text: "Nothing born out of Mother Earth is waste", 
            img: g2,
            description: "Nothing born of the earth is ever truly wasted; it simply changes form. A fallen leaf becomes soil, ash settles into richness, and what seems discarded quietly nourishes what comes next. Nature moves in cycles, not endings—everything returns, transforms, and belongs. Even stillness and decay carry purpose, shaping renewal in unseen, patient ways."
          },
          { 
            text: "Farming as Duty", 
            img: g3,
            description: "Farming unfolds with weather, soil, and time—forces that cannot be owned or rushed. Seeds are placed with trust, not certainty, and care continues regardless of outcome. It is less a transaction and more a quiet commitment, where patience replaces urgency and support replaces control. In this steady tending, growth emerges through trust, balance, and gentle responsibility."
          },
          { 
            text: "All is Nature’s will", 
            img: g4,
            description: "Nothing here is truly owned; it is borrowed from rhythms far older than us. Seasons turn, rain falls, and life rises without permission. When we see ourselves as caretakers rather than owners, we take gently and leave enough for renewal. In restraint, balance remains—and nature continues its quiet, self-sustaining work."
          },
        ].map((item, idx) => (
          <div key={idx} className="row align-items-center mb-5">
            {idx % 2 === 0 ? (
              <>
                <div className="col-md-6">
                  <h4 className="purpose-title">{item.text}</h4>
                  <p className='para'>
                    {item.description}
                  </p>
                </div>
                <div className="col-md-6">
                  <img src={item.img} alt={item.text} className="purpose-img" />
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6">
                  <img src={item.img} alt={item.text} className="purpose-img" />
                </div>
                <div className="col-md-6">
                  <h4 className="purpose-title">{item.text}</h4>
                  <p className="para">
                    {item.description}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </section>

      {/* Staycations */}
      <section className="staycations py-5">
        <div className="container">
          <h3 className="section-title text-center mb-5">Our Seclusion Stays</h3>

          {/* Organo */}
          <div className="mb-5">
            <h4 className="sub-section-title mb-4">Organo</h4>
            <div className="scroll-container">
              <img src={i1} alt="Organo Staycation 1" className="scroll-img" />
              <img src={i2} alt="Organo Staycation 2" className="scroll-img" />
              <img src={i3} alt="Organo Staycation 3" className="scroll-img" />
              <img src={i4} alt="Organo Staycation 4" className="scroll-img" />
              <img src={i5} alt="Organo Staycation 5" className="scroll-img" />
              <img src={i6} alt="Organo Staycation 6" className="scroll-img" />
              <img src={i7} alt="Organo Staycation 7" className="scroll-img" />
              <img src={i8} alt="Organo Staycation 8" className="scroll-img" />
              <img src={i9} alt="Organo Staycation 9" className="scroll-img" />
              <img src={i12} alt="Organo Staycation 9" className="scroll-img" />
              {/* Add more images as needed */}
            </div>
            <p className="mt-3 ">
               <h5>Organo – A Peaceful 3BHK Nature Retreat 🌿</h5>
        
        <p>
            Discover the perfect blend of comfort, space, and serenity at Organo — 
            a beautifully designed 3-bedroom, 3-bathroom home ideal for families, 
            friends, or wellness getaways.
        </p>

        <div class="section">
            <h6>The Space</h6>
            <ul>
                <li>3 comfortable bedrooms designed for restful sleep</li>
                <li>Air conditioning (AC) for a comfortable stay in all seasons</li>
                <li>A large, open hall perfect for gatherings and relaxation</li>
                <li>Airy balconies that fill the home with natural light and fresh breeze</li>
                <li>A welcoming porch ideal for peaceful mornings and calm evenings</li>
            </ul>
        </div>

        <div class="section">
            <h6>Amenities & Community Features</h6>
            <ul>
                <li>Beautiful landscaped gardens</li>
                <li>Refreshing swimming pool</li>
                <li>Fully equipped gym</li>
                <li>Dedicated children’s play areas</li>
                <li>Scenic walking trails surrounded by greenery</li>
            </ul>
        </div>

            </p>
          </div>

          {/* Farmhouse */}
          <div className="mb-5">
            <h4 className="sub-section-title mb-4">Hamsa</h4>
            <div className="scroll-container">
              <img src={fi1} alt="Organo Staycation 1" className="scroll-img" />
              <img src={fi2} alt="Organo Staycation 2" className="scroll-img" />
              <img src={fi3} alt="Organo Staycation 3" className="scroll-img" />
              <img src={fi4} alt="Organo Staycation 4" className="scroll-img" />
              <img src={fi5} alt="Organo Staycation 5" className="scroll-img" />
              <img src={fi6} alt="Organo Staycation 6" className="scroll-img" />
              <img src={fi7} alt="Organo Staycation 7" className="scroll-img" />
              <img src={fi9} alt="Organo Staycation 9" className="scroll-img" />
              <img src={fi10} alt="Organo Staycation 9" className="scroll-img" />
              <img src={fi11} alt="Organo Staycation 9" className="scroll-img" />
              <img src={fi12} alt="Organo Staycation 9" className="scroll-img" />
              {/* Add more images as needed */}
            </div>
            <p className="mt-3 ">
              <h5>Charming Farmhouse Retreat – Experience Natural Living at Its Finest 🌾</h5>

        <p>
            Escape to a peaceful farmhouse where comfort meets countryside charm. 
            Surrounded by open skies and fresh air, this home offers a truly relaxing 
            and authentic farm stay experience.
        </p>

        <div class="section">
            <h6>The Space</h6>
            <ul>
                <li><span class="highlight">2 spacious bedrooms</span> designed for restful comfort</li>
                <li><span class="highlight">2 well-maintained bathrooms</span> with 24/7 hot water</li>
                <li><span class="highlight">Air conditioning (AC)</span> available for a comfortable stay in all seasons</li>
                <li><span class="highlight">Outdoor kitchen</span> for a unique open-air cooking experience</li>
                <li><span class="highlight">Huge wrap-around porch</span> surrounding the house, perfect for relaxing and enjoying scenic farm views</li>
            </ul>
        </div>

        <div class="section">
            <h6>Amenities</h6>
            <ul>
                <li>24/7 hot water supply</li>
                <li>Air conditioning in the home</li>
                <li>Peaceful natural surroundings</li>
                <li>Opportunity to see friendly farm animals such as cows, chickens, and dogs </li>
                <li>Spacious outdoor areas for relaxation and family time</li>
            </ul>
        </div>
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}