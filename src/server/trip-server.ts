import { api } from './api'

export type TripDetails = {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

type TripCreate = Omit<TripDetails, 'id' | 'is_confirmed' > & {
  email_to_invite: string[]
}

async function getById(id: string) {
  try {
    const { data } = await api.get<{ trip: TripDetails }>(`/trips/${id}`)

    return data.trip
  } catch (err) {
    throw err
  }
}

async function create({ destination, email_to_invite, starts_at, ends_at } : TripCreate) {
  try {
    const { data } = await api.post<{ tripId: string }>('/trips/', {
      destination, 
      email_to_invite, 
      starts_at, 
      ends_at,
      owner_name: 'Iris',
      owner_email: 'iris@email'
    })

    return data

  } catch (err) {
    throw err
  }
}

async function update({
  id,
  destination,
  starts_at,
  ends_at,
}: Omit<TripDetails, "is_confirmed">) {
  try {
    await api.put(`/trips/${id}`, {
      destination,
      starts_at,
      ends_at,
    })
  } catch (error) {
    throw error
  }
}

export const tripServer = { getById , create, update}