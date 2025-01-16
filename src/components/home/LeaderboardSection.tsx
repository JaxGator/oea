import { Link } from "react-router-dom";
import { LeaderboardTable } from "@/components/members/leaderboard/LeaderboardTable";
import { Card } from "@/components/ui/card";

export function LeaderboardSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Leaderboard</h2>
          <Link
            to="/users"
            className="text-primary hover:text-primary/90 font-medium"
          >
            View All Users
          </Link>
        </div>
        
        <Card className="p-6">
          <LeaderboardTable limit={5} />
        </Card>
      </div>
    </section>
  );
}