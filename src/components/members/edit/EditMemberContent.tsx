import { Member } from "../types";
import { MemberAvatarUpload } from "../MemberAvatarUpload";
import { EditMemberForm } from "./EditMemberForm";
import { useMemberForm } from "../useMemberForm";

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
  const {
    avatarUrl,
    setAvatarUrl,
    username,
    setUsername,
    fullName,
    setFullName,
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    handleSubmit,
  } = useMemberForm(member, () => {
    const updatedMember: Member = {
      ...member,
      username,
      full_name: fullName,
      avatar_url: avatarUrl,
      is_admin: isAdmin,
      is_approved: isApproved,
      is_member: isMember,
    };
    onUpdate(updatedMember);
  }, onClose);

  return (
    <div className="space-y-6">
      <MemberAvatarUpload
        memberId={member.id}
        username={member.username}
        avatarUrl={avatarUrl || member.avatar_url || ''}
        onAvatarUpdate={setAvatarUrl}
      />

      <EditMemberForm
        member={member}
        onSubmit={handleSubmit}
        onCancel={onClose}
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
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