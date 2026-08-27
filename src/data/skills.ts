import type { SkillCategory } from '../types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'HTML', level: 'expert' },
      { name: 'CSS', level: 'expert' },
      { name: 'JavaScript', level: 'advanced' },
      { name: 'React', level: 'advanced' },
      { name: 'TypeScript', level: 'advanced' },
      { name: 'UI/UX', level: 'intermediate' },
    ],
  },
  {
    name: 'Mobile',
    skills: [
      { name: 'Kotlin', level: 'advanced' },
      { name: 'Android Studio', level: 'advanced' },
      { name: 'Jetpack Compose', level: 'intermediate' },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', level: 'intermediate' },
      { name: 'Express', level: 'intermediate' },
      { name: 'MongoDB', level: 'intermediate' },
      { name: 'Firebase', level: 'advanced' },
    ],
  },
  {
    name: 'Tools',
    skills: [
      { name: 'Git', level: 'advanced' },
      { name: 'GitHub', level: 'advanced' },
      { name: 'VS Code', level: 'expert' },
      { name: 'Android Studio', level: 'advanced' },
      { name: 'Google Play Console', level: 'intermediate' },
    ],
  },
]

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

export const levelValues: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 95,
}
