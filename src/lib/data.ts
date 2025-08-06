import type { Course, Testimonial, FileData } from './types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'VAPT - July 2025 Batch',
    path: 'vapt-july-2025-batch',
    description: 'Become a professional penetration tester with this in-depth VAPT course. Learn web, network, and system exploitation, report writing, red teaming basics, and more. Ideal for cybersecurity enthusiasts aiming to break into offensive security.',
    shortDescription: 'Master VAPT with hands-on exploitation, report writing, and red teaming fundamentals.',
    instructor: 'Vikas Kumawat',
    duration: '2 months',
    level: 'Intermediate',
    price: 3000,
    originalPrice: 3500,
    category: 'Cybersecurity',
    syllabusDownloadLink: 'http://example.com/syllabus.pdf',
    enrollLink: 'https://example.com/enroll',
    tags: ['VAPT', 'Penetration Testing', 'Bug Bounty', 'Ethical Hacking'],
    image: 'https://placehold.co/600x400',
    requirements: ['Basic understanding of computers and networking', 'No prior hacking experience required'],
    whatYouWillLearn: ['Introduction to VAPT methodology', 'Information gathering & enumeration', 'Web application attacks (OWASP Top 10)'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    path: 'advanced-javascript',
    description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, async/await, and functional programming.',
    shortDescription: 'Become a JavaScript expert.',
    instructor: 'Jane Doe',
    duration: '3 months',
    level: 'Advanced',
    price: 4000,
    category: 'Web Development',
    enrollLink: 'https://example.com/enroll-js',
    tags: ['JavaScript', 'ES6+', 'Web Development', 'Frontend'],
    image: 'https://placehold.co/600x400',
    requirements: ['Solid understanding of basic JavaScript'],
    whatYouWillLearn: ['Advanced new concepts', 'Closures', 'Async/Await'],
    isFeatured: false,
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    designation: 'Software Engineer',
    company: 'Tech Corp',
    message: 'This is an amazing platform! I learned so much from the courses here. Highly recommended for anyone looking to upgrade their tech skills.',
    rating: 5,
    image: 'https://placehold.co/100x100',
  },
  {
    id: '2',
    name: 'Emily Stone',
    designation: 'UX Designer',
    company: 'DesignHub',
    message: 'The content is top-notch and the instructors are experts in their field. The practical examples were very helpful.',
    rating: 4,
    image: 'https://placehold.co/100x100',
  },
];

export const getCourses = async (): Promise<Course[]> => {
    return courses;
}
