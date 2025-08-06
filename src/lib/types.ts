
export interface Course {
  id: string;
  title: string;
  path: string;
  description: string;
  shortDescription: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  originalPrice?: number;
  category: string;
  syllabusDownloadLink?: string;
  enrollLink: string;
  tags: string[];
  image: string;
  requirements: string[];
  whatYouWillLearn: string[];
  isFeatured: boolean;
}

export interface APICourse {
  _id: string;
  title: string;
  path: string;
  description: string;
  shortDescription: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  originalPrice?: number;
  category: string;
  syllabusDownloadLink?: string;
  enrollLink: string;
  tags: string[];
  image: string;
  requirements: string[];
  whatYouWillLearn: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  message: string;
  rating: number;
  image: string;
}

export interface APITestimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  message: string;
  rating: number;
  image: string;
  isActive: boolean;
}


export interface FileData {
  id: string;
  filename: string;
  originalName: string;
  publicUrl: string;
  downloadUrl: string;
  size: number;
  mimetype: string;
  category: string;
  description: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
}

export interface APIFile {
    _id: string;
    filename: string;
    originalName: string;
    publicUrl: string;
    size: number;
    mimetype: string;
    category: string;
    description: string;
    isPublic: boolean;
    tags: string[];
    createdAt: string;
    downloadCount: number;
}
