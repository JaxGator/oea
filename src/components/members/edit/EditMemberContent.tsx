
import { Member } from "../types";
import { MemberAvatarUpload } from "../MemberAvatarUpload";
import { EditMemberForm } from "./EditMemberForm";
import { useMemberForm } from "../useMemberForm";
import { useEditMember } from "./EditMemberProvider";

interface EditMemberContentProps {
  member: Member;
  onUpdate: (updatedMember: Member) => void;
  onClose: () => void;
}

export function EditMemberContent({ 
  member, 
  onUpdate, 
  onClose 
}: EditMemberContentProps) {
  console.log('EditMemberContent render with member ID:', member.id);
  const { isSubmitting, setIsSubmitting } = useEditMember();
  
  const {
    avatarUrl,
    setAvatarUrl,
    username,
    setUsername,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    handleSubmit,
  } = useMemberForm(member, async () => {
    try {
      setIsSubmitting(true);
      const updatedMember: Member = {
        ...member,
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        is_admin: isAdmin,
        is_approved: isApproved,
        is_member: isMember,
        email,
        // Ensure all required properties are present
        created_at: member.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        event_reminders_enabled: member.event_reminders_enabled || true,
        email_notifications: member.email_notifications || true,
        in_app_notifications: member.in_app_notifications || true,
        interests: member.interests || [],
        leaderboard_opt_out: member.leaderboard_opt_out || false
      };
      console.log('Submitting updated member:', updatedMember);
      await onUpdate(updatedMember);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, onClose);

  return (
    <div className="space-y-6">
      <MemberAvatarUpload
        memberId={member.id}
        username={member.username || 'user'}
        avatarUrl={avatarUrl || member.avatar_url || ''}
        onAvatarUpdate={setAvatarUrl}
      />

      <EditMemberForm
        member={member}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isApproved={isApproved}
        setIsApproved={setIsApproved}
        isMember={isMember}
        setIsMember={setIsMember}
      />
    </div>
  );
}
