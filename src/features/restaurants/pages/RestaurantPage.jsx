import { useParams } from 'react-router-dom'
import { CartSidebar, MobileCartBar, ReplaceCartDialog } from '@features/cart'
import { RestaurantReviews } from '@features/reviews'
import { ErrorState, RestaurantPageSkeleton } from '@shared/components/ui'
import CategoryTabs from '../components/CategoryTabs'
import MenuSections from '../components/MenuSections'
import RestaurantHeader from '../components/RestaurantHeader'
import { useRestaurantPage } from '../hooks/useRestaurantPage'

export default function RestaurantPage() {
  const { id } = useParams()
  const {
    menu,
    reviews,
    restaurant,
    categories,
    permissions,
    scrollSpy,
    addToCart,
    quantityOf,
    changeQuantity,
  } = useRestaurantPage(id)

  if (menu.loading) return <RestaurantPageSkeleton />
  if (menu.error)
    return (
      <div className="page">
        <ErrorState message={menu.error} onRetry={menu.reload} />
      </div>
    )

  const { isOwnerOfThis, canOrder, disabledReason, showCartPanel } = permissions

  return (
    <>
      <RestaurantHeader restaurant={restaurant} isOwnerOfThis={isOwnerOfThis} />

      <CategoryTabs
        categories={categories}
        activeCategoryId={scrollSpy.activeCategoryId}
        tabsRef={scrollSpy.tabsRef}
        onSelect={scrollSpy.jumpToCategory}
      />

      <div
        className={`mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8 ${showCartPanel ? 'lg:grid-cols-[1fr_340px]' : ''}`}
      >
        <div className="min-w-0">
          <MenuSections
            categories={categories}
            canOrder={canOrder}
            disabledReason={disabledReason}
            quantityOf={quantityOf}
            onAdd={addToCart.addItem}
            onChangeQuantity={changeQuantity}
          />
          <RestaurantReviews restaurant={restaurant} reviews={reviews} />
        </div>

        {showCartPanel && <CartSidebar restaurant={restaurant} />}
      </div>

      <MobileCartBar restaurant={restaurant} />

      <ReplaceCartDialog
        pendingItem={addToCart.pendingItem}
        restaurant={restaurant}
        onConfirm={addToCart.confirmReplace}
        onCancel={addToCart.cancelReplace}
      />
    </>
  )
}
