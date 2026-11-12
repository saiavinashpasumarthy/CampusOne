
import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Building2,
  BedDouble,
  Users,
  MapPin,
  MoreHorizontal,
  SlidersHorizontal,
  X,
  ChevronRight,
  LayoutGrid,
  List,
Save,
Pencil,
Trash2,
Wrench,
CheckCircle2,
} from 'lucide-react'

const initialHostels = [
  {
    id: 1,
    name: 'Boys Hostel A',
    code: 'BH-001',
    type: 'Boys',
    location: 'North Campus',
    warden: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    rooms: 64,
    totalBeds: 250,
    occupiedBeds: 230,
    maintenanceBeds: 4,
    roomList: [
      { id: 1, number: '101', type: 'Standard', capacity: 4, occupied: 4, status: 'Full' },
      { id: 2, number: '102', type: 'Standard', capacity: 4, occupied: 3, status: 'Available' },
      { id: 3, number: '103', type: 'AC', capacity: 2, occupied: 2, status: 'Full' },
      { id: 4, number: '104', type: 'Standard', capacity: 4, occupied: 0, status: 'Available' },
      { id: 5, number: '105', type: 'Standard', capacity: 4, occupied: 0, status: 'Maintenance' },
    ],
    facilities: ['Wi-Fi', 'Laundry', 'Gym', 'Study Hall'],
    color: 'blue',
  },
  {
    id: 2,
    name: 'Boys Hostel B',
    code: 'BH-002',
    type: 'Boys',
    location: 'East Campus',
    warden: 'Suresh Reddy',
    phone: '+91 98765 43211',
    rooms: 52,
    totalBeds: 200,
    occupiedBeds: 168,
    maintenanceBeds: 2,
    roomList: [],
    facilities: ['Wi-Fi', 'Laundry', 'Common Room'],
    color: 'indigo',
  },
  {
    id: 3,
    name: 'Girls Hostel A',
    code: 'GH-001',
    type: 'Girls',
    location: 'South Campus',
    warden: 'Priya Sharma',
    phone: '+91 98765 43212',
    rooms: 68,
    totalBeds: 250,
    occupiedBeds: 220,
    maintenanceBeds: 3,
    roomList: [],
    facilities: ['Wi-Fi', 'Laundry', 'Security', 'Study Hall'],
    color: 'pink',
  },
  {
    id: 4,
    name: 'Girls Hostel B',
    code: 'GH-002',
    type: 'Girls',
    location: 'South Campus',
    warden: 'Ananya Rao',
    phone: '+91 98765 43213',
    rooms: 55,
    totalBeds: 200,
    occupiedBeds: 152,
    maintenanceBeds: 5,
    roomList: [],
    facilities: ['Wi-Fi', 'Laundry', 'Common Room'],
    color: 'purple',
  },
  {
    id: 5,
    name: 'International Hostel',
    code: 'IH-001',
    type: 'International',
    location: 'Central Campus',
    warden: 'David Thomas',
    phone: '+91 98765 43214',
    rooms: 48,
    totalBeds: 200,
    occupiedBeds: 180,
    maintenanceBeds: 1,
    roomList: [],
    facilities: ['Wi-Fi', 'Dining', 'Laundry', 'Gym'],
    color: 'emerald',
  },
  {
    id: 6,
    name: 'Postgraduate Hostel',
    code: 'PG-001',
    type: 'Boys',
    location: 'West Campus',
    warden: 'Arjun Mehta',
    phone: '+91 98765 43215',
    rooms: 36,
    totalBeds: 140,
    occupiedBeds: 122,
    maintenanceBeds: 2,
    roomList: [],
    facilities: ['Wi-Fi', 'Study Hall', 'Common Room'],
    color: 'amber',
  },
]

const filters = ['All', 'Boys', 'Girls', 'International']

