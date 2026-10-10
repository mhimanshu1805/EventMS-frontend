import { UserRolePage } from './AdminOrganizers'

export default function AdminParticipants() {
  return (
    <UserRolePage
      role="PARTICIPANT"
      title="Participants"
      description="Accounts that can register for published events and ask questions."
    />
  )
}
