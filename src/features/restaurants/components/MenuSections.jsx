import { UtensilsCrossed } from 'lucide-react'
import { EmptyState } from '@shared/components/ui'
import { categorySectionId } from '../hooks/useCategoryScrollSpy'
import MenuItemCard from './MenuItemCard'

/** The menu: one section of dish cards per category. */
export default function MenuSections({
  categories,
  canOrder,
  disabledReason,
  quantityOf,
  onAdd,
  onChangeQuantity,
}) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="Menu coming soon"
        message="This restaurant hasn't added any dishes yet."
      />
    )
  }

  return categories.map((c) => (
    <section key={c.id} id={categorySectionId(c.id)} className="mb-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-semibold">{c.name}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {c.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={quantityOf(item.id)}
            canOrder={canOrder && item.is_available}
            disabledReason={!item.is_available ? 'Unavailable' : disabledReason}
            onAdd={() => onAdd(item)}
            onChangeQty={(q) => onChangeQuantity(item.id, q)}
          />
        ))}
      </div>
    </section>
  ))
}
