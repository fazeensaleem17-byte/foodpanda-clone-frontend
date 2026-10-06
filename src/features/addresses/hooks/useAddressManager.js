import { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@shared/utils/errors'
import { addressesApi } from '../api/addressesApi'
import { useAddresses } from './useAddresses'

/** List, add, edit, delete and set-default logic for the "My addresses" card. */
export function useAddressManager() {
  const { data, loading, error, reload } = useAddresses()
  const [editing, setEditing] = useState(null) // null | 'new' | address
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const save = async (payload) => {
    if (editing === 'new') await addressesApi.create(payload)
    else await addressesApi.update(editing.id, payload)
    toast.success(editing === 'new' ? 'Address added' : 'Address updated')
    setEditing(null)
    reload({ silent: true })
  }

  const remove = async () => {
    setBusy(true)
    try {
      await addressesApi.remove(deleting.id)
      toast.success('Address deleted')
      reload({ silent: true })
    } catch (err) {
      // 409: address is used by an existing order
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  const makeDefault = async (a) => {
    try {
      await addressesApi.update(a.id, { is_default: true })
      toast.success('Default address updated')
      reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return {
    data,
    loading,
    error,
    reload,
    editing,
    setEditing,
    deleting,
    setDeleting,
    busy,
    save,
    remove,
    makeDefault,
  }
}
