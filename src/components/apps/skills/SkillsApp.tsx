import { useState } from 'react'
import { skillCategories, levelLabels, levelValues } from '../../../data/skills'
import { motion } from 'framer-motion'

const categories = ['Frontend', 'Mobile', 'Backend', 'Tools']

export function SkillsApp() {
  const [activeCategory, setActiveCategory] = useState('Frontend')

  const category = skillCategories.find(c => c.name === activeCategory)

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-[var(--border)] p-2">
        <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">Categories</h3>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors focus-ring ${
              activeCategory === cat ? 'accent-bg text-white' : 'hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-sm font-semibold mb-4">{activeCategory} Skills</h2>
        <div className="space-y-4">
          {category?.skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium">{skill.name}</span>
                <span className="text-[10px] text-[var(--text-muted)]">{levelLabels[skill.level]}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full accent-bg"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelValues[skill.level]}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
