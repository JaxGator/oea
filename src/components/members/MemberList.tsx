import { Profile } from "@/types/auth";
import { MemberListContainer } from "./list/MemberListContainer";

interface MemberListProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberList(props: MemberListProps) {
  return <MemberListContainer {...props} />;
}