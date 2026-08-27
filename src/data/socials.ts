import type { SocialLink } from '../types'

export const GITHUB_URL = 'https://github.com/klaza0'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/ibrahimmontaser/'
export const EMAIL = 'imontaser6@gmail.com'

export const socials: SocialLink[] = [
  { name: 'GitHub', url: GITHUB_URL, icon: 'github' },
  { name: 'LinkedIn', url: LINKEDIN_URL, icon: 'linkedin' },
  { name: 'Email', url: `mailto:${EMAIL}`, icon: 'mail' },
]

export const contactInfo = {
  email: EMAIL,
  linkedin: LINKEDIN_URL,
  github: GITHUB_URL,
}

export const RESUME_PDF_URL = '/resume/Ibrahim_Montaser_Resume.pdf'
export const RESUME_DOWNLOAD_NAME = 'Ibrahim_Montaser_Resume.pdf'
