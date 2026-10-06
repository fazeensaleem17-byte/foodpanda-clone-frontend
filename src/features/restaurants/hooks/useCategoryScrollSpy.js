import { useEffect, useRef, useState } from 'react'

/** DOM id of a menu category section, shared by the tabs and the sections. */
export const categorySectionId = (categoryId) => `cat-${categoryId}`

/**
 * Scroll-spy for the sticky category tabs.
 * Tracks which category section is in view, keeps its tab visible inside the
 * horizontally scrolling tab bar, and scrolls to a section when a tab is clicked.
 */
export function useCategoryScrollSpy(categories) {
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const tabsRef = useRef(null)
  const categoryKey = categories.map((c) => c.id).join(',')

  // Highlight the category tab whose section is in view.
  useEffect(() => {
    if (!categoryKey) return
    const sections = categoryKey
      .split(',')
      .map((cid) => document.getElementById(categorySectionId(cid)))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveCategoryId(Number(visible[0].target.id.replace('cat-', '')))
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categoryKey])

  // Keep the active tab visible inside the horizontally scrolling tab bar.
  useEffect(() => {
    tabsRef.current
      ?.querySelector(`[data-cat="${activeCategoryId}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeCategoryId])

  const jumpToCategory = (categoryId) => {
    setActiveCategoryId(categoryId)
    document
      .getElementById(categorySectionId(categoryId))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return { activeCategoryId, tabsRef, jumpToCategory }
}