const colorStyles = {
  blue: 'from-blue-500/15 to-cyan-500/5 text-blue-600 dark:text-blue-400',
  indigo: 'from-indigo-500/15 to-blue-500/5 text-indigo-600 dark:text-indigo-400',
  pink: 'from-pink-500/15 to-rose-500/5 text-pink-600 dark:text-pink-400',
  purple: 'from-purple-500/15 to-fuchsia-500/5 text-purple-600 dark:text-purple-400',
  emerald: 'from-emerald-500/15 to-teal-500/5 text-emerald-600 dark:text-emerald-400',
  amber: 'from-amber-500/15 to-orange-500/5 text-amber-600 dark:text-amber-400',
}

function StatCard({ label, value, description, icon: Icon, tone }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function OccupancyBar({ occupied, total }) {
  const percentage = total ? Math.round((occupied / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-[var(--color-text-muted)]">Occupancy</span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--glass-bg-strong)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function HostelCard({ hostel, onSelect }) {
  const availableBeds =
    hostel.totalBeds - hostel.occupiedBeds - hostel.maintenanceBeds

  return (
    <article className="glass-panel group overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-glass)]">
      <div className={`bg-gradient-to-br ${colorStyles[hostel.color]} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/50 backdrop-blur-sm dark:bg-black/10">
            <Building2 size={23} />
          </div>
          <button
            type="button"
            aria-label={`More options for ${hostel.name}`}
            title="More options"
            className="glass-button h-9 w-9"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">
            {hostel.code}
          </p>
          <h3 className="mt-1 text-lg font-bold">{hostel.name}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs opacity-80">
            <MapPin size={13} />
            {hostel.location}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Rooms</p>
            <p className="mt-1 font-semibold">{hostel.rooms}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Total beds</p>
            <p className="mt-1 font-semibold">{hostel.totalBeds}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Available</p>
            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {availableBeds}
            </p>
          </div>
        </div>

        <OccupancyBar
          occupied={hostel.occupiedBeds}
          total={hostel.totalBeds}
        />

        <div className="flex flex-wrap gap-1.5">
          {hostel.facilities.slice(0, 3).map((facility) => (
            <span
              key={facility}
              className="rounded-lg border border-[var(--glass-border-subtle)] bg-[var(--glass-bg)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-muted)]"
            >
              {facility}
            </span>
          ))}
          {hostel.facilities.length > 3 && (
            <span className="rounded-lg bg-[var(--glass-bg)] px-2.5 py-1 text-[10px] text-[var(--color-text-muted)]">
              +{hostel.facilities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--glass-border-subtle)] pt-4">
          <div className="min-w-0">
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Assigned Warden
            </p>
            <p className="mt-1 truncate text-sm font-semibold">
              {hostel.warden}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(hostel)}
            className="glass-button gap-1.5 px-3 py-2 text-xs font-semibold"
          >
            Manage
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}

function HostelDetails({ hostel, onBack, onAddRoom }) {
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [roomError, setRoomError] = useState('')
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Standard',
    capacity: '4',
    occupied: '0',
    status: 'Available',
  })

  const rooms = hostel.roomList || []
  const occupied = hostel.occupiedBeds
  const maintenance = hostel.maintenanceBeds
  const available = hostel.totalBeds - occupied - maintenance

  function closeRoomModal() {
    setShowAddRoomModal(false)
    setRoomError('')
    setNewRoom({
      number: '',
      type: 'Standard',
      capacity: '4',
      occupied: '0',
      status: 'Available',
    })
  }

  function handleAddRoom(event) {
    event.preventDefault()
    setRoomError('')

    const number = newRoom.number.trim()
    const capacity = Number(newRoom.capacity)
    const occupiedBeds = Number(newRoom.occupied)

    if (!number) {
      setRoomError('Enter a room number.')
      return
    }

    if (rooms.some((room) => room.number.toLowerCase() === number.toLowerCase())) {
      setRoomError('This room number already exists in this hostel.')
      return
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      !Number.isInteger(occupiedBeds) ||
      occupiedBeds < 0 ||
      occupiedBeds > capacity
    ) {
      setRoomError('Enter a valid capacity and occupancy.')
      return
    }

    if (newRoom.status === 'Maintenance' && occupiedBeds > 0) {
      setRoomError('A maintenance room cannot have occupied beds.')
      return
    }

    const room = {
      id: Date.now(),
      number,
      type: newRoom.type,
      capacity,
      occupied: occupiedBeds,
      status:
        newRoom.status === 'Maintenance'
          ? 'Maintenance'
          : occupiedBeds === capacity
            ? 'Full'
            : 'Available',
    }

    onAddRoom(room)
    closeRoomModal()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="glass-button gap-2 px-3 py-2 text-sm"
        >
          <ChevronRight className="rotate-180" size={16} />
          All hostels
        </button>
        <button
          type="button"
          onClick={() => {
            setRoomError('')
            setShowAddRoomModal(true)
          }}
          className="glass-button gap-2 px-4 py-2 text-sm font-semibold"
        >
          <Plus size={16} />
          Add room
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              {hostel.code} · {hostel.type} hostel
            </p>
            <h2 className="mt-2 text-2xl font-bold">{hostel.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <MapPin size={15} />
              {hostel.location}
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Active
          </span>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Total rooms', hostel.rooms],
            ['Total beds', hostel.totalBeds],
            ['Occupied beds', occupied],
            ['Available beds', available],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-[var(--glass-bg)] p-4"
            >
              <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
              <p className="mt-2 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="font-semibold">Bed availability</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Current status across this hostel
          </p>

          <div className="mt-6 space-y-5">
            {[
              { label: 'Occupied', value: occupied, color: 'bg-blue-500' },
              { label: 'Available', value: available, color: 'bg-emerald-500' },
              { label: 'Maintenance', value: maintenance, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">
                    {item.label}
                  </span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--glass-bg-strong)]">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${hostel.totalBeds ? (item.value / hostel.totalBeds) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h3 className="font-semibold">Hostel information</h3>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Assigned Warden
              </p>
              <p className="mt-1 text-sm font-semibold">{hostel.warden}</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {hostel.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Facilities
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hostel.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="rounded-lg bg-[var(--glass-bg)] px-3 py-1.5 text-xs"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-semibold">Rooms</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Room inventory for this hostel
            </p>
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">
            {rooms.length} listed · {hostel.rooms} total rooms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[var(--glass-bg)] text-xs text-[var(--color-text-muted)]">
              <tr>
                <th className="px-5 py-3 font-semibold">Room</th>
                <th className="px-5 py-3 font-semibold">Room type</th>
                <th className="px-5 py-3 font-semibold">Capacity</th>
                <th className="px-5 py-3 font-semibold">Occupancy</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)]"
                  >
                    No room records have been added to this hostel yet.
                    Use <span className="font-semibold">Add room</span> to create
                    the first room record.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-t border-[var(--glass-border-subtle)]"
                  >
                    <td className="px-5 py-4 font-semibold">{room.number}</td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">
                      {room.type}
                    </td>
                    <td className="px-5 py-4">{room.capacity} beds</td>
                    <td className="px-5 py-4">
                      {room.occupied} / {room.capacity}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          room.status === 'Full'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : room.status === 'Maintenance'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="glass-panel-strong w-full max-w-lg rounded-2xl p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Add Room</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Add a room to {hostel.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={closeRoomModal}
                className="glass-button rounded-xl p-2"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              {roomError && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {roomError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm text-[var(--color-text-muted)]">
                  Room number *
                </label>
                <input
                  required
                  value={newRoom.number}
                  onChange={(event) =>
                    setNewRoom((current) => ({
                      ...current,
                      number: event.target.value,
                    }))
                  }
                  placeholder="e.g. 106"
                  className="glass-input w-full rounded-xl px-3 py-2.5"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-text-muted)]">
                    Room type
                  </label>
                  <select
                    value={newRoom.type}
                    onChange={(event) =>
                      setNewRoom((current) => ({
                        ...current,
                        type: event.target.value,
                      }))
                    }
                    className="glass-input w-full rounded-xl px-3 py-2.5"
                  >
                    <option value="Standard">Standard</option>
                    <option value="AC">AC</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-text-muted)]">
                    Capacity (beds) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={newRoom.capacity}
                    onChange={(event) =>
                      setNewRoom((current) => ({
                        ...current,
                        capacity: event.target.value,
                      }))
                    }
                    className="glass-input w-full rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-text-muted)]">
                    Occupied beds
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newRoom.occupied}
                    onChange={(event) =>
                      setNewRoom((current) => ({
                        ...current,
                        occupied: event.target.value,
                      }))
                    }
                    className="glass-input w-full rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[var(--color-text-muted)]">
                    Room condition
                  </label>
                  <select
                    value={newRoom.status}
                    onChange={(event) =>
                      setNewRoom((current) => ({
                        ...current,
                        status: event.target.value,
                        occupied:
                          event.target.value === 'Maintenance'
                            ? '0'
                            : current.occupied,
                      }))
                    }
                    className="glass-input w-full rounded-xl px-3 py-2.5"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-[var(--glass-border)] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeRoomModal}
                  className="glass-button rounded-xl px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button rounded-xl px-5 py-2.5 font-medium"
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Save size={16} />
                    Add Room
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CollegeHostelsPage() {
  const [hostels, setHostels] = useState(initialHostels)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [view, setView] = useState('grid')
  const [showAddModal, setShowAddModal] = useState(false)
const [formError, setFormError] = useState('')

const [newHostel, setNewHostel] = useState({
  name: '',
  code: '',
  type: 'Boys',
  location: '',
  address: '',
  warden: '',
  phone: '',
  floors: '',
  rooms: '',
  totalBeds: '',
  facilities: [],
  description: '',
})

const availableFacilities = [
  'Wi-Fi',
  'Laundry',
  'Gym',
  'Study Hall',
  'Common Room',
  'Dining',
  'Security',
]

  const totals = useMemo(() => {
    return hostels.reduce(
      (result, hostel) => {
        result.rooms += hostel.rooms
        result.beds += hostel.totalBeds
        result.occupied += hostel.occupiedBeds
        result.maintenance += hostel.maintenanceBeds
        return result
      },
      { rooms: 0, beds: 0, occupied: 0, maintenance: 0 },
    )
  }, [hostels])

  const filteredHostels = useMemo(() => {
    const query = search.trim().toLowerCase()

    return hostels.filter((hostel) => {
      const matchesType =
        activeFilter === 'All' || hostel.type === activeFilter

      const matchesSearch =
        !query ||
        hostel.name.toLowerCase().includes(query) ||
        hostel.code.toLowerCase().includes(query) ||
        hostel.location.toLowerCase().includes(query) ||
        hostel.warden.toLowerCase().includes(query)

      return matchesType && matchesSearch
    })
  }, [hostels, search, activeFilter])

  if (selectedHostel) {
    const currentHostel =
      hostels.find((item) => item.id === selectedHostel.id) || selectedHostel

    return (
      <HostelDetails
        hostel={currentHostel}
        onBack={() => setSelectedHostel(null)}
        onAddRoom={(room) => {
          setHostels((current) =>
            current.map((item) =>
              item.id === selectedHostel.id
                ? {
                    ...item,
                    roomList: [...(item.roomList || []), room],
                    rooms: item.rooms + 1,
                    totalBeds: item.totalBeds + room.capacity,
                    occupiedBeds: item.occupiedBeds + room.occupied,
                    maintenanceBeds:
                      item.maintenanceBeds +
                      (room.status === 'Maintenance' ? room.capacity : 0),
                  }
                : item,
            ),
          )
        }}
      />
    )
  }
function handleCreateHostel(event) {
  event.preventDefault()
  setFormError('')

  const name = newHostel.name.trim()
  const code = newHostel.code.trim().toUpperCase()

  if (!name || !code || !newHostel.location.trim()) {
    setFormError('Please complete all required fields.')
    return
  }

  if (
    hostels.some(
      (hostel) => hostel.code.toLowerCase() === code.toLowerCase(),
    )
  ) {
    setFormError('This hostel code is already in use.')
    return
  }

  const rooms = Number(newHostel.rooms)
  const totalBeds = Number(newHostel.totalBeds)

  if (
    !Number.isInteger(rooms) ||
    !Number.isInteger(totalBeds) ||
    rooms < 1 ||
    totalBeds < rooms
  ) {
    setFormError('Enter valid room and bed capacities.')
    return
  }

  const hostel = {
    id: Date.now(),
    name,
    code,
    type: newHostel.type,
    location: newHostel.location.trim(),
    address: newHostel.address.trim(),
    warden: newHostel.warden.trim() || 'Not assigned',
    phone: newHostel.phone.trim(),
    floors: Number(newHostel.floors) || 1,
    rooms,
    totalBeds,
    occupiedBeds: 0,
    maintenanceBeds: 0,
    roomList: [],
    facilities: newHostel.facilities,
    description: newHostel.description.trim(),
    color: 'blue',
  }

  setHostels((current) => [...current, hostel])
  setNewHostel({
    name: '',
    code: '',
    type: 'Boys',
    location: '',
    address: '',
    warden: '',
    phone: '',
    floors: '',
    rooms: '',
    totalBeds: '',
    facilities: [],
    description: '',
  })
  setShowAddModal(false)
}
  return (
    <div className="space-y-7 pb-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Accommodation management
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Hostels & Rooms
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
            Manage hostel facilities, room inventory, wardens and bed
            availability across your college.
          </p>
        </div>

        <button
          type="button"
          className="glass-button gap-2 px-4 py-2.5 text-sm font-semibold"
          onClick={() => {
            setFormError('')
            setShowAddModal(true)}}
        >
          <Plus size={17} />
          Add Hostel
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Hostels"
          value={hostels.length}
          description="Registered hostels"
          icon={Building2}
          tone="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Total Rooms"
          value={totals.rooms.toLocaleString('en-IN')}
          description="Across all hostels"
          icon={LayoutGrid}
          tone="bg-violet-500/10 text-violet-500"
        />
        <StatCard
          label="Total Beds"
          value={totals.beds.toLocaleString('en-IN')}
          description="Registered bed capacity"
          icon={BedDouble}
          tone="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          label="Occupied Beds"
          value={`${Math.round((totals.occupied / totals.beds) * 100)}%`}
          description={`${totals.occupied.toLocaleString('en-IN')} beds occupied`}
          icon={Users}
          tone="bg-amber-500/10 text-amber-500"
        />
      </section>

      <section className="glass-panel rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search hostels, wardens, locations..."
              className="glass-input w-full py-2.5 pl-10 pr-10 text-sm"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--glass-bg-strong)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-[var(--glass-border-subtle)] p-1">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView('grid')}
                className={`rounded-lg p-2 ${
                  view === 'grid'
                    ? 'bg-[var(--glass-bg-strong)] text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView('list')}
                className={`rounded-lg p-2 ${
                  view === 'list'
                    ? 'bg-[var(--glass-bg-strong)] text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Registered Hostels</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Showing {filteredHostels.length} of {hostels.length} hostels
            </p>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-[var(--color-text-muted)] sm:flex">
            <SlidersHorizontal size={14} />
            Filtered by {activeFilter}
          </span>
        </div>

        {filteredHostels.length === 0 ? (
          <div className="glass-panel rounded-2xl px-5 py-14 text-center">
            <Building2
              size={30}
              className="mx-auto text-[var(--color-text-muted)]"
            />
            <h3 className="mt-3 font-semibold">No hostels found</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Try a different search term or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActiveFilter('All')
              }}
              className="mt-4 text-sm font-semibold text-[var(--color-primary)]"
            >
              Clear filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredHostels.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                onSelect={setSelectedHostel}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-[var(--glass-bg)] text-xs text-[var(--color-text-muted)]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Hostel</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Warden</th>
                    <th className="px-5 py-4 font-semibold">Rooms</th>
                    <th className="px-5 py-4 font-semibold">Occupancy</th>
                    <th className="px-5 py-4 font-semibold">Available beds</th>
                    <th className="px-5 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHostels.map((hostel) => {
                    const available =
                      hostel.totalBeds -
                      hostel.occupiedBeds -
                      hostel.maintenanceBeds

                    return (
                      <tr
                        key={hostel.id}
                        className="border-t border-[var(--glass-border-subtle)]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold">{hostel.name}</p>
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            {hostel.code}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-[var(--color-text-muted)]">
                          {hostel.type}
                        </td>
                        <td className="px-5 py-4">{hostel.warden}</td>
                        <td className="px-5 py-4">{hostel.rooms}</td>
                        <td className="px-5 py-4">
                          {Math.round(
                            (hostel.occupiedBeds / hostel.totalBeds) * 100,
                          )}
                          %
                        </td>
                        <td className="px-5 py-4">{available}</td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedHostel(hostel)}
                            className="font-semibold text-[var(--color-primary)] hover:underline"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-[var(--color-text-muted)]">
        Sample hostel data is currently displayed. Live hostel records will be
        connected through the backend.
      </p>
      {showAddModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="glass-panel-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Add New Hostel
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Create a hostel and configure its initial capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="glass-button rounded-xl p-2"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleCreateHostel} className="space-y-6">
        {formError && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        )}

        <section>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Basic Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Hostel Name *
              </label>
              <input
                required
                value={newHostel.name}
                onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
                placeholder="e.g. Sunrise Boys Hostel"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Hostel Code *
              </label>
              <input
                required
                value={newHostel.code}
                onChange={(e) => setNewHostel({ ...newHostel, code: e.target.value.toUpperCase() })}
                placeholder="e.g. BH-03"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Hostel Type *
              </label>
              <select
                value={newHostel.type}
                onChange={(e) => setNewHostel({ ...newHostel, type: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2.5"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Location *
              </label>
              <input
                required
                value={newHostel.location}
                onChange={(e) => setNewHostel({ ...newHostel, location: e.target.value })}
                placeholder="e.g. North Campus"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Full Address
              </label>
              <input
                value={newHostel.address}
                onChange={(e) => setNewHostel({ ...newHostel, address: e.target.value })}
                placeholder="Enter hostel address"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Warden Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              value={newHostel.warden}
              onChange={(e) => setNewHostel({ ...newHostel, warden: e.target.value })}
              placeholder="Warden name"
              className="glass-input w-full rounded-xl px-3 py-2.5"
            />
            <input
              value={newHostel.phone}
              onChange={(e) => setNewHostel({ ...newHostel, phone: e.target.value })}
              placeholder="Warden phone number"
              className="glass-input w-full rounded-xl px-3 py-2.5"
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Capacity
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Floors
              </label>
              <input
                type="number"
                min="1"
                value={newHostel.floors}
                onChange={(e) => setNewHostel({ ...newHostel, floors: e.target.value })}
                placeholder="e.g. 4"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Total Rooms *
              </label>
              <input
                required
                type="number"
                min="1"
                value={newHostel.rooms}
                onChange={(e) => setNewHostel({ ...newHostel, rooms: e.target.value })}
                placeholder="e.g. 80"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Total Beds *
              </label>
              <input
                required
                type="number"
                min="1"
                value={newHostel.totalBeds}
                onChange={(e) => setNewHostel({ ...newHostel, totalBeds: e.target.value })}
                placeholder="e.g. 240"
                className="glass-input w-full rounded-xl px-3 py-2.5"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Facilities
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {availableFacilities.map((facility) => (
              <label key={facility} className="flex cursor-pointer items-center gap-2 text-sm"
                style={{ color: 'var(--color-text-muted)' }}>
                <input
                  type="checkbox"
                  checked={newHostel.facilities.includes(facility)}
                  onChange={(e) => {
                    setNewHostel((current) => ({
                      ...current,
                      facilities: e.target.checked
                        ? [...current.facilities, facility]
                        : current.facilities.filter((item) => item !== facility),
                    }))
                  }}
                  className="accent-blue-500"
                />
                {facility}
              </label>
            ))}
          </div>
        </section>

        <section>
          <label className="mb-1.5 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Description
          </label>
          <textarea
            rows="3"
            value={newHostel.description}
            onChange={(e) => setNewHostel({ ...newHostel, description: e.target.value })}
            placeholder="Brief description about this hostel..."
            className="glass-input w-full rounded-xl px-3 py-2.5"
          />
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row"
          style={{ borderColor: 'var(--glass-border)' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="glass-button rounded-xl px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="glass-button rounded-xl px-5 py-2.5 font-medium"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} />
              Create Hostel
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}
