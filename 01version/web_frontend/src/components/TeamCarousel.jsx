import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FiUser } from "react-icons/fi";
import { useRef } from "react";

function TeamCarousel() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds per slide
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false
        }
      }
    ]
  };

  const teamMembers = [
    {
      name: "Anjan Kumar Panda",
      role: "Sponsor",
      bio: "Visionary leader with a passion for technology and innovation",
      funFact: "Loves to do what's difficult and challenging"
    },
    {
      name: "Abinash Ghosh",
      role: "Sponsor",
      bio: "Solving business critical problems with AI",
      funFact: "Loves to explore new technologies"
    },
    {
      name: "Anil Kumar Hansda",
      role: "Team Lead",
      bio: "Experienced software engineer with expertise in DevOps and Cybersecurity",
      funFact: "Loves anime and manga"
    },
    {
      name: "ShreeyaShree Mishra",
      role: "Team Co-Lead",
      bio: "Passionate about building inclusive and accessible software",
      funFact: "Loves animals"
    },
    {
      name: "Taufique Alam Ansari",
      role: "Lead Engineer",
      bio: "Tech enthusiast with a knack for problem-solving",
      funFact: "Loves to watch movies and series"
    },
    {
      name: "SoumyaDatta Dash",
      role: "Lead Testing Engineer",
      bio: "Quality assurance expert with a passion for user experience",
      funFact: "Enjoys sleeping and eating biryani"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-16 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
      
      <Slider ref={sliderRef} {...settings} className="team-slider">
        {teamMembers.map((member, index) => (
          <div key={index} className="px-2 outline-none">
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md h-full mx-auto max-w-xs transform hover:scale-105 transition-transform duration-300">
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
              <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
              <p className="text-gray-500 text-xs italic">Fun fact: {member.funFact}</p>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom navigation buttons */}
      <div className="flex justify-center mt-4 space-x-4">
        {/* <button 
          onClick={() => sliderRef.current.slickPrev()}
          className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          aria-label="Previous team member"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={() => sliderRef.current.slickNext()}
          className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          aria-label="Next team member"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button> */}
      </div>

      {/* <style jsx global>{`
        .team-slider .slick-dots {
          bottom: -40px;
        }
        .team-slider .slick-dots li button:before {
          color: #6366F1;
          font-size: 10px;
        }
        .team-slider .slick-dots li.slick-active button:before {
          color: #4F46E5;
        }
        .team-slider .slick-center > div > div {
          transform: scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style> */}
    </div>
  );
}

export default TeamCarousel;